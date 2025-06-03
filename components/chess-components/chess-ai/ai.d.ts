import { Move, Chess } from "chess.js";

export interface Evaluator {
  PieceWeight: Record<string, number>;
  evaluate(chess: Chess): number;
}

export type Result = [score: number, moves: Move];
