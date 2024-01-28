import { Tile } from './types';

export function initGameThread(initialTiles: Tile[]) {
    window.gameThread = Promise.resolve<Tile[]>(initialTiles);
}

export function addActionToGameThread(action: (tiles: Tile[]) => Promise<Tile[]>) {
    window.gameThread = window.gameThread.then<Tile[]>(action);
}