import { Chess, Move, Piece, Square } from "chess.js";
import { Evaluator, Result } from "../ai";

type BoardPos = {
  depth: number;
  score: number;
  move?: Move;
};

export class AlphaBeta {
  // Heuristic adjustables
  private static LIMIT = 7500;
  private static DELTA = 975;

  // transposition table
  transposition = new Map<string, BoardPos>();
  softResetTP() {
    this.transposition.forEach((v, k, m) => {
      if (
        v.score == Number.NEGATIVE_INFINITY ||
        v.score == Number.POSITIVE_INFINITY
      ) {
        m.delete(k);
      } else {
        v.depth -= 1;
      }
    });
  }
  hardResetTP() {
    this.transposition = new Map<string, BoardPos>();
  }

  // ev as static evaluator and chessjs as move generator
  ev: Evaluator = null as unknown as Evaluator;
  chess: Chess = null as unknown as Chess;

  // stats
  depth = 0;
  time = 0;
  score = 0;

  constructor(ev: Evaluator, chess: Chess, depth: number) {
    this.ev = ev;
    this.chess = chess;
    this.depth = depth;
  }

  /**
   * Static Exchange Evaluation
   * Evaluates the position after a move as if a series of exchanges will occur
   *
   * @param move
   * @returns
   */
  private see(move: Move, turn: number): number {
    const currentMove = this.chess.move(move);
    const nextAttackers = this.chess
      .attackers(move.to, this.chess.turn())
      .flatMap((sq) => {
        return this.chess.moves({
          square: move.to,
          piece: this.chess.get(sq)!.type,
          verbose: true,
        });
      });
    nextAttackers.sort((a, b) => {
      return this.ev.PieceWeight[a.piece] - this.ev.PieceWeight[b.piece];
    });

    if (nextAttackers.length == 0) {
      this.chess.undo();
      return 0;
    }
    const smallest = nextAttackers[0];
    const score = Math.max(
      0,
      this.ev.PieceWeight[currentMove.captured!] - this.see(smallest, -turn),
    );
    this.chess.undo();
    return score;
  }

  /**
   * Queisce Search
   * Evaluates moves deep er until a "quiet" position is made
   * @param alpha
   * @param beta
   * @param depth
   * @returns
   */
  private queisce(
    alpha: number,
    beta: number,
    depth: number,
    turn: number,
  ): number {
    // update qStats
    this.stats.qBranches += 1;
    // * turn not needed as the score is evaluation is relative to the player
    const statEv = this.ev.evaluate(this.chess);
    if (depth <= 0) return statEv;

    // better score for the player
    if (statEv > alpha) alpha = statEv;
    // opponent will chose their better score
    if (alpha >= beta) return beta;
    // position is quiet (little score change) & prune
    if (statEv < alpha - AlphaBeta.DELTA) return alpha;

    // shortcut with transposition table
    const hashed = this.hashPos();
    if (this.transposition.has(hashed)) {
      const val = this.transposition.get(hashed)!;
      if (val.depth >= depth) {
        return val.score;
      }
      if (val.score > this.score + (depth - val.depth) * AlphaBeta.DELTA) {
        this.stats.iterationPruned += 1;
        return val.score;
      }
    }

    const attMoves = this.chess
      .moves({ verbose: true })
      .filter((v) => v.isCapture());
    // position is very quiet
    if (attMoves.length == 0) {
      return statEv;
    }
    for (const move of attMoves) {
      // prune as position is quiet enough to new alpha
      if (statEv < alpha - AlphaBeta.DELTA) return alpha;
      const seeEval = this.see(move, turn);
      if (seeEval >= 0) {
        this.chess.move(move);
        const score = -this.queisce(-beta, -alpha, depth - 1, -turn);
        this.chess.undo();
        if (score > alpha) alpha = score;
        if (alpha >= beta) break;
      } else {
        this.stats.seePruned += 1;
      }
    }
    this.transposition.set(hashed, {
      score: alpha,
      depth: depth,
    });
    return alpha;
  }

  private hashPos() {
    const [fen, move, _other] = this.chess.fen().split(" ");
    return fen + move;
  }

  private nullMove() {
    const temp = this.chess;
    const [fen, move, others] = temp.fen().split(" ");
    this.chess = new Chess(`${fen} ${move == "w" ? "b" : "w"} ${others}`);
    return () => {
      this.chess = temp;
    };
  }

