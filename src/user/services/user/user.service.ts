import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // async findOneByEmail(email: string): Promise<Prisma.User | null> {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }

  // async findOneById(id: string): Promise<Prisma.User | null> {
  //   return this.prisma.user.findUnique({
  //     where: { id },
  //   });
  // }

  // async create(user: Prisma.UserCreateInput): Promise<Prisma.User> {
  //   return this.prisma.user.create({
  //     data: user,
  //   });
  // }

  // async update(
  //   userId: string,
  //   userInformation: Prisma.UserUpdateInput,
  // ): Promise<Prisma.User> {
  //   return this.prisma.user.update({
  //     where: { id: userId },
  //     data: userInformation,
  //   });
  // }
}
