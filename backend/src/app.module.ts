import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3Service } from './services/web3.service';
import { AddressService } from './services/address.service';
import { TransactionService } from './services/transaction.service';

// todo add logger

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'WEB3_HTTP_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Web3(configService.get('WEB3_HTTP_PROVIDER'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'WEB3_WS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Web3(configService.get('WEB3_WS_PROVIDER'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'WEB3_UTILS',
      useValue: Web3.utils,
    },
    AppService,
    Web3Service,
    AddressService,
    TransactionService,
  ],
})
export class AppModule {}
