"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Square } from "./Square";
import { Move } from "chess.js";
import {
  MoveAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { locations } from "../chess-util/fen";
import {
  NewLogAction,
  useChesterLogDispatch,
} from "../chess-hook/ChesterLogContext";

export function FenBoard() {
  // Custom hooks for updating chess state
  const myChess = useChess();
  const myChessDispatch = useChessDispatch();
  const chesterLogDispatch = useChesterLogDispatch();

  // Create 8x8 alternating colour squares
  const squareLayout = useMemo(() => {
    return locations.flatMap((curr) => {
      return curr.map((str) => {
        return (
          <Square
            file={str.charAt(0)}
            rank={parseInt(str.charAt(1))}
            key={str}
          />
        );
      });
    });
  }, []);

  // enforce engine to be called only once, no matter how many rerenders
  // memoize chess state update function to not trigger worker recreation
  const chessRef = useRef(myChess.chess);
  const hasCalledEngine = useRef(false);
  useEffect(() => {
    chessRef.current = myChess.chess;
  }, [myChess]);
  const engineMove = useCallback(
    (event: MessageEvent) => {
      if (chessRef.current.turn() == "w" || chessRef.current.isGameOver()) {
        return;
      }
      const ans: Move = event.data.move;
      const moveAction: MoveAction = {
        type: "move",
        move: {
          from: ans.from,
          to: ans.to,
          promotion: ans.promotion,
        },
      };
      const newLogAction: NewLogAction = {
        type: "new",
        logs: event.data.logs,
      };
      myChessDispatch(moveAction);
      chesterLogDispatch(newLogAction);
    },
    [chesterLogDispatch, myChessDispatch],
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
      hasCalledEngine.current ||
      myChess.chess.turn() == "w" ||
      myChess.chess.isGameOver() ||
      myEngine.current == undefined
    ) {
      hasCalledEngine.current = false;
      return;
    }
    myEngine.current.postMessage(myChess.chess.fen());
    hasCalledEngine.current = true;
  }, [myChess]);

  return (
    <>
      <div className="board grid grid-cols-8 min-w-[128px] md:min-w-[200px]">
        {squareLayout}
      </div>
    </>
  );
}
