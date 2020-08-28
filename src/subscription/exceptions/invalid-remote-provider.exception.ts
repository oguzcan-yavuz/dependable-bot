import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidRemoteProviderException extends HttpException {
  constructor() {
    super('This remote provider is not supported.', HttpStatus.BAD_REQUEST);
  }
}
