import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local.guard";
import { AuthService } from "../services/auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req) {
    return this.authService.loginAdmin(req.user);
  }
}
