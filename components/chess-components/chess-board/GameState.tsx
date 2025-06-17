"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ResetAction,
  useChess,
  useChessDispatch,
} from "../chess-hook/ChessContext";
import { Button } from "@/components/ui/button";
import { Chess } from "chess.js";
import { drawPosition, resignPosition } from "../chess-util/chessjsWrapper";
import { toast } from "sonner";

const paragraphTailwind = "text-[4px] min-h-[6px] md:min-h-[20px] md:text-sm";

export function GameState() {
  const myChess = useChess();
  const [isDrawDisabled, setIsDrawDisabled] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (myChess.chess.turn() == "b") {
      const timer1 = setTimeout(() => setDots("."), 500); // 0.5s
      const timer2 = setTimeout(() => setDots(".."), 2000); // 2s
      const timer3 = setTimeout(() => setDots("..."), 4500); // 4.5s
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        setDots("");
        setIsDrawDisabled(false);
      };
    }
  }, [myChess]);

  return (
    <div className="min-w-[64px] md:min-w-[200px] text-[6px] md:text-lg grid col-1 justify-center content-between">
      <div className="flex flex-col items-center">
        <p className={paragraphTailwind}>
          {myChess.chess.turn() == "b" && !myChess.chess.isGameOver()
            ? "Thinking" + dots
            : " "}
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
  const result = useRef([0, 0] as [number, number]);
  const hasScored = useRef(false);
  const isResignation = useRef(false);
  const [isReset, setIsReset] = useState(false);
  const handleDraw = () => {
    // @TODO ADD EVAL INFO TO AUGMENT DRAW CHANCE
    if (Math.random() < 0.05) {
      toast.success("Chester", {
        description: "Ok draw accepted!",
      });

      // @TODO ADD DRAW ACTION TO PRESERVE MOVE HISTORY & FEN
      const drawAction: ResetAction = {
        type: "reset",
        resetVal: drawPosition(myChess.chess),
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
    const resignAction: ResetAction = {
      type: "reset",
      resetVal: resigned,
    };
    myChessDispatch(resignAction);
  };

  const winner = myChess.chess.turn() == "w";
  useEffect(() => {
    if (isReset || !myChess.chess.isGameOver()) {
      // do nothing
    } else if (myChess.chess.isDraw() && !isResignation.current) {
      result.current[0] += 0.5;
      result.current[1] += 0.5;
      hasScored.current = true;
    } else if (winner || isResignation.current) {
      result.current[1] += 1;
      hasScored.current = true;
    } else if (!hasScored.current) {
      result.current[0] += 1;
      hasScored.current = true;
    }
  }, [isReset, myChess.chess, winner]);

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
    result.current[0] = 0;
    result.current[1] = 0;
    setIsReset(true);
  };

  return (
    <div className="flex flex-col items-center align-center">
      {myChess.chess.isDraw() && !isResignation.current
        ? "Draw"
        : winner || isResignation.current
          ? "Chester Wins"
          : "You Win"}
      <br />
      Score: {result.current[0]} - {result.current[1]}
      <Button className={buttonsTailwind} onClick={handleNewGame}>
        {" "}
        New Game?
      </Button>
      <Button
        variant="secondary"
        className={buttonsTailwind}
        onClick={handleResetStat}
      >
        {" "}
        Reset Stats{" "}
      </Button>
    </div>
  );
}
