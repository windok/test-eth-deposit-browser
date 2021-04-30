import { Injectable, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { BlockNumber } from 'web3-core';
import { Subscription } from 'web3-core-subscriptions';
import { BlockTransactionObject, BlockHeader } from 'web3-eth';
import EventEmitter from 'events';

export const RECEIVED_TRANSACTION = Symbol('RECEIVED_TRANSACTION');

@Injectable()
export class Web3Service {
  private newBlocksSubscription?: Subscription<BlockHeader>;

  public constructor(
    @Inject('WEB3_HTTP_CLIENT') private readonly web3HttpClient: Web3,
    @Inject('WEB3_WS_CLIENT') private readonly web3WsClient: Web3,
  ) {}

  async beforeApplicationShutdown() {
    await this.unsubscribeFromNewBlockHeaders();
  }

  async watchAddressesMentionsInTransaction(addresses: string[]): Promise<EventEmitter> {
    await this.unsubscribeFromNewBlockHeaders();

    const watcher = new EventEmitter();

    if (addresses.length) {
      this.newBlocksSubscription = this.web3WsClient.eth
        .subscribe('newBlockHeaders', async (error, blockHeader: BlockHeader) => {
          error && console.log(error);

          if (!blockHeader) {
            return;
          }

          console.log(blockHeader.number);

          // todo get known with bloom filter and maybe there is no need to request transactions
          const block = await this.getBlock(blockHeader.number);
          const matchingTxs = block.transactions.filter(txn =>
            addresses.find(a => a === txn.from || a === txn.to),
          );

          matchingTxs.forEach(txn => watcher.emit(RECEIVED_TRANSACTION, txn));
        })
        .on('error', console.error); // todo error handling
    }

    return watcher;
  }

  async getBalance(address: string): Promise<string> {
    return this.web3HttpClient.eth.getBalance(address);
  }

  async getBlock(blockNumber: BlockNumber): Promise<BlockTransactionObject> {
    return this.web3HttpClient.eth.getBlock(blockNumber, true);
  }

  private async unsubscribeFromNewBlockHeaders() {
    if (this.newBlocksSubscription) {
      await this.newBlocksSubscription.unsubscribe(function (error, success) {
        error && console.log('Unsubscribe error', error);
        success && console.log('Successfully unsubscribed!');
      });
    }
  }
}
