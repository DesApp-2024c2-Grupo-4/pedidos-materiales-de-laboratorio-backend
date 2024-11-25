export const ReactiveConcentrationTypes = {
  puro: 'Puro',
  molar: 'Molar',
  normal: 'Normalidad',
  '%m/m': '% masa/masa',
  '%m/v': '% masa/volumen',
  '%v/v': '% volumen/volumen',
} as const;

export type ReactiveConcentarationTypesValue =
  (typeof ReactiveConcentrationTypes)[keyof typeof ReactiveConcentrationTypes];

export type ReactiveConcentrationTypesKeys =
  keyof typeof ReactiveConcentrationTypes;

export const ReactiveQualities = {
  'p.a.': 'P/Análisis',
  molec: 'Calidad Molecular',
  '°_tec': '°Técnico',
} as const;

export type ReactiveQualitiesValue =
  (typeof ReactiveQualities)[keyof typeof ReactiveQualities];

export type ReactiveQualitiesKeys = keyof typeof ReactiveQualities;

export const ReactiveUnits = {
  gr: 'Gramo',
  kg: 'Kilo',
  l: 'Litro',
  ml: 'MIlilitro',
  un: 'unidad',
} as const;

export type ReactiveUnitsValue =
  (typeof ReactiveUnits)[keyof typeof ReactiveUnits];

export type ReactiveUnitsKeys = keyof typeof ReactiveUnits;

export const ReactiveSolvents = {
  agua: 'Agua',
  alcohol: 'Alcohol',
  otro: 'Otro',
} as const;

export type ReactiveSolventsValue =
  (typeof ReactiveSolvents)[keyof typeof ReactiveSolvents];

export type ReactiveSolventsKeys = keyof typeof ReactiveSolvents;
