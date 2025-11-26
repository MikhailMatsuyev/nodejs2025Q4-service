import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUser, IUserResponse } from './interfaces/user.interface';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService {
  constructor(private readonly storageService: StorageService) {}

  findAll(): IUserResponse[] {
    return this.storageService.getUsers().map(this.excludePassword);
  }

  findOne(id: string): IUserResponse {
    const user = this.storageService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  create(dto: CreateUserDto): IUserResponse {
    const now = Date.now();
    const user: IUser = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.storageService.addUser(user);
    return this.excludePassword(user);
  }

  update(id: string, dto: UpdatePasswordDto): IUserResponse {
    const user = this.storageService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const updatedUser: IUser = {
      ...user,
      password: dto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.storageService.updateUser(id, updatedUser);
    return this.excludePassword(updatedUser);
  }

  remove(id: string): void {
    const user = this.storageService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.storageService.deleteUser(id);
  }

  private excludePassword(user: IUser): IUserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
