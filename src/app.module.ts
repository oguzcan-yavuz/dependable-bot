import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteModule } from './remote/remote.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    SubscriptionModule,
    RemoteModule,
    EmailModule,
  ],
})
export class AppModule {}
