import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: unknown): string {
    const isValid = isValidObjectId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid id');
    }

    return value as string;
  }
}
