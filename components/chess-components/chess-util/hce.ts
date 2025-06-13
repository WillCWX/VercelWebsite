import { startAlphaBeta } from "../chess-ai/Searches/alphaBeta";
import { NaiveWeightEvaluator } from "../chess-ai/Evaluators/NaiveWeightEvaluator";
import { negaMax } from "../chess-ai/Searches/negamax";
import { PositionWeightEvaluator } from "../chess-ai/Evaluators/PositionWeightEvaluator";
import { Chess } from "chess.js";

type Weight = "NaiveBase" | "PositionWeight";
type Algo = "negamax" | "alphaBeta";

export class Algorithm {
  eval;
  constructor(pos: string, type: Algo, weight: Weight) {
    const heuristic =
      weight == "NaiveBase"
        ? new NaiveWeightEvaluator()
        : new PositionWeightEvaluator();
    const depth = 4;
    const chess = new Chess(pos);
    this.eval =
      type == "alphaBeta"
        ? () => startAlphaBeta(heuristic, chess, depth)
        : () => negaMax(heuristic, chess, depth);
  }
}
