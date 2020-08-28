import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidDependencyManagerException extends HttpException {
  constructor() {
    super('This dependency manager is not supported.', HttpStatus.BAD_REQUEST);
  }
}
