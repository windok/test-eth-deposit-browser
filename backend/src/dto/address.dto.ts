import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsEthAddress } from './validators/eth-address.validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsEthAddress)
  address: string;
}
