"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  EndGameAction,
  ResetAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { Button } from "@/components/ui/button";
import { Chess } from "chess.js";
import { drawPosition, resignPosition } from "../chess-util/chessjsWrapper";
import { toast } from "sonner";

const paragraphTailwind =
  "flex text-[4px] min-h-[6px] md:min-h-[20px] md:text-sm ";

const Circle = () => (
  <svg
    className="mr-[2px] md:mr-2 animate-spin h-[5px] w-[5px] md:h-5 md:w-5"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export function GameState() {
  const myChess = useChess();
  const [isDrawDisabled, setIsDrawDisabled] = useState(false);

  useEffect(() => {
    if (myChess.chess.turn() == "b") {
      return () => {
        setIsDrawDisabled(false);
      };
    }
  }, [myChess]);

  return (
    <div
      className="min-w-[62px] md:min-w-[195px] text-[6px] mr-[2px] p-1 md:mr-[5px]
      md:text-lg grid col-1 justify-center content-between
      bg-card text-card-foreground rounded-sm border shadow-sm"
    >
      <div className="flex flex-col items-center">
        <p className={paragraphTailwind}>
          {myChess.chess.turn() == "b" && !myChess.chess.isGameOver() ? (
            <>
              <Circle /> Thinking{" "}
            </>
          ) : (
            " "
          )}
        </p>
        Chester
      </div>
      <GameControl
        isDrawDisabled={isDrawDisabled}
        setIsDrawDisabled={setIsDrawDisabled}
      />
      <div className="flex flex-col items-center">
        You
        <br />
        <p className={paragraphTailwind}>
          {myChess.chess.turn() == "w" && !myChess.chess.isGameOver()
            ? "Your Turn"
            : " "}
        </p>
      </div>
    </div>
  );
}

const buttonsTailwind =
  "mt-1 mb-1 text-[6px] w-[48px] h-[16px] md:mt-2 md:mb-2 md:w-[140px] md:text-lg md:h-[40px]";

function GameControl({
  isDrawDisabled,
  setIsDrawDisabled,
}: {
  isDrawDisabled: boolean;
  setIsDrawDisabled: Dispatch<SetStateAction<boolean>>;
}) {
  const myChess = useChess();
  const myChessDispatch = useChessDispatch();
  const [result, setResult] = useState([0, 0] as [number, number]);
  const hasScored = useRef(false);
  const isResignation = useRef(false);
  const [isReset, setIsReset] = useState(false);
  const handleDraw = () => {
    // @TODO ADD EVAL INFO TO AUGMENT DRAW CHANCE
    if (Math.random() < 1) {
      toast.success("Chester", {
        description: "Ok draw accepted!",
      });

      // @TODO ADD DRAW ACTION TO PRESERVE MOVE HISTORY & FEN
      const drawAction: EndGameAction = {
        type: "end",
        endVal: drawPosition(myChess.chess),
      };
      myChessDispatch(drawAction);
    } else {
      setIsDrawDisabled(true);
      toast.info("Chester", {
        description: "I like my position >:)",
      });
    }
  };

  const handleResign = () => {
    // cannot resign empty board
    if (myChess.moveHistory.length == 0) {
      toast.warning("Can not resign a game with no moves made!");
      return;
    }

    // @TODO ADD RESIGN ACTION TO PRESERVE MOVE HISTORY & FEN
    isResignation.current = true;
    const resigned = resignPosition(myChess.chess);
    const resignAction: EndGameAction = {
      type: "end",
      endVal: resigned,
    };
    myChessDispatch(resignAction);
  };

  const isChesterWin = myChess.chess.turn() == "w";
  useEffect(() => {
    if (isReset || !myChess.chess.isGameOver() || hasScored.current) {
      // do nothing
    } else if (myChess.chess.isDraw() && !isResignation.current) {
      setResult((result) => [result[0] + 0.5, result[1] + 0.5]);
      hasScored.current = true;
    } else if (isChesterWin || isResignation.current) {
      setResult((result) => [result[0], result[1] + 1]);
      hasScored.current = true;
    } else if (!hasScored.current) {
      setResult((result) => [result[0] + 1, result[1]]);
      hasScored.current = true;
    }
  }, [isReset, myChess, isChesterWin]);

  if (!myChess.chess.isGameOver()) {
    return (
      <div className="flex flex-col items-center">
        <Button
          variant={isDrawDisabled ? "outline" : "default"}
          className={buttonsTailwind}
          disabled={isDrawDisabled}
          onClick={handleDraw}
        >
          Offer Draw
        </Button>
        <Button
          variant="destructive"
          className={buttonsTailwind}
          onClick={handleResign}
        >
          Resign
        </Button>
      </div>
    );
  }

  const handleNewGame = () => {
    setIsReset(false);
    isResignation.current = false;
    const resetAction: ResetAction = {
      type: "reset",
      resetVal: new Chess(),
    };
    myChessDispatch(resetAction);
    hasScored.current = false;
  };
  const handleResetStat = () => {
    setResult((result) => [0, 0]);
    setIsReset(true);
  };

  return (
    <div className="flex flex-col items-center align-center">
      {myChess.chess.isDraw() && !isResignation.current
        ? "Draw"
        : isChesterWin || isResignation.current
          ? "Chester Wins"
          : "You Win"}
      <br />
      Score: {result[0]} - {result[1]}
      <Button className={buttonsTailwind} onClick={handleNewGame}>
        {" "}
        New Game?
      </Button>
      <Button
        variant="muted"
        className={buttonsTailwind}
        onClick={handleResetStat}
      >
        {" "}
        Reset Stats{" "}
      </Button>
    </div>
  );
}