  /**
   * Recursive search
   *
   * Recursively search each move to depth 0 to find the best move for the current player
   *
   * @param alpha
   * @param beta
   * @param depth
   * @param canNull
   * @param turn
   * @returns
   */
  private idds(
    alpha: number,
    beta: number,
    depth: number,
    canNull: boolean,
    turn: number,
  ): number {
    if (depth <= 0) return this.queisce(alpha, beta, 2, turn);
    // recursion branch stats
    this.stats.branches += 1;

    // no time
    if (this.time <= Date.now()) return Number.NEGATIVE_INFINITY;

    // shortcut to transposition table
    const hashed = this.hashPos();
    if (this.transposition.has(hashed)) {
      const val = this.transposition.get(hashed) as BoardPos;
      if (val.depth >= depth) {
        this.stats.transpositionPurned += 1;
        return val.score;
      }
      if (val.score > this.score + (depth - val.depth) * AlphaBeta.DELTA) {
        this.stats.iterationPruned += 1;
        return val.score;
      }
    }

    // null move pruning
    // tree is pruned when doing nothing still produces a score higher than opponent's current best move
    if (
      canNull &&
      depth >= 3 &&
      beta != Number.POSITIVE_INFINITY &&
      !this.chess.isCheck()
    ) {
      const undoNullMove = this.nullMove();
      const score = -this.idds(-beta, -(beta - 1), depth - 3, false, -turn);
      undoNullMove();
      if (score >= beta) {
        this.stats.nullPruned += 1;
        return beta;
      }
    }

    const moves = this.chess.moves({ verbose: true });
    for (const move of moves) {
      if (this.time <= Date.now()) break;
      this.chess.move(move);
      const score = -this.idds(-beta, -alpha, depth - 1, canNull, -turn);
      this.chess.undo();
      if (score > alpha) alpha = score;
      // soft break
      if (score >= beta) {
        this.stats.abPruned += 1;
        break;
      }
    }
    this.transposition.set(hashed, {
      score: alpha,
      depth: depth,
    });
    return alpha;
  }
  stats = {
    branches: 0,
    abPruned: 0,
    nullPruned: 0,
    iterationPruned: 0,
    transpositionPurned: 0,
    qBranches: 0,
    seePruned: 0,
  };
  resetStats() {
    this.stats.abPruned = 0;
    this.stats.branches = 0;
    this.stats.nullPruned = 0;
    this.stats.iterationPruned = 0;
    this.stats.transpositionPurned = 0;
    this.stats.qBranches = 0;
    this.stats.seePruned = 0;
  }
  getStats() {
    return `\n        
        total: ${this.stats.branches}\n
        abP: ${this.stats.abPruned}\n
        nullP: ${this.stats.nullPruned}\n
        iterP: ${this.stats.iterationPruned}\n
        transP: ${this.stats.transpositionPurned}\n
        qTotal: ${this.stats.qBranches}\n
        seeP: ${this.stats.seePruned}\n
        `;
  }

  getMove(target: number): Move {
    const moves = this.chess.moves({ verbose: true });
    for (const temp of moves) {
      this.chess.move(temp);
      if (this.transposition.has(this.hashPos())) {
        const { score, depth } = this.transposition.get(this.hashPos())!;
        this.chess.undo();
        if (score == target) {
          return temp;
        }
      } else {
        this.chess.undo();
      }
    }
    return moves[0];
  }

  /**
   * Iterative Deepening Search
   *
   * ensures the whole tree is searched for every depth to output optimal moves
   * @returns
   */
  search(): Result {
    this.time = Date.now() + AlphaBeta.LIMIT;
    const logs = [];
    logs.push(`Max Depth: ${this.depth}`);
    let bestMove;
    for (let i = 1; i <= this.depth; i += 1) {
      this.softResetTP();
      const score = -this.idds(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        i,
        i >= 4,
        -1,
      );
      // time limit exceded
      if (this.time <= Date.now()) {
        logs.push("Time limit exceeded!");
        break;
      } else if (
        score == Number.NEGATIVE_INFINITY ||
        score == Number.POSITIVE_INFINITY
      ) {
        this.score = score;
        bestMove = this.getMove(score);
        logs.push(`Mate Found: depth ${i}: ${bestMove.san} ${score}`);
      } else {
        this.score = score;
        bestMove = this.getMove(score);
        logs.push(`depth ${i}: ${bestMove.san}`);
      }
    }

    const move = bestMove;

    //console.log(this.chess.ascii());
    //console.log("(%d) vs %d at depth %d", this.score, score, depth);
    logs.push(this.getStats());
    this.hardResetTP();
    return [this.score, move!, logs];
  }
}

export function startAlphaBeta(
  ev: Evaluator,
  chess: Chess,
  depth: number,
): Result {
  const temp = new AlphaBeta(ev, chess, depth);
  return temp.search();
}
