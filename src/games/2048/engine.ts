import { Tile } from "./types";

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

type MoveConfigItem = {
    sortComparator: (a: Tile, b: Tile) => number;
    getLineIndex: (tile: Tile) => number;
    movingCoordinate: 'x' | 'y';
    calculateTileMoving(index: number): number;
}

enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}
interface MoveConfig {
    [Direction.UP]: MoveConfigItem;
    [Direction.DOWN]: MoveConfigItem;
    [Direction.LEFT]: MoveConfigItem;
    [Direction.RIGHT]: MoveConfigItem;
}

const moveConfig: MoveConfig = {
    [Direction.UP]: {
        sortComparator: (a, b) => a.y - b.y,
        getLineIndex: (tile) => tile.x,
        movingCoordinate: 'y',
        calculateTileMoving: (index) => index + 1
    },
    [Direction.DOWN]: {
        sortComparator: (a, b) => b.y - a.y,
        getLineIndex: (tile) => tile.x,
        movingCoordinate: 'y',
        calculateTileMoving: (index) => 4 - index
    },
    [Direction.LEFT]: {
        sortComparator: (a, b) => a.x - b.x,
        getLineIndex: (tile) => tile.y,
        movingCoordinate: 'x',
        calculateTileMoving: (index) => index + 1
    },
    [Direction.RIGHT]: {
        sortComparator: (a, b) => b.x - a.x,
        getLineIndex: (tile) => tile.y,
        movingCoordinate: 'x',
        calculateTileMoving: (index) => 4 - index
    },
}

export const moveTiles = (tiles: Tile[], direction: Direction): { tiles: Tile[], moved: boolean } => {
    const { sortComparator, getLineIndex, calculateTileMoving, movingCoordinate } = moveConfig[direction];
    let tilesMoved = false;

    for (let i = 1; i <= 4; i++) {
        const tilesInLine = tiles.filter((t) => getLineIndex(t) === i).sort(sortComparator);

        tilesInLine.forEach((tile, index) => {
            if (index === 0) return;

            const prevTile = tilesInLine[index - 1];

            if (prevTile.isRemoved) return;

            if (prevTile.value === tile.value) {
                prevTile.value *= 2;
                prevTile.merged = true; // here probably need check
                tile.isRemoved = true;
            }
        });

        let tilesInLineIndex = 0;
        tilesInLine.forEach((tile, index) => {
            const tileMovingCoordinate = tile[movingCoordinate];
            let newCoordinate;
            if (!tile.isRemoved) {
                newCoordinate = calculateTileMoving(tilesInLineIndex++);
            } else {
                const prevTile = tilesInLine[index - 1];
                newCoordinate = prevTile[movingCoordinate];
            }

            if (newCoordinate !== tileMovingCoordinate) {
                tilesMoved = true;
            }

            tile[movingCoordinate] = newCoordinate;
        });
    }

    return { tiles, moved: tilesMoved };
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

export const gameTilesMoveActionHandler = (direction: Direction, tiles: Tile[], callback: (tiles: Tile[]) => void): void => {
    const resetedTiles = resetMergedState(tiles);
    const clearedTiles = clearRemovedTiles(resetedTiles);

    const { tiles: movedTiles, moved: moveHappened } = moveTiles(clearedTiles, direction);

    if (!moveHappened) return callback(movedTiles);

    const tile = createNewTile(movedTiles);
    callback([...movedTiles, tile]);
};

export const resetGame = (callback: (tiles: Tile[]) => void): void => {
    const tiles = generateTiles(2);
    callback(tiles);
}
