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
};

export function Square({ rank, file }: SquareInput) {
  // Square property constants
  const pos = file + rank.toString();
  const squareColor =
    (rank + file.charCodeAt(0)) % 2 == 0 ? darkSquareStyle : lightSquareStyle;
  const isPromotionSquare = rank == 1 || rank == 8;

  // Custom hooks to update chess state & square validity
  const myChess = useChess();
  const chessDispatch = useChessDispatch();
  const selectedSquare = useSelectedSquare();

  // Enable promotions and create it's input props
  const [showPromo, setShowPromo] = useState(false);
  const [promoMove, setPromoMove] = useState(null as MoveInput | null);
  const onClose = () => {
    setShowPromo(false);
  };

  // Create and update child piece
  const [id, setId] = useState(getPieceIDOnSquare(myChess.chess, pos));
  const [idSyncedWith, setIdSyncedWith] = useState(myChess);
  const handleDelete = () => {
    setId("");
  };
  // use myChess instead of myChess.chess as chess is almost never a new object
  if (idSyncedWith !== myChess) {
    setIdSyncedWith(myChess);
    setId(getPieceIDOnSquare(myChess.chess, pos));
  }

  // Allow, handle and update drop based on square validity
  const isValidSquare = useRef(false);
  useEffect(() => {
    const validMoves = myChess.validMoves;
    isValidSquare.current = validMoves(selectedSquare).has(pos);
  }, [myChess.validMoves, pos, selectedSquare]);

  const handleDrop = (event: DragEvent) => {
    if (!isValidSquare.current) {
      return;
    }
    event.preventDefault();
    const newMove: MoveInput = {
      from: event.dataTransfer.getData("from"),
      to: pos,
      promotion: undefined,
    };

    if (
      isPromotionSquare &&
      event.dataTransfer.getData("piece").charAt(1) == "P"
    ) {
      //console.log("Promotion!");
      setPromoMove(newMove);
      setShowPromo(true);
      // let promo handle dispatch
      return;
    }

    const moveAction: MoveAction = {
      type: "move",
      move: newMove,
    };
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
      className={
        "board grid relative w-[16px] h-[16px] md:w-[50px] md:h-[50px]"
      }
      id={file + rank.toString()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDropCapture={handleDrop}
      onDragEnter={handleDragEnter}
    >
      <Piece piece={id} from={pos} handleDelete={handleDelete} />
      <svg
        viewBox="0 0 50 50"
        style={{
          zIndex: -1,
          ...squareColor,
          position: "absolute",
          display: "block",
        }}
      />
      {showPromo &&
        promoMove &&
        createPortal(
          <ModalPromo
            onClose={onClose}
            move={promoMove}
            colour={rank == 8 ? "w" : "b"}
          />,
          document.body,
        )}
    </div>
  );
}
