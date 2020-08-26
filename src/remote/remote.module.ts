import { Module } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { remoteAdapterFactory } from './remote.provider';
import { RegistryAdapterFactory } from './registry.provider';

@Module({
  providers: [remoteAdapterFactory, RegistryAdapterFactory, RemoteService],
  exports: [remoteAdapterFactory, RemoteService],
})
export class RemoteModule {}
