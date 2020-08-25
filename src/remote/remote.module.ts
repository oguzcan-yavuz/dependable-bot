import { Module } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { remoteAdapterFactory } from './remote.provider';

@Module({
  providers: [remoteAdapterFactory, RemoteService],
  exports: [remoteAdapterFactory, RemoteService],
})
export class RemoteModule {}
