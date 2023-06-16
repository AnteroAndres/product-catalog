import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create(SignupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create(SignupInput);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException('algo salio mal')
    }
  }

  async findAll():Promise<User[]>{
    return [];
  }

  findOne(id: string):Promise<User> {
    throw new Error(`findOne not implemented`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string):Promise<User> {
    throw new Error(`block method not implemented`);

  }
}
