export const MaterialTypes = {
  MATERIALES: 'MATERIALES',
  'MATERIAL-VIDRIO': 'MATERIAL VIDRIO',
} as const;

export type MaterialTypesValue =
  (typeof MaterialTypes)[keyof typeof MaterialTypes];

export type MaterialType = keyof typeof MaterialTypes;
