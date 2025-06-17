import { Algorithm } from "./hce";

self.onmessage = function (event) {
  const start = Date.now();
  const algorithm = new Algorithm(event.data, "alphaBeta", "PositionWeight");
  const [score, move, logs] = algorithm.eval();
  logs.push(
    `completed in ${(Date.now() - start) / 1000}s: [${score}, ${move.san}]`,
  );
  // Send the result back to the main thread
  postMessage({ move: move, logs: logs });
};
