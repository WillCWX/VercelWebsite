"use client";

import Image from "next/image";
import { DragEvent } from "react";
import {
  SelectAction,
  useSelectedSquareDispatch,
} from "../chess-hook/SelectedSquareContext";

export const pieceSrc = (src: string) => {
  return `/cburnett/${src}.svg`;
};

type PieceInput = {
  piece: string;
  size: number;
  from: string;
  handleDelete: () => void;
};

export function Piece({ piece, size, from, handleDelete }: PieceInput) {
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

  return (
    <div
      draggable={true}
      onDragStart={handleDrag}
      onDragEndCapture={handleCapture}
      className="z-1"
    >
      <Image src={pieceSrc(piece)} height={size} width={size} alt={piece} />
    </div>
  );
}
