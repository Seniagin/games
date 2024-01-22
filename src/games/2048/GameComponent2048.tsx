import { useCallback, useContext, useEffect, useState } from "react";
import { StyledCellItem, StyledGameField, StyledGameFieldCell, StyledPageContainer, StyledResetGameButton } from "./styles";
import { TilesContext, TilesContextProvider } from "./utils";
import { Direction } from "./types";

// todo: Win condition
// todo: Lose condition
// todo: Score
// todo: Best score
// todo: Proper action separation (move, merge, create) and async actions queue


const actionsMap = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
} as const;

function TilesComponent() {
  const { tiles, handleAction } = useContext(TilesContext);

  const onkeydown = useCallback((e: KeyboardEvent) => {
    const action = actionsMap[e.key as keyof typeof actionsMap];
    if (!action) return;

    handleAction(action);
  }, [handleAction]);

  useEffect(() => {
    document.addEventListener('keydown', onkeydown)
    return () => { document.removeEventListener('keydown', onkeydown) }
  }, [onkeydown])

  return <>
    {
      tiles.map((tile) => (
        <StyledCellItem
          value={tile.value}
          removed={!!tile.isRemoved}
          key={tile.id}
          position={`${tile.x}-${tile.y}`}
          valueChanged={!!tile.merged}>{tile.value}</StyledCellItem>
      ))
    }
  </>
}

export default function GameComponent2048() {
  const [resetCallback, setResetCallback] = useState<(() => void) | null>(null)

  return (
    <StyledPageContainer>
      <StyledGameField>
        {Array.from({ length: 16 }).map((_, i) => (
          <StyledGameFieldCell key={i} />
        ))}
        <TilesContextProvider setResetCallback={setResetCallback}>
          <TilesComponent />
        </TilesContextProvider>
      </StyledGameField>
      <StyledResetGameButton onClick={() => resetCallback?.()}>Reset</StyledResetGameButton>
    </StyledPageContainer>
  );
}