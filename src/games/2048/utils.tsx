import { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import { createNewTile, gameTilesMoveActionHandler, generateTiles, isGameOver, resetGame } from "./engine";
import { Direction, Tile } from "./types";
import { addActionToGameThread, initGameThread } from "./thread";

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


export const TilesContextProvider = (
  { children, setResetCallback, setIsGameOver, setScore }: {
    children: ReactNode,
    setResetCallback: (callbackFn: () => void) => void,
    setIsGameOver: (isOver: boolean) => void,
    setScore: (score: number) => void,
  }
) => {
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    if (isGameOver(tiles)) {
      setIsGameOver(true);
    }
  }, [tiles, setIsGameOver])


  const createInitialTiles = useCallback(() => {
    const createdTiles = generateTiles(2)

    initGameThread(createdTiles)
    setTiles(createdTiles);
  }, [setTiles]);

  useEffect(() => {
    setResetCallback(() => () => {
      resetGame(setTiles);
      createInitialTiles();
      setIsGameOver(false);
    })
  }, [setTiles, setResetCallback, setIsGameOver, createInitialTiles])


  const createTile = useCallback(() => {
    const tile = createNewTile(tiles);
    setTiles([...tiles, tile]);
  }, [tiles, setTiles]);

  const handleAction = useCallback((direction: Direction) => {
    addActionToGameThread(
      gameTilesMoveActionHandler(direction, setTiles, setScore)
    )
  }, [setTiles, setScore]);


  useEffect(() => {
    createInitialTiles();
  }, [createInitialTiles])

  return <TilesContext.Provider value={{ tiles, setTiles, createTile, handleAction }}>{children}</TilesContext.Provider>;
}