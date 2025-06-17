import { Move, Chess } from "chess.js";

export interface Evaluator {
  PieceWeight: Record<string, number>;
  /**
   * Statically evaluates the position
   * outputs the score relative to the player
   * e.g.
   * Black: +100 (position is 100 in favour of black)
   * White: +100 (position is 100 in favour of white)
   * @param chess
   */
  evaluate(chess: Chess): number;
}

export type Result = [score: number, moves: Move, logs: string[]];
