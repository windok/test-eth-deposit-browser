import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import web3 from 'web3';

@ValidatorConstraint({ async: false })
export class IsEthAddress implements ValidatorConstraintInterface {
  validate(value: string) {
    return web3.utils.isAddress(value);
  }

  defaultMessage() {
    return 'Ethereum address $property is invalid';
  }
}
