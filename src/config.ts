import { EntityType } from './types';

export const ENTITY_NAMES_DICT = Object.freeze({
  [EntityType.ACCESS_RIGHT]: 'Право доступа',
  [EntityType.APARTMENT]: 'Квартира',
  [EntityType.APP_SECTION]: 'Раздел приложения',
  [EntityType.USER]: 'Пользователь',
  [EntityType.VIEW_IN_WINDOW]: 'Вид из окна',
});

export const PORT = 3000;
