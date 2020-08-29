import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: unknown) {
    const isValid = isValidObjectId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid id');
    }

    return value;
  }
}
