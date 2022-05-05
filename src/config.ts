import { EntityType } from './types';

export const ENTITY_NAMES_DICT = Object.freeze({
  [EntityType.ACCESS_RIGHT]: 'Право доступа',
  [EntityType.APARTMENT]: 'Квартира',
  [EntityType.APP_SECTION]: 'Раздел приложения',
  [EntityType.USER]: 'Пользователь',
  [EntityType.VIEW_IN_WINDOW]: 'Вид из окна',
});

export const PORT = 3000;

const DEBUG_ON_VALUE = 1;
export const IS_DEBUG_MODE =
  Number(process.env.DEBUG || null) === DEBUG_ON_VALUE;

export const TOKEN_EXPIRES_IN = 60 * 60 * 24;

export const URLS = Object.freeze({
  ACCESS_RIGHTS: '/access-rights' as const,
  APARTMENTS: '/apartments' as const,
  AUTHENTICATION: '/auth' as const,
  CITIES: '/cities' as const,
  USERS: '/users' as const,
  VIEWS_IN_WINDOW: '/views-in-window' as const,
});
