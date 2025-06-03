import {
  Dispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

const SelectedPieceContext = createContext("");

const SelectedPieceDispatchContext = createContext(
  null as unknown as Dispatch<SelectAction>,
);

export function SelectedSquareProvider({ children }: { children: ReactNode }) {
  const [moves, dispatch] = useReducer(moveReducer, "");

  return (
    <SelectedPieceContext.Provider value={moves}>
      <SelectedPieceDispatchContext.Provider value={dispatch}>
        {children}
      </SelectedPieceDispatchContext.Provider>
    </SelectedPieceContext.Provider>
  );
}

export function useSelectedSquare() {
  return useContext(SelectedPieceContext);
}

export function useSelectedSquareDispatch() {
  return useContext(SelectedPieceDispatchContext);
}

export type SelectAction = {
  type: "select";
  square: string;
};

function moveReducer(piece: string, action: SelectAction) {
  switch (action.type) {
    case "select": {
      return action.square;
    }
    default: {
      console.log("Unknown action: " + action.type);
      return piece;
    }
  }
}
