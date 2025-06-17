import { Chess, Piece, PieceSymbol, Square, Color } from "chess.js";

export function getPieceIDOnSquare(chess: Chess, pos: string) {
  const piece = chess.get(pos as Square);
  if (piece == undefined) {
    return "";
  } else {
    return getPieceID(piece);
  }
}

const PieceSet = new Set(["K", "N", "Q", "B", "R"]);

/**
 * Converts valid white moves to a set
 *
 * @param chess
 * @param square
 * @returns
 */
export function validMovesConversion(
  chess: Chess,
  square: string,
): Set<string> {
  if (square == "" || chess.turn() == "b") {
    return new Set<string>();
  }
  const validStringMoves = chess.moves({ square: square as Square });
  const turn = chess.turn();
  const validMoves = new Set<string>();
  for (let i = 0; i < validStringMoves.length; i++) {
    let notation = validStringMoves[i];
    // remove promotion and capture, check and checkmate
    notation = notation.replaceAll(/([x#+])|(=[QRNB])/g, "");
    // castling
    if (notation == "O-O") {
      validMoves.add(turn == "w" ? "g1" : "g8");
    } else if (notation == "O-O-O") {
      validMoves.add(turn == "w" ? "c1" : "c8");
    } else {
      // square
      const square = notation.substring(notation.length - 2);
      validMoves.add(square);
    }
  }
  return validMoves;
}

export function getSymbPieceID(color: string, ps: PieceSymbol) {
  return color + ps.toLocaleUpperCase();
}

export function getPieceID(piece: Piece) {
  return piece.color + piece.type.toLocaleUpperCase();
}

export function drawPosition(chess: Chess) {
  const fen = chess.fen().split(" ");
  fen[4] = "100";
  return new Chess(fen.join(" "));
}

export function resignPosition(chess: Chess) {
  const fen = chess.fen().split(" ");
  fen[4] = "100";
  return new Chess(fen.join(" "));
}
