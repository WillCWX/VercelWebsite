"use client";

import { DragEvent, useEffect, useRef, useState } from "react";
import { Piece } from "./Piece";
import {
  MoveAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { createPortal } from "react-dom";
import { ModalPromo } from "./ModalPromo";
import { getPieceIDOnSquare } from "../chess-util/chessjsWrapper";
import { useSelectedSquare } from "../chess-hook/SelectedSquareContext";

const lightSquareStyle = { backgroundColor: "rgb(240, 217, 181)" };
const darkSquareStyle = { backgroundColor: "rgb(181, 136, 99)" };

type MoveInput = {
  from: string;
  to: string;
  promotion?: string;
};

type SquareInput = {
  rank: number;
  file: string;
  size: number;
};

export function Square({ rank, file, size }: SquareInput) {
  const pos = file + rank.toString();
  const squareColor =
    (rank + file.charCodeAt(0)) % 2 == 0 ? darkSquareStyle : lightSquareStyle;
  const isPromotionSquare = rank == 1 || rank == 8;
  const myChess = useChess();
  const chessDispatch = useChessDispatch();
  const selectedSquare = useSelectedSquare();
  const isValidSquare = useRef(false);
  const [showPromo, setShowPromo] = useState(false);
  const [id, setId] = useState(getPieceIDOnSquare(myChess.chess, pos));
  useEffect(() => {
    const validMoves = myChess.validMoves;
    isValidSquare.current = validMoves(selectedSquare).has(pos);
    setId(getPieceIDOnSquare(myChess.chess, pos));
  }, [myChess, pos, selectedSquare]);

  // const movesDispatch = useMovesDispatch();
  const move = useRef(null as unknown as MoveInput);
  const onClose = () => {
    setShowPromo(false);
  };

  const handleDelete = () => {
    setId("");
  };

  const handleDrop = (event: DragEvent) => {
    if (!isValidSquare.current) {
      return;
    }
    event.preventDefault();
    move.current = {
      from: event.dataTransfer.getData("from"),
      to: pos,
      promotion: undefined,
    };
    const moveAction: MoveAction = {
      type: "move",
      move: move.current,
    };

    if (
      isPromotionSquare &&
      event.dataTransfer.getData("piece").charAt(1) == "P"
    ) {
      console.log("Promotion!");
      setShowPromo(true);
      // let promo handle dispatch
      return;
    }

    chessDispatch(moveAction);
  };
  const handleDragOver = (event: DragEvent) => {
    if (!isValidSquare.current) {
      return;
    }
    event.preventDefault();
  };
  const handleDragEnter = (event: DragEvent) => {
    if (!isValidSquare.current) {
      return;
    }
    event.preventDefault();
  };

  return (
    <div
      className={"board grid relative"}
      style={{ minHeight: size, minWidth: size }}
      id={file + rank.toString()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDropCapture={handleDrop}
      onDragEnter={handleDragEnter}
    >
      <Piece piece={id} size={size} from={pos} handleDelete={handleDelete} />
      <svg
        style={{
          width: size,
          height: size,
          zIndex: -1,
          ...squareColor,
          position: "absolute",
          display: "block",
        }}
      />
      {showPromo &&
        createPortal(
          <ModalPromo
            onClose={onClose}
            move={move.current}
            colour={rank == 8 ? "w" : "b"}
          />,
          document.body,
        )}
    </div>
  );
}
