import { Chess } from "chess.js";

export const locations = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
];

export function fenToOps(validator: Chess) {
  const [position, ..._others] = validator.fen().split(" ");
  const pos_ranks = position.split("/");
  let row = 0;
  let col = 0;
  const options = [];
  for (const rank of pos_ranks) {
    for (const note of rank) {
      // empty
      if ("12345678".match(note)) {
        for (let i = 0; i < parseInt(note); i++) {
          options.push({
            file: locations[row][col].charAt(0),
            rank: parseInt(locations[row][col].charAt(1)),
            piece: "",
            key: locations[row][col],
          });
          col += 1;
        }
        // black pieces
      } else if ("rnbqkp".match(note)) {
        options.push({
          file: locations[row][col].charAt(0),
          rank: parseInt(locations[row][col].charAt(1)),
          piece: `b${note.toUpperCase()}`,
          key: locations[row][col],
        });
        col += 1;
        // white pieces
      } else {
        options.push({
          file: locations[row][col].charAt(0),
          rank: parseInt(locations[row][col].charAt(1)),
          piece: `w${note}`,
          key: locations[row][col],
        });
        col += 1;
      }
    }
    row += 1;
    col = 0;
  }
  return options;
}
