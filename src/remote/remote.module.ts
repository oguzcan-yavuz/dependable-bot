import { Module } from '@nestjs/common';
import { RemoteService } from './remote.service';

@Module({
  providers: [RemoteService],
  exports: [RemoteService],
})
export class RemoteModule {}
