import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodPipe<T> implements PipeTransform {
  constructor(private readonly schema: z.Schema<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata): T {
    return this.schema.parse(value);
  }
}
