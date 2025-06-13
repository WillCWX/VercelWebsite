"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Square } from "./Square";
import { Chess, Move } from "chess.js";
import {
  MoveAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { MoveViewer } from "./MoveViewer";
import { locations } from "../chess-util/fen";
import { getSymbPieceID } from "../chess-util/chessjsWrapper";

type FenBoardInput = {
  size: number;
};

export function FenBoard({ size }: FenBoardInput) {
  // Custom hooks for updating chess state
  const myChess = useChess();
  const myChessDispatch = useChessDispatch();

  // Create 8x8 alternating colour squares
  const squareLayout = useMemo(() => {
    return locations.flatMap((curr) => {
      return curr.map((str) => {
        return (
          <Square
            file={str.charAt(0)}
            rank={parseInt(str.charAt(1))}
            key={str}
            size={size}
          />
        );
      });
    });
  }, [size]);

  // memoize chess state update function to not trigger worker recreation
  const chessRef = useRef(myChess.chess);
  useEffect(() => {
    chessRef.current = myChess.chess;
  }, [myChess]);
  const engineMove = useCallback(
    (event: MessageEvent) => {
      if (chessRef.current.turn() == "w" || chessRef.current.isGameOver()) {
        return;
      }
      const ans: Move = event.data;
      const moveAction: MoveAction = {
        type: "move",
        move: {
          from: ans.from,
          to: ans.to,
          promotion: ans.promotion
            ? getSymbPieceID("b", ans.promotion)
            : ans.promotion,
        },
      };

      myChessDispatch(moveAction);
    },
    [myChessDispatch],
  );

  // setup engine and postMessage to engine on black's turn
  const myEngine = useRef<Worker>();
  useEffect(() => {
    myEngine.current = new Worker(
      new URL("../chess-util/engine.ts", import.meta.url),
    );
    myEngine.current.onmessage = engineMove;
    return () => {
      myEngine.current?.terminate();
    };
  }, [engineMove]);
  useEffect(() => {
    if (
      myChess.chess.turn() == "w" ||
      myChess.chess.isGameOver() ||
      myEngine.current == undefined
    ) {
      return;
    }
    myEngine.current.postMessage(myChess.chess.fen());
  }, [myChess]);

  const Debugger = () => {
    return (
      <button onClick={() => console.log(myChess.chess.ascii())}>Debug</button>
    );
  };
  const ResetButton = () => {
    return (
      <button
        onClick={() => {
          const new_valid = new Chess();
          myChessDispatch({ type: "reset", resetVal: new_valid });
        }}
      >
        RESET
      </button>
    );
  };

  return (
    <>
      <Debugger />
      <div className="flex flex-row min-w-full justify-center">
        <div style={{ minWidth: size * 4 }}></div>
        <div className="board grid grid-cols-8 max-w-fit">{squareLayout}</div>
        <MoveViewer size={size} />
      </div>
      <ResetButton />
    </>
  );
}
