import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.module';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, "custom") {

    constructor(protected configService: ConfigService<ConfigType>) {
        super();
    }

    async validate(req) {
        const token = req.headers.authorization;
        console.log('TBD: validate token, for now were validating against a hardcoded value', token);
        return token === `Bearer ${this.configService.get('general.token', { infer: true })}`;
    }
}