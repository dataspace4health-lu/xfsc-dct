import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateGateway } from '../gateways/validate.gateway';
import { ValidateDto } from '../dtos/validate.dto';

@Injectable()
export class ValidateService {
    public constructor(protected registerApi: ValidateGateway) {}

    create(validateDto: ValidateDto) {
      return validateDto;
    }

    // checkProvider(jws: string) {
    //     return this.registerApi.checkProvider(jws);
    // }

    // checkSignature(signature: string) {
    //   return this.registerApi.checkSignature(signature);
    // }

    // addSignature() {
    //   return this.registerApi.addSignature();
    // }
}
