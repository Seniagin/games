import { GAME_FIELD_SIZE } from "./constants";
import { Direction, Tile } from "./types";

type MoveConfigItem = {
    sortComparator: (a: Tile, b: Tile) => number;
    getLineIndex: (tile: Tile) => number;
    movingCoordinate: 'x' | 'y';
    calculateTileMoving(index: number): number;
}

type MoveConfig = {
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
        calculateTileMoving: (index) => GAME_FIELD_SIZE - index
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
        calculateTileMoving: (index) => GAME_FIELD_SIZE - index
    },
};


export const moveTiles = (initialTiles: Tile[], direction: Direction): { tiles: Tile[], moved: boolean } => {
    const tiles = [...initialTiles.map((tile) => ({ ...tile }))];
    const { sortComparator, getLineIndex, calculateTileMoving, movingCoordinate } = moveConfig[direction];
    let tilesMoved = false;

    for (let i = 1; i <= GAME_FIELD_SIZE; i++) {
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
            try {
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
            } catch (error) {
                console.log(tile);
            }
        });
    }

    return { tiles, moved: tilesMoved };
}