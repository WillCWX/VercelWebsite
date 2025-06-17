"use client";

import "./chessboard.css";
import { FenBoard } from "./FenBoard";
import { ChessProvider, MyChess } from "../chess-hook/ChessContext";
import { Chess } from "chess.js";
import { validMovesConversion } from "../chess-util/chessjsWrapper";
import { SelectedSquareProvider } from "../chess-hook/SelectedSquareContext";
import { GameState } from "./GameState";
import { MoveViewer } from "./MoveViewer";
import { ChesterReader } from "./ChesterReader";
import { ChesterLogProvider } from "../chess-hook/ChesterLogContext";

const defaultBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function Chessboard() {
  const chessjs = new Chess(defaultBoard);
  const myChess: MyChess = {
    chess: chessjs,
    moveHistory: [],
    validMoves: (square: string) => validMovesConversion(chessjs, square),
  };

  return (
    <div className="flex flex-col items-center align-center">
      <ChessProvider initial={myChess}>
        <SelectedSquareProvider>
          <ChesterLogProvider>
            <div className="flex flex-row min-w-full justify-center">
              <GameState />
              <FenBoard />
              <MoveViewer />
            </div>
            <ChesterReader />
          </ChesterLogProvider>
        </SelectedSquareProvider>
      </ChessProvider>
    </div>
  );
}
