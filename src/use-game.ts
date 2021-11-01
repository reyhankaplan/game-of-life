import { useEffect, useState } from "react";

export interface CellType {
  x: number;
  y: number;
  state: boolean;
}

export type BoardType = readonly CellType[][];

interface BoardSizeType {
  width: number;
  height: number;
}

const createBoard = ({ width, height }: BoardSizeType): BoardType =>
  Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({
      x: col,
      y: row,
      state: false,
    }))
  );

const getNeighbors = ({
  board,
  cell,
  width,
  height,
}: BoardSizeType & {
  board: BoardType;
  cell: CellType;
}): CellType[] => {
  const cells = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let ny = cell.y + dy;
      let nx = cell.x + dx;
      if (ny === -1) ny = height - 1;
      if (nx === -1) nx = width - 1;
      if (ny === height) ny = 0;
      if (nx === width) nx = 0;
      cells.push(board[ny][nx]);
    }
  }
  return cells;
};

export const useGame = ({ width, height }: BoardSizeType) => {
  const [board, setBoard] = useState<BoardType>([]);

  const toggleCell = (cell: CellType) => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((col) => {
          if (col.x === cell.x && col.y === cell.y) {
            return { ...cell, state: !cell.state };
          }

          return col;
        })
      )
    );
  };

  useEffect(() => {
    setBoard(createBoard({ width, height }));
  }, []);

  const reset = () => {
    setBoard(createBoard({ width, height }));
  };

  const tick = () => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          const neighbors = getNeighbors({ board: prev, cell, width, height });

          const liveCellCount = neighbors.reduce(
            (acc, cell) => acc + (cell.state ? 1 : 0),
            0
          );

          let newState;
          if (cell.state) {
            // this is alive
            // Any live cell with two or three live neighbours survives.
            // All other live cells die in the next generation.
            newState = liveCellCount === 2 || liveCellCount === 3;
          } else {
            // this cell is dead
            // Any dead cell with three live neighbours becomes a live cell.
            newState = liveCellCount === 3;
          }

          return { ...cell, state: newState };
        })
      )
    );
  };

  return { board, tick, toggleCell, reset };
};
