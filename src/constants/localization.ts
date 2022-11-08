import { DOMAIN_ENTITY_TYPES } from './server';

export const ENTITY_NAMES_DICT = Object.freeze({
  [DOMAIN_ENTITY_TYPES.ACCESS_RIGHT]: 'Право доступа',
  [DOMAIN_ENTITY_TYPES.APARTMENT]: 'Квартира',
  [DOMAIN_ENTITY_TYPES.USER]: 'Пользователь',
  [DOMAIN_ENTITY_TYPES.CITY]: 'Город',
  [DOMAIN_ENTITY_TYPES.VIEW_IN_WINDOW]: 'Вид из окна',
});
