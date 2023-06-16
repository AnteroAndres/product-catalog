import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {


    constructor(
        private readonly usersService: UsersService,
    ){}
    async signup(signupInput:SignupInput):Promise<AuthResponse>{
        //todo:crear usuario
        const user = await this.usersService.create(signupInput);
        //todo:crear JWT

        const token = 'ABC123';

        return{token, user};
        throw new Error('No implementado')
    }
}
