export type Tile = {
    id: number;
    value: number;
    x: number;
    y: number;
    merged?: boolean;
    isRemoved?: boolean;
};

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}
