import { F_GRID, CARD_DIMENSIONS } from '../../constants/intro';

export interface GridPosition {
  row: number;
  col: number;
  x: number;
  y: number;
}

/**
 * Calculate all card positions for the F-shape grid
 */
export const calculateFGridPositions = (
  viewportWidth: number,
  viewportHeight: number
): GridPosition[] => {
  const isMobile = viewportWidth < 768;
  const cardWidth = isMobile ? CARD_DIMENSIONS.mobileWidth : CARD_DIMENSIONS.width;
  const cardHeight = isMobile ? CARD_DIMENSIONS.mobileHeight : CARD_DIMENSIONS.height;

  const rows = F_GRID.length;
  const cols = F_GRID[0].length;

  // Calculate spacing
  const totalGridWidth = cols * cardWidth;
  const totalGridHeight = rows * cardHeight;
  const spacingX = (viewportWidth - totalGridWidth) / (cols + 1);
  const spacingY = (viewportHeight - totalGridHeight) / (rows + 1);

  // Center the grid
  const startX = spacingX;
  const startY = spacingY;

  const positions: GridPosition[] = [];

  F_GRID.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        positions.push({
          row: rowIndex,
          col: colIndex,
          x: startX + colIndex * (cardWidth + spacingX),
          y: startY + rowIndex * (cardHeight + spacingY),
        });
      }
    });
  });

  return positions;
};

/**
 * Get random spawn position from screen edges
 */
export const getRandomSpawnPosition = (
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number; rotation: number } => {
  const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  const isMobile = viewportWidth < 768;
  const cardWidth = isMobile ? CARD_DIMENSIONS.mobileWidth : CARD_DIMENSIONS.width;
  const cardHeight = isMobile ? CARD_DIMENSIONS.mobileHeight : CARD_DIMENSIONS.height;

  let x = 0;
  let y = 0;
  let rotation = (Math.random() - 0.5) * 6; // ±3 degrees

  switch (edge) {
    case 0: // Top
      x = Math.random() * viewportWidth;
      y = -cardHeight - 50;
      rotation = (Math.random() - 0.5) * 6;
      break;
    case 1: // Right
      x = viewportWidth + 50;
      y = Math.random() * viewportHeight;
      rotation = 90 + (Math.random() - 0.5) * 6;
      break;
    case 2: // Bottom
      x = Math.random() * viewportWidth;
      y = viewportHeight + 50;
      rotation = 180 + (Math.random() - 0.5) * 6;
      break;
    case 3: // Left
      x = -cardWidth - 50;
      y = Math.random() * viewportHeight;
      rotation = -90 + (Math.random() - 0.5) * 6;
      break;
  }

  return { x, y, rotation };
};

