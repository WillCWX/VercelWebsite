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

const buttonStyle =
  "border-2 md:border-4 border-dashed border-black mx-1 w-[16px] md:w-[64px]";

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

  const Queen = pieceSrc(colour + "Q");
  const Rook = pieceSrc(colour + "R");
  const Bishop = pieceSrc(colour + "B");
  const Knight = pieceSrc(colour + "N");

  return (
    <div className="modal flex justify-center z-20">
      <div className="modal-content flex justify-center m-auto w-max-fit">
        <button onClick={onSelection(colour + "Q")} className={buttonStyle}>
          <Queen />
        </button>
        <button onClick={onSelection(colour + "R")} className={buttonStyle}>
          <Rook />
        </button>
        <button onClick={onSelection(colour + "N")} className={buttonStyle}>
          <Knight />
        </button>
        <button onClick={onSelection(colour + "B")} className={buttonStyle}>
          <Bishop />
        </button>
      </div>
    </div>
  );
}
