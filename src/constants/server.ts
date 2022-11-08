export const PORT = 8080;

export const URLS = Object.freeze({
  ACCESS_RIGHTS: '/access-rights' as const,
  APARTMENTS: '/apartments' as const,
  AUTHENTICATION: '/auth' as const,
  CITIES: '/cities' as const,
  USERS: '/users' as const,
  VIEWS_IN_WINDOW: '/views-in-window' as const,
});

export const DOMAIN_ENTITY_TYPES = Object.freeze({
  ACCESS_RIGHT: 'access-right',
  APARTMENT: 'apartment',
  CITY: 'city',
  USER: 'user',
  VIEW_IN_WINDOW: 'view-in-window',
});

const DEBUG_IS_ON = 1;

export const IS_DEBUG_MODE = Number(process.env.DEBUG || null) === DEBUG_IS_ON;
