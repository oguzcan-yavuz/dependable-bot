import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteModule } from './remote/remote.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    SubscriptionModule,
    RemoteModule,
  ],
})
export class AppModule {}
