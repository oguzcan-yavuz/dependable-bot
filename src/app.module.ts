import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteModule } from './remote/remote.module';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    NestEmitterModule.forRoot(new EventEmitter()),
    SubscriptionModule,
    RemoteModule,
  ],
})
export class AppModule {}
