export const PORT = 8080;

export const RSERVER_PORT = 5000;

export const URLS = Object.freeze({
  ACCESS_RIGHTS: '/access-rights',
  APARTMENTS: '/apartments',
  AUTHENTICATION: '/auth',
  CITIES: '/cities',
  USERS: '/users',
  VIEWS_IN_WINDOW: '/views-in-window',
  MATH_MODELS: '/math-models',
  MODEL_TYPES: '/model-types',
  DATASETS: '/datasets',
});

export const DOMAIN_ENTITY_TYPES = Object.freeze({
  ACCESS_RIGHT: 'access-right',
  APARTMENT: 'apartment',
  CITY: 'city',
  USER: 'user',
  VIEW_IN_WINDOW: 'view-in-window',
  MATH_MODEL: 'math-model',
  MODEL_TYPE: 'model-type',
  DATASET: 'dataset',
});

const DEBUG_IS_ON = 1;

export const IS_DEBUG_MODE = Number(process.env.DEBUG || null) === DEBUG_IS_ON;
