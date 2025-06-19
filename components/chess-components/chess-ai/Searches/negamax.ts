import { Chess, Move } from "chess.js";
import { Evaluator, Result } from "../ai";

export function negaMax(ev: Evaluator, chess: Chess, depth: number): Result {
  if (depth <= 0) return [ev.evaluate(chess), null as unknown as Move, []];
  let max = Number.NEGATIVE_INFINITY;
  const moves = chess.moves({ verbose: true });
  let bestMove = moves[0];
  for (const move of moves) {
    chess.move(move);
    const [score, _moves, _logs] = negaMax(ev, chess, depth - 1);
    chess.undo();
    if (-score > max) {
      max = -score;
      bestMove = move;
    }
  }
  return [max, bestMove, [`Depth ${depth}: ${bestMove.san}`]];
}
