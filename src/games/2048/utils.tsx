import { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import { createNewTile, gameTilesMoveActionHandler, generateTiles, resetGame } from "./engine";
import { Direction, Tile } from "./types";

type TilesContextType = {
  tiles: Tile[],
  setTiles: (tiles: Tile[]) => void,
  createTile: () => void,
  handleAction: (direction: Direction) => void,
}

export const TilesContext = createContext<TilesContextType>({
  tiles: [],
  setTiles: () => { },
  createTile: () => { },
  handleAction: () => { },
});


export const TilesContextProvider = ({ children, setResetCallback }: { children: ReactNode, setResetCallback: (callbackFn: () => void) => void }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    console.log('-')
    setResetCallback(() => () => {
      console.log('reset')
      resetGame(setTiles);
    })
  }, [setTiles, setResetCallback])

  const createInitialTiles = useCallback(() => {
    if (tiles.length > 1) return;
    const createdTiles = generateTiles(2)

    setTiles(createdTiles);
  }, [tiles, setTiles])

  const createTile = useCallback(() => {
    const tile = createNewTile(tiles);
    setTiles([...tiles, tile]);
  }, [tiles, setTiles]);

  const handleAction = useCallback((direction: Direction) => {
    gameTilesMoveActionHandler(direction, tiles, setTiles);
  }, [tiles, setTiles]);


  useEffect(() => {
    createInitialTiles();
  }, [createInitialTiles])

  return <TilesContext.Provider value={{ tiles, setTiles, createTile, handleAction }}>{children}</TilesContext.Provider>;
}