// @flow
import { upperAlphaChars } from "../string-utils";

const gridChars = [
  ...upperAlphaChars,
  ...upperAlphaChars.map(char => `A${char}`),
];

export const getRowHeader = (rowIndex: number) => {
  if (rowIndex < 0 || rowIndex >= gridChars.length) {
    throw new Error(`Invalid row index: ${rowIndex}`);
  }
  return gridChars[rowIndex];
};

// colIndex is 0-based.
export const getColHeader = (colIndex: number) => `${colIndex + 1}`;

export const getGridCellPosition = (rowIndex: number, colIndex: number) => `${getRowHeader(rowIndex)}${getColHeader(colIndex)}`;
