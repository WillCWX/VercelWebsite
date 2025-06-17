import {
  Dispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

const ChesterLogContext = createContext([] as string[]);

const ChesterLogDispatchContext = createContext(
  null as unknown as Dispatch<NewLogAction>,
);

export function ChesterLogProvider({ children }: { children: ReactNode }) {
  const [moves, dispatch] = useReducer(moveReducer, [] as string[]);

  return (
    <ChesterLogContext.Provider value={moves}>
      <ChesterLogDispatchContext.Provider value={dispatch}>
        {children}
      </ChesterLogDispatchContext.Provider>
    </ChesterLogContext.Provider>
  );
}

export function useChesterLog() {
  return useContext(ChesterLogContext);
}

export function useChesterLogDispatch() {
  return useContext(ChesterLogDispatchContext);
}

export type NewLogAction = {
  type: "new";
  logs: string[];
};

function moveReducer(prevLogs: string[], action: NewLogAction) {
  switch (action.type) {
    case "new": {
      return action.logs;
    }
    default: {
      console.log("Unknown action: " + action.type);
      return prevLogs;
    }
  }
}
