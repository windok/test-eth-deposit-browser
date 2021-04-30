import EventEmitter from 'events';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Utils } from 'web3-utils';
import BN from 'bn.js';
import { Web3Service, RECEIVED_TRANSACTION } from './services/web3.service';
import { AddressService } from './services/address.service';
import { TransactionService } from './services/transaction.service';

@Injectable()
export class AppService {
  private addressWatcher?: EventEmitter;

  constructor(
    private readonly web3Service: Web3Service,
    private readonly addressService: AddressService,
    private readonly transactionService: TransactionService,
    @Inject('WEB3_UTILS') private readonly web3Utils: Utils,
  ) {}

  async startWatchingAddress(address: string): Promise<void> {
    await this.addressService.addAddress(address);

    this.watchAddresses();
  }

  async stopWatchingAddress(address: string): Promise<void> {
    await this.addressService.removeAddress(address);

    this.watchAddresses();

    await this.transactionService.syncTransactionsByAddress(
      await this.addressService.getAddresses(),
    );
  }

  async getBalance(address: string) {
    if (!(await this.addressService.getAddresses()).includes(address)) {
      throw new NotFoundException('Address is not served by the system');
    }

    const txs = await this.transactionService.getTransactionsByAddress(address);
    const toBN = this.web3Utils.toBN;

    const balance = txs.reduce<BN>((acc, txn) => {
      if (txn.to === address && txn.from !== address) {
        return acc.add(toBN(txn.value));
      }

      const commission = toBN(txn.gasPrice).mul(toBN(txn.gas));

      if (txn.to !== address && txn.from === address) {
        return acc.sub(toBN(txn.value)).sub(commission);
      }

      if (txn.to === address && txn.from === address) {
        return acc.sub(commission);
      }

      return acc;
    }, toBN('0'));

    return {
      depositedBalance: this.formatBalance(balance),
      actualBalance: this.formatBalance(await this.web3Service.getBalance(address)),
    };
  }

  async getAddressTransactions(address: string) {
    if (!(await this.addressService.getAddresses()).includes(address)) {
      throw new NotFoundException('Address is not served by the system');
    }

    return this.transactionService.getTransactionsByAddress(address);
  }

  private async watchAddresses(): Promise<void> {
    const allWatchingAddresses = await this.addressService.getAddresses();

    if (this.addressWatcher) {
      this.addressWatcher.removeAllListeners(RECEIVED_TRANSACTION);
    }

    this.addressWatcher = await this.web3Service.watchAddressesMentionsInTransaction(
      allWatchingAddresses,
    );

    this.addressWatcher.addListener(RECEIVED_TRANSACTION, this.onTransactionWithAddress.bind(this));
  }

  private async onTransactionWithAddress(transaction) {
    return this.transactionService.addTransaction(transaction);
  }

  private formatBalance(weiBalance: string | BN) {
    return {
      wei: this.web3Utils.fromWei(weiBalance, 'wei'),
      eth: this.web3Utils.fromWei(weiBalance, 'ether'),
    };
  }
}
