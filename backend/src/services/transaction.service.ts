import { Injectable } from '@nestjs/common';
import { Transaction } from 'web3-eth';

@Injectable()
export class TransactionService {
  // todo preserve transactions in database
  private transactions: Transaction[] = [];

  async getTransactions(): Promise<Transaction[]> {
    return this.transactions;
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    !this.transactions.find(txn => txn.hash === transaction.hash) &&
      this.transactions.push(transaction);

    console.log(this.transactions);
  }

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    return this.transactions.filter(txn => txn.from === address || txn.to === address);
  }

  async syncTransactionsByAddress(addresses: string[]) {
    this.transactions = this.transactions.filter(
      txn => addresses.includes(txn.from) || addresses.includes(txn.to),
    );

    return this.getTransactions();
  }
}
