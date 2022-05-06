import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.module';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, "custom") {

    constructor(protected authService:AuthService) {
        super();
    }

    async validate(req) {
        const token = req.headers.authorization;
        return this.authService.validateToken(token);
    }
}