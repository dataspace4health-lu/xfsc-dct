import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'custom') {
    constructor(protected authService: AuthService) {
        super();
    }

    async validate(req) {
        const token = req.headers.authorization;
        return this.authService.validateToken(token);
    }
}
