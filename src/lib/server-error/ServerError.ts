import { StatusCodes } from 'http-status-codes';

import { ENTITY_NAMES_DICT, IS_DEBUG_MODE } from '@/constants';

import { DomainEntityType } from '@/domain/access-right';

export class ServerError {
  status: StatusCodes;
  title: string;
  message: string;
  exception?: Error;

  constructor(options: {
    status: StatusCodes;
    title: string;
    message: string;
    exception?: Error;
  }) {
    this.status = options.status;
    this.title = options.title;
    this.message = options.message;

    if (IS_DEBUG_MODE) {
      this.exception = options.exception;
    }
  }

  static notFound(options: { method: string; route: string }) {
    return new ServerError({
      status: StatusCodes.NOT_FOUND,
      title: `Не найдено`,
      message: `Невозможно выполнить метод ${options.method} ${options.route}`,
    });
  }

  static badRequest(options: { message: string; exception?: Error }) {
    return new ServerError({
      status: StatusCodes.BAD_REQUEST,
      title: `Запрос не был выполнен`,
      message: options.message,
      exception: options.exception,
    });
  }

  static internalError(options: { message: string; exception?: Error }) {
    return new ServerError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      title: `Внутренняя ошибка сервера`,
      message: options.message,
      exception: options.exception,
    });
  }

  static forbidden() {
    return new ServerError({
      status: StatusCodes.FORBIDDEN,
      title: 'Доступ запрещен',
      message: 'Не удалось получить доступ к данному разделу',
    });
  }

  static unauthorized() {
    return new ServerError({
      status: StatusCodes.UNAUTHORIZED,
      title: 'Доступ запрещен',
      message: 'Необходимо авторизоваться',
    });
  }

  static tokenExpired() {
    return new ServerError({
      status: StatusCodes.UNAUTHORIZED,
      title: 'Произошел выход из системы',
      message: 'Время доступа завершено, перезайдите в систему',
    });
  }

  static cantAuthenticate() {
    return new ServerError({
      status: StatusCodes.UNAUTHORIZED,
      title: 'Вход не выполнен',
      message: 'Неверный логин или пароль',
    });
  }

  static cantCreate(options: { entity: DomainEntityType; exception?: Error }) {
    return ServerError.badRequest({
      message: `Не удалось создать запись сущности "${
        ENTITY_NAMES_DICT[options.entity]
      }"`,
      exception: options.exception,
    });
  }

  static cantFind(options: { entity: DomainEntityType; exception?: Error }) {
    return ServerError.badRequest({
      message: `Не удалось найти запись сущности "${
        ENTITY_NAMES_DICT[options.entity]
      }"`,
      exception: options.exception,
    });
  }

  static cantUpdate(options: { entity: DomainEntityType; exception?: Error }) {
    return ServerError.badRequest({
      message: `Не удалось обновить запись сущности "${
        ENTITY_NAMES_DICT[options.entity]
      }`,
      exception: options.exception,
    });
  }

  static cantRemove(options: { entity: DomainEntityType; exception?: Error }) {
    return ServerError.badRequest({
      message: `Не удалось удалить запись сущности "${
        ENTITY_NAMES_DICT[options.entity]
      }"`,
      exception: options.exception,
    });
  }
}
