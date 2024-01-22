import styled, { keyframes, css } from "styled-components";

function getAbsolutePosition(position: string) {
  const [col, row] = position.split("-");
  const x = (parseInt(col) - 1) * 100 + 55;
  const y = (parseInt(row) - 1) * 100 + 55;
  return { x, y };
}

const ValueColor: Record<number, string> = {
  0: "#cdc1b4",
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
};

const expandAnimation = keyframes`
    0% {
        width: 0;
        height: 0;
    }
    50% {
        width: 10;
        height: 10;
    }
    100% {
        width: 90px;
        height: 90px;
    }
`;

const mergeAnimation = keyframes`
    0% {
        width: 90px;
        height: 90px;
    }
    50% {
        width: 110px;
        height: 110px;
    }
    100% {
        width: 90px;
        height: 90px;
    }
`;

export const StyledPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

export const StyledCellItem = styled.div<{ value: number, position: string, valueChanged: boolean, removed: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px; 
    height: 90px;
    background-color: ${({ value }) => ValueColor[value]};
    border-radius: 6px;
    font-size: 2em;
    color: ${({ value }) => (value > 4 ? "#f9f6f2" : "#776e65")};
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: ${({ removed }) => (removed ? 1 : 2)};
    top: ${({ position }) => getAbsolutePosition(position).y}px;
    left: ${({ position }) => getAbsolutePosition(position).x}px;
    transition: all 0.2s ease-in-out;
    ${({ valueChanged }) =>
    valueChanged
      ? css`
          animation: ${css`${mergeAnimation} 0.1s ease-in-out`},
            ${css`${expandAnimation} 0.15s ease-out`};
        `
      : css`
          animation: ${css`${expandAnimation} 0.15s ease-out`};
        `}`;

export const StyledGameField = styled.div`
    display: grid;
    grid: repeat(4, 1fr) / repeat(4, 1fr);
    gap: 10px;
    padding: 10px;
    background-color: #bbada0;
    border-radius: 6px;
    position: relative;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 1.5em;
    color: #776e65;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);

`;

export const StyledGameFieldCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    background-color: #cdc1b4;
    border-radius: 6px;
    font-size: 2em;
    color: #776e65;
`;

export const StyledResetGameButton = styled.button`
    padding: 10px;
    border-radius: 6px;
    border: none;
    background-color: #8f7a66;
    color: #f9f6f2;
    font-size: 1.5em;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #9c8a7d;
    }
`;