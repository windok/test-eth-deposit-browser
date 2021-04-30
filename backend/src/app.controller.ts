import { Controller, Get, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { AddressDto } from './dto/address.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('address')
  async getWatchingAddresses() {
    return this.appService.getWatchingAddresses();
  }

  @Put('address')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addAddressToWatch(@Body() payload: AddressDto) {
    await this.appService.startWatchingAddress(payload.address);
  }

  @Delete('address/:address')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAddressToWatch(@Param() payload: AddressDto) {
    await this.appService.stopWatchingAddress(payload.address);
  }

  @Get('address/:address/balance')
  async getBalance(@Param() payload: AddressDto) {
    return this.appService.getBalance(payload.address);
  }

  @Get('address/:address/transaction')
  async getTransactions(@Param() payload: AddressDto) {
    return this.appService.getAddressTransactions(payload.address);
  }
}
