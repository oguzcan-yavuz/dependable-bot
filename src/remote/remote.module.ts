import { Module } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { RemoteAdapterFactory } from './remote.provider';
import { RegistryAdapterFactory } from './registry.provider';

@Module({
  providers: [RemoteAdapterFactory, RegistryAdapterFactory, RemoteService],
  exports: [RemoteService],
})
export class RemoteModule {}
