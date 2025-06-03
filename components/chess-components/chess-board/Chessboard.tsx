"use client";

import "./chessboard.css";
import { FenBoard } from "./FenBoard";
import { ChessProvider, MyChess } from "../chess-hook/ChessContext";
import { Chess } from "chess.js";
import { useState } from "react";
import { validMovesConversion } from "../chess-util/chessjsWrapper";
import { SelectedSquareProvider } from "../chess-hook/SelectedSquareContext";

const defaultBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function Chessboard() {
  const chessjs = new Chess(defaultBoard);
  const myChess: MyChess = {
    chess: chessjs,
    moveHistory: [],
    validMoves: (square: string) => validMovesConversion(chessjs, square),
  };
  const [size, setSize] = useState(50);
  const Debug = () => {
    return <button onClick={() => setSize(size + 10)}>size up</button>;
  };
  return (
    <div className="flex flex-col items-center align-center">
      <ChessProvider initial={myChess}>
        <SelectedSquareProvider>
          <FenBoard size={size} />
        </SelectedSquareProvider>
      </ChessProvider>
    </div>
  );
}
