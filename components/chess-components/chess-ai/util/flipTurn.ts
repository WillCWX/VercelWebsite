import { Chess } from "chess.js";

export function swapTurn(chess: Chess) {
  const tokens = chess.fen().split(" ");
  tokens[1] = chess.turn() === "b" ? "w" : "b";
  tokens[3] = "-";
  return new Chess(tokens.join(" "));
}
