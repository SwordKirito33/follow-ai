// Animation timing constants (in milliseconds)
export const ANIMATION_TIMINGS = {
  PLATFORM_WAKE_UP: 300,
  OUTPUT_CARDS_ENTER: 600, // 0.3s - 0.9s
  FORMING_F_SHAPE: 400, // 0.9s - 1.3s
  VERIFICATION_SCAN: 300, // 1.3s - 1.6s
  LOGO_REVEAL: 200, // 1.6s - 1.8s
  TOTAL_DURATION: 1800, // 1.8s max
} as const;

// F-shape grid definition (6 columns x 7 rows)
// X = card slot, . = empty
export const F_GRID = [
  [1, 1, 1, 1, 0, 0], // Row 0
  [1, 0, 0, 0, 0, 0], // Row 1
  [1, 1, 1, 0, 0, 0], // Row 2
  [1, 0, 0, 0, 0, 0], // Row 3
  [1, 0, 0, 0, 0, 0], // Row 4
  [1, 0, 0, 0, 0, 0], // Row 5
  [1, 0, 0, 0, 0, 0], // Row 6
] as const;

// Calculate total card slots
export const TOTAL_CARD_SLOTS = F_GRID.flat().filter(x => x === 1).length; // 15 cards

// Card count (12-20 cards, we'll use 15 to match F shape)
export const CARD_COUNT = TOTAL_CARD_SLOTS;

// Card dimensions (responsive)
export const CARD_DIMENSIONS = {
  width: 140,
  height: 90,
  mobileWidth: 100,
  mobileHeight: 65,
} as const;

// Spring animation config
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Stagger delay between cards
export const CARD_STAGGER_DELAY = 0.03; // 30ms

