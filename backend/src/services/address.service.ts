import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {
  // todo preserve addresses in database
  private watchingAddresses: Set<string> = new Set();

  async getAddresses(): Promise<string[]> {
    return [...this.watchingAddresses];
  }

  async addAddress(address: string): Promise<void> {
    this.watchingAddresses.add(address);
  }

  async removeAddress(address: string): Promise<void> {
    this.watchingAddresses.delete(address);
  }
}
