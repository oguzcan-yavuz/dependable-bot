import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteModule } from './remote/remote.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    LoggerModule.forRoot(),
    SubscriptionModule,
    RemoteModule,
    EmailModule,
  ],
})
export class AppModule {}
