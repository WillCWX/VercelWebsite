import Image from "next/image";
import { pieceSrc } from "./Piece";
import { MoveAction, useChessDispatch } from "../chess-hook/ChessContext";

type ModalPromoInput = {
  colour: string;
  move: {
    to: string;
    from: string;
    promotion?: string;
  };
  onClose: () => void;
};

const buttonStyle = "border-4 border-dashed border-black mx-1";

export function ModalPromo({ colour, move, onClose }: ModalPromoInput) {
  const size = 50;
  const myChessDispatch = useChessDispatch();
  const onSelection = (str: string) => () => {
    const moveAction: MoveAction = {
      type: "move",
      move: {
        ...move,
        promotion: str.charAt(1).toLocaleLowerCase(),
      },
    };
    myChessDispatch(moveAction);
    onClose();
  };
  return (
    <div className="modal flex justify-center">
      <div className="modal-content flex justify-center m-auto w-max-fit">
        <button onClick={onSelection(colour + "Q")} className={buttonStyle}>
          <Image
            src={pieceSrc(colour + "Q")}
            alt="Queen"
            width={size}
            height={size}
          />
        </button>
        <button onClick={onSelection(colour + "R")} className={buttonStyle}>
          <Image
            src={pieceSrc(colour + "R")}
            alt="Rook"
            width={size}
            height={size}
          />
        </button>
        <button onClick={onSelection(colour + "N")} className={buttonStyle}>
          <Image
            src={pieceSrc(colour + "N")}
            alt="Knight"
            width={size}
            height={size}
          />
        </button>
        <button onClick={onSelection(colour + "B")} className={buttonStyle}>
          <Image
            src={pieceSrc(colour + "B")}
            alt="Bishop"
            width={size}
            height={size}
          />
        </button>
      </div>
    </div>
  );
}
