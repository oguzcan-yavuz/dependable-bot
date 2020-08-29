import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import { EmailQueue } from './email.types';
@Module({
  imports: [
    BullModule.registerQueue({
      name: EmailQueue,
      redis: { host: 'localhost', port: 6379 },
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
