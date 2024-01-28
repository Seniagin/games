import { moveTiles } from "./move";
import { Direction, Tile } from "./types";

export function getAllFreePositions(tiles: Tile[]) {
  const freePositions = [];
  for (let x = 1; x <= 4; x++) {
    for (let y = 1; y <= 4; y++)
      if (!tiles.some((tile) => tile.x === x && tile.y === y)) {
        freePositions.push({ x, y });
      }
  }
  return freePositions;
}

export function getRandomPosition(tiles: Tile[]) {
  const freePositions = getAllFreePositions(tiles);

  if (freePositions.length === 0) throw new Error('No free positions')

  return freePositions[Math.floor(Math.random() * freePositions.length)];
}

export function createNewTile(existingTiles: Tile[]) {
  const { x, y } = getRandomPosition(existingTiles);
  const largestId = existingTiles[existingTiles.length - 1]?.id ?? 0;

  const tile = {
    id: largestId ? largestId + 1 : 1,
    value: Math.random() < 0.9 ? 2 : 4,
    merged: false,
    isRemoved: false,
    x,
    y,
  };
  return tile;
}


export const clearRemovedTiles = (tiles: Tile[]): Tile[] => {
  return tiles.filter((tile) => !tile.isRemoved);
}

export const resetMergedState = (tiles: Tile[]): Tile[] => {
  return tiles.map((tile) => ({ ...tile, merged: false }));
}

export const generateTiles = (count: number): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 0; i < count; i++) {
    tiles.push(createNewTile(tiles));
  }
  return tiles;
}

export function countMergeScore(tiles: Tile[]) {
  return tiles.reduce((acc, tile) => {
    if (tile.merged) {
      return acc + tile.value;
    }
    return acc;
  }, 0);
}

export const resetGame = (callback: (tiles: Tile[]) => void): void => {
  const tiles = generateTiles(2);
  callback(tiles);
}

function pause<T>(time: number) {
  return function (args: T): Promise<T> {
    return new Promise<T>((resolve) => setTimeout(() => resolve(args), time));
  }
}

// todo: force all promises to be resolved before next action
export const gameTilesMoveActionHandler = (direction: Direction, callback: (tiles: Tile[]) => void, setScore: (score: number) => void): (tiles: Tile[]) => Promise<Tile[]> => {
  return (initialTiles: Tile[]) => {
    return Promise.resolve().then(() => moveTiles(initialTiles, direction))
      .then(async ({ tiles, moved }) => {
        callback(tiles);
        return { tiles, moved };
      })
      .then(pause(100)) // todo: make global variable for anuiation time and use in styles also
      .then(async ({ tiles, moved }) => {
        if (moved) {
          const tile = createNewTile(tiles);
          const newTiles = [...tiles, tile];
          setScore(countMergeScore(newTiles));
          return newTiles;
        }

        return tiles;
      })
      .then(pause(50))
      .then((tiles) => resetMergedState(tiles))
      .then((resetedTiles) => {
        const clearedTiles = clearRemovedTiles(resetedTiles);
        callback(clearedTiles);
        return clearedTiles;
      })
  }
};

export const isGameOver = (tiles: Tile[]): boolean => {
  const freePositions = getAllFreePositions(tiles);
  if (freePositions.length > 0) return false;

  const isMovePossible = Object.values(Direction).some((direction) => {
    const { moved } = moveTiles(tiles, direction);
    return moved;
  });

  return !isMovePossible;
}