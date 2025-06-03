import { Chess } from "chess.js";
import { Evaluator } from "../ai";

/**
 * Includes both material weight and piece position weight via piece-square tables
 */
const queen = [
  -50, -10, -10, 0, 0, -10, -10, -50, -10, 0, 10, 0, 0, 10, 0, -10, -10, 0, 5,
  5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, -5, 5, 0, -5, -10, 0,
  -5, -5, -5, -5, 0, -10, -10, 0, 0, 0, -5, 0, 0, -10, -50, -10, -10, -5, -5,
  -10, -10, -50,
];
const rook = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 10, 10, 10, 0, -5,
];
const bishop = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0,
  -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
  -10, -10, -10, -10, -10, -20,
];
const knight = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
  0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20,
  15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];
const pawn = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
  20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
  0, 0, -10, -5, 5, 5, 10, 10, -50, -50, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
];
const king = [
  -30, -30, -30, -40, -40, -30, -30, -30, -30, -30, -30, -40, -40, -30, -30,
  -30, -30, -30, -30, -40, -40, -30, -30, -30, -30, -30, -30, -40, -40, -30,
  -30, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
  -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 50, 0, 0, 10, 50, 20,
];

function mirror(i: number) {
  const file = Math.floor(i / 8);
  return (7 - file) * 8 + (i % 8);
}

export class PositionWeightEvaluator implements Evaluator {
  readonly PieceWeight = {
    k: 20000,
    q: 900,
    r: 500,
    b: 330,
    n: 320,
    p: 100,
  };
  constructor() {}
  evaluate(chess: Chess): number {
    let score = 0;
    const [fen, move, _others] = chess.fen().split(" ");
    let index = 0;
    for (let i = 0; i < fen.length; i++) {
      switch (fen.charAt(i)) {
        case "p":
          score -= this.PieceWeight["p"];
          score -= pawn[mirror(index)];
          break;
        case "P":
          score += this.PieceWeight["p"];
          score += pawn[index];
          break;
        case "q":
          score -= this.PieceWeight["q"];
          score -= queen[mirror(index)];
          break;
        case "Q":
          score += this.PieceWeight["q"];
          score += queen[index];
          break;
        case "n":
          score -= this.PieceWeight["n"];
          score -= knight[mirror(index)];
          break;
        case "N":
          score += this.PieceWeight["n"];
          score += knight[index];
          break;
        case "r":
          score -= this.PieceWeight["r"];
          score -= rook[mirror(index)];
          break;
        case "R":
          score += this.PieceWeight["r"];
          score += rook[index];
          break;
        case "b":
          score -= this.PieceWeight["b"];
          score -= bishop[mirror(index)];
          break;
        case "B":
          score += this.PieceWeight["b"];
          score += bishop[index];
          break;
        case "/":
          index -= 1;
          break;
        case "k":
          score -= this.PieceWeight["k"];
          score -= king[mirror(index)];
          break;
        case "K":
          score += this.PieceWeight["k"];
          score += king[index];
          break;
        default:
          index += parseInt(fen.charAt(i)) - 1;
          break;
      }
      index += 1;
    }
    if (move == "b") {
      score *= -1;
    }
    return score;
  }
}
