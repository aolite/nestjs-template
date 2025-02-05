import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from './utils/requser.decorator';
import { AuthService } from './auth/auth.service';
import { User } from './users/user.schema';

@Controller()
export class AppController {

    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    async login(@Body() user: User) {
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@ReqUser() user: User) {
        return user;
    }
}
