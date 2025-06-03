"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Square } from "./Square";
import { Chess } from "chess.js";
import {
  MoveAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { MoveViewer } from "./MoveViewer";
import { fenToOps } from "../chess-util/fen";
import { getSymbPieceID } from "../chess-util/chessjsWrapper";

type FenBoardInput = {
  size: number;
};

export function FenBoard({ size }: FenBoardInput) {
  const myChess = useChess();
  const myChessDispatch = useChessDispatch();
  const [result, setResult] = useState("");
  const squareLayout = useMemo(() => {
    console.log("Rerender due to size");
    return fenToOps(myChess.chess).map(({ file, rank, key }) => {
      return <Square file={file} rank={rank} key={key} size={size} />;
    });
  }, [size]);

  const engineMove = useCallback(
    (chessjs: Chess) => (event: MessageEvent) => {
      if (chessjs.turn() == "b" && !chessjs.isGameOver()) {
        setResult(event.data.lan);
        const ans = chessjs.move(event.data);
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
      }
    },
    [myChessDispatch],
  );
  useEffect(() => {
    if (myChess.chess.turn() == "w" || myChess.chess.isGameOver()) {
      return;
    }
    const myEngine = new Worker(
      new URL("../chess-util/engine.ts", import.meta.url),
    );
    myEngine.onmessage = engineMove(myChess.chess);
    myEngine.postMessage(myChess.chess.fen());
    return () => {
      myEngine.terminate();
    };
  }, [myChess, engineMove]);

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
