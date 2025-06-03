import { Chess } from "chess.js";
import { Evaluator } from "../ai";

export class NaiveWeightEvaluator implements Evaluator {
  readonly PieceWeight = {
    k: 20000,
    q: 900,
    r: 500,
    b: 330,
    n: 320,
    p: 100,
  };
  evaluate(chess: Chess) {
    let score = 0;
    const [fen, move, ..._others] = chess.fen().split(" ");
    for (let i = 0; i < fen.length; i++) {
      switch (fen.charAt(i)) {
        case "p":
          score -= this.PieceWeight["p"];
          break;
        case "P":
          score += this.PieceWeight["p"];
          break;
        case "q":
          score -= this.PieceWeight["q"];
          break;
        case "Q":
          score += this.PieceWeight["q"];
          break;
        case "n":
          score -= this.PieceWeight["n"];
          break;
        case "N":
          score += this.PieceWeight["n"];
          break;
        case "r":
          score -= this.PieceWeight["r"];
          break;
        case "R":
          score += this.PieceWeight["r"];
          break;
        case "b":
          score -= this.PieceWeight["b"];
          break;
        case "B":
          score += this.PieceWeight["b"];
          break;
        default:
          break;
      }
    }
    return score * (move == "w" ? 1 : -1);
  }
}
