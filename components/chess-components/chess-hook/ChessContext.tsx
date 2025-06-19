import { Chess } from "chess.js";
import {
  Dispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
  act,
} from "react";
import { validMovesConversion } from "../chess-util/chessjsWrapper";

// ChessJSContext

export type MoveAction = {
  type: "move";
  move: {
    from: string;
    to: string;
    promotion?: string;
  };
};

export type UndoAction = {
  type: "undo";
};

export type ResetAction = {
  type: "reset";
  resetVal: Chess;
};

export type EndGameAction = {
  type: "end";
  endVal: Chess;
};

export type ChessAction = MoveAction | ResetAction | UndoAction | EndGameAction;

export type MyChess = {
  chess: Chess;
  moveHistory: string[];
  validMoves: (square: string) => Set<string>;
};

const ChessContext = createContext(null as unknown as MyChess);

const ChessDispatchContext = createContext(
  null as unknown as Dispatch<ChessAction>,
);

export function ChessProvider({
  initial,
  children,
}: {
  initial: MyChess;
  children: ReactNode;
}) {
  const [chess, dispatch] = useReducer(chessReducer, initial);

  return (
    <ChessContext.Provider value={chess}>
      <ChessDispatchContext.Provider value={dispatch}>
        {children}
      </ChessDispatchContext.Provider>
    </ChessContext.Provider>
  );
}

export function useChess() {
  return useContext(ChessContext);
}

export function useChessDispatch() {
  return useContext(ChessDispatchContext);
}

function chessReducer(myChess: MyChess, action: ChessAction) {
  switch (action.type) {
    case "move": {
      try {
        const chessjs = myChess.chess;
        const temp = chessjs.move(action.move);
        myChess.moveHistory.push(temp.san);
        const newMyChess: MyChess = {
          validMoves: (square: string) =>
            validMovesConversion(myChess.chess, square),
          moveHistory: myChess.moveHistory,
          chess: myChess.chess,
        };
        return newMyChess;
      } catch (_err) {
        // log the errors
        console.log(_err);
      }

      const newMyChess: MyChess = {
        validMoves: (square: string) =>
          validMovesConversion(myChess.chess, square),
        moveHistory: myChess.moveHistory,
        chess: myChess.chess,
      };

      // still force reload
      return newMyChess;
    }
    case "undo": {
      const temp = myChess.chess.undo();
      if (temp == null) {
        // no action is done, no need to rerender
        return myChess;
      }
      myChess.moveHistory.pop();
      const newMyChess: MyChess = {
        chess: myChess.chess,
        moveHistory: myChess.moveHistory,
        validMoves: (square: string) =>
          validMovesConversion(myChess.chess, square),
      };
      return newMyChess;
    }
    case "reset": {
      if (action.resetVal) {
        const newMyChess: MyChess = {
          chess: action.resetVal,
          moveHistory: [],
          validMoves: (square: string) =>
            validMovesConversion(action.resetVal, square),
        };
        return newMyChess;
      }
      // no reset is done?
      return myChess;
    }

    case "end": {
      // preserve move history
      const newMyChess: MyChess = {
        chess: action.endVal,
        moveHistory: myChess.moveHistory,
        validMoves: myChess.validMoves,
      };
      return newMyChess;
    }

    default: {
      // this should not happen
      console.error("Unknown action: " + action);
      return myChess;
    }
  }
}
