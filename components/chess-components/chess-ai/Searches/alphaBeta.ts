import { Chess, Move, Piece, Square } from "chess.js";
import { Evaluator, Result } from "../ai";

type BoardPos = {
  depth: number;
  score: number;
  move?: Move;
};

export class AlphaBeta {
  private static LIMIT = 10000;
  private static DELTA = 975;
  ev: Evaluator = null as unknown as Evaluator;
  chess: Chess = null as unknown as Chess;
  depth = 0;
  time = 0;
  score = 0;
  constructor(ev: Evaluator, chess: Chess, depth: number) {
    this.ev = ev;
    this.chess = chess;
    this.depth = depth;
  }

  private see(move: Move) {
    const square = move.to;
    // enpassent
    if (this.chess.get(square) === undefined)
      return this.ev.evaluate(this.chess);
    const cmp = (a: Piece, b: Piece) => {
      return this.ev.PieceWeight[a.type] > this.ev.PieceWeight[b.type] ? -1 : 1;
    };
    const wpieces = this.chess
      .attackers(square, "w")
      .map((s) => this.chess.get(s)!);
    wpieces.sort(cmp);
    const bpieces = this.chess
      .attackers(square, "b")
      .map((s) => this.chess.get(s)!);
    bpieces.sort(cmp);
    let score = 0;
    let turn = this.chess.turn() == "w";
    if (turn && wpieces[wpieces.length - 1].type != move.piece) {
      return Number.NEGATIVE_INFINITY;
    } else if (!turn && bpieces[bpieces.length - 1].type != move.piece) {
      return Number.NEGATIVE_INFINITY;
    }
    let prev = this.ev.PieceWeight[this.chess.get(square)!.type];
    while (wpieces.length > 0 && bpieces.length > 0) {
      if (turn) {
        const curr = wpieces.pop()!;
        if (this.ev.PieceWeight[curr.type] > prev && wpieces.length == 0) break;
        score += prev;
        prev = this.ev.PieceWeight[curr.type];
        turn = !turn;
      } else {
        const curr = bpieces.pop()!;
        if (this.ev.PieceWeight[curr.type] > prev && bpieces.length == 0) break;
        score -= prev;
        prev = this.ev.PieceWeight[curr.type];
      }
    }
    return score * (turn ? 1 : -1);
  }

  private queince(alpha: number, beta: number, depth: number): number {
    this.stats.qBranches += 1;
    if (depth <= 0) return this.ev.evaluate(this.chess);
    const statEv = this.ev.evaluate(this.chess);

    if (statEv >= beta) return statEv;
    if (statEv < alpha - AlphaBeta.DELTA) return alpha;
    if (statEv > alpha) alpha = statEv;

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

    let bestScore = statEv;
    const attMoves = this.chess
      .moves({ verbose: true })
      .filter((v) => v.captured);
    if (attMoves.length == 0) {
      return bestScore;
    }
    for (let i = 1; i <= depth - 1; i++) {
      for (const move of attMoves) {
        if (statEv < alpha - AlphaBeta.DELTA) return alpha;
        const seeEval = this.see(move);
        if (seeEval > 0) {
          this.chess.move(move);
          const score = -this.queince(-beta, -alpha, depth);
          this.chess.undo();
          if (score > alpha) alpha = score;
          if (score > bestScore) bestScore = score;
          if (score >= beta) break;
        }
      }
    }
    this.transposition.set(hashed, {
      score: bestScore,
      depth: 0,
    });
    return bestScore;
  }

  transposition = new Map<string, BoardPos>();

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

  private idds(
    alpha: number,
    beta: number,
    depth: number,
    canNull: boolean,
  ): number {
    if (depth <= 0) return this.queince(alpha, beta, 3);
    this.stats.branches += 1;
    if (this.time <= Date.now()) return this.score;
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
    if (canNull && depth >= 3 && depth != this.depth && !this.chess.isCheck()) {
      const undoNullMove = this.nullMove();
      const score = -this.idds(-beta, -(beta - 1), depth - 3, false);
      undoNullMove();
      if (score >= beta) {
        this.stats.nullPruned += 1;
        return beta;
      }
    }
    let bestScore = Number.NEGATIVE_INFINITY;
    const moves = this.chess.moves({ verbose: true });
    let bestMove = moves[0];
    for (const move of moves) {
      if (this.time <= Date.now()) break;
      this.chess.move(move);
      const score = -this.idds(-beta, -alpha, depth - 1, canNull);
      this.chess.undo();
      if (score > alpha) alpha = score;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (score >= beta) {
        this.stats.abPruned += 1;
        break;
      }
    }
    if (Date.now() > this.time) return bestScore;
    this.transposition.set(hashed, {
      score: bestScore,
      depth: depth,
      move: bestMove,
    });
    return bestScore;
  }
  stats = {
    branches: 0,
    abPruned: 0,
    nullPruned: 0,
    iterationPruned: 0,
    transpositionPurned: 0,
    qBranches: 0,
  };
  resetStats() {
    this.stats.abPruned = 0;
    this.stats.branches = 0;
    this.stats.nullPruned = 0;
    this.stats.iterationPruned = 0;
    this.stats.transpositionPurned = 0;
    this.stats.qBranches = 0;
  }
  getStats() {
    return `\n        
        total: ${this.stats.branches}\n
        abP: ${this.stats.abPruned}\n
        nullP: ${this.stats.nullPruned}\n
        iterP: ${this.stats.iterationPruned}\n
        transP: ${this.stats.transpositionPurned}\n
        qTotal: ${this.stats.qBranches}
        `;
  }
  softResetTP() {
    this.transposition.forEach((v, k, m) => {
      if (
        v.score == Number.NEGATIVE_INFINITY ||
        v.score == Number.POSITIVE_INFINITY
      ) {
        m.delete(k);
      }
    });
  }
  search(): Result {
    this.time = Date.now() + AlphaBeta.LIMIT;
    for (let i = 1; i <= this.depth; i += 1) {
      this.softResetTP();
      this.score = this.idds(
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        i,
        i >= 4,
      );
    }
    const { score, depth, move } = this.transposition.get(this.hashPos())!;
    const moves = this.chess.moves({ verbose: true });
    for (const temp of moves) {
      this.chess.move(temp);
      const { score, depth, move } = this.transposition.has(this.hashPos())
        ? this.transposition.get(this.hashPos())!
        : { score: NaN, depth: -1, move: {} };
      this.chess.undo();
      console.log(
        `${score} ${temp.san} ${move?.san ? move.san : "nulled"}... ${depth}`,
      );
    }
    console.log(this.chess.ascii());
    console.log("(%d) vs %d at depth %d", this.score, score, depth);
    console.log(this.getStats());
    return [score, move!];
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
