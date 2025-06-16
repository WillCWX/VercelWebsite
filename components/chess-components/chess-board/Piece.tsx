"use client";

import { DragEvent } from "react";
import {
  SelectAction,
  useSelectedSquareDispatch,
} from "../chess-hook/SelectedSquareContext";

import BlackKing from "../chess-assets/cburnett/bK.svg";
import BlackQueen from "../chess-assets/cburnett/bQ.svg";
import BlackRook from "../chess-assets/cburnett/bR.svg";
import BlackBishop from "../chess-assets/cburnett/bB.svg";
import BlackKnight from "../chess-assets/cburnett/bN.svg";
import BlackPawn from "../chess-assets/cburnett/bP.svg";

import WhiteKing from "../chess-assets/cburnett/wK.svg";
import WhiteQueen from "../chess-assets/cburnett/wQ.svg";
import WhiteRook from "../chess-assets/cburnett/wR.svg";
import WhiteBishop from "../chess-assets/cburnett/wB.svg";
import WhiteKnight from "../chess-assets/cburnett/wN.svg";
import WhitePawn from "../chess-assets/cburnett/wP.svg";

const EmptyPiece = () => <></>;

export const pieceSrc = (src: string) => {
  switch (src) {
    case "bK":
      return BlackKing;
    case "bQ":
      return BlackQueen;
    case "bR":
      return BlackRook;
    case "bB":
      return BlackBishop;
    case "bN":
      return BlackKnight;
    case "bP":
      return BlackPawn;

    case "wK":
      return WhiteKing;
    case "wQ":
      return WhiteQueen;
    case "wR":
      return WhiteRook;
    case "wB":
      return WhiteBishop;
    case "wN":
      return WhiteKnight;
    case "wP":
      return WhitePawn;
    default:
      return EmptyPiece;
  }
};

type PieceInput = {
  piece: string;
  from: string;
  handleDelete: () => void;
};

export function Piece({ piece, from, handleDelete }: PieceInput) {
  const selectedPieceDispatch = useSelectedSquareDispatch();
  if (piece == "") {
    return <></>;
  }
  const handleDrag = (event: DragEvent) => {
    event.dataTransfer.effectAllowed = "move";
    const selectAction: SelectAction = {
      type: "select",
      square: from,
    };
    selectedPieceDispatch(selectAction);
    event.dataTransfer.setData("piece", piece);
    event.dataTransfer.setData("from", from);
  };
  const handleCapture = (event: DragEvent) => {
    if (event.dataTransfer.dropEffect == "move") {
      handleDelete();
    }
  };
  const PieceSVG = pieceSrc(piece);

  return (
    <div
      draggable={true}
      onDragStart={handleDrag}
      onDragEndCapture={handleCapture}
      className="z-10 w-[16px] h-[16px]   md:w-[50px] md:h-[50px]"
    >
      <PieceSVG viewBox="0 0 45 45" />
    </div>
  );
}
