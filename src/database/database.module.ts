import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmailRepository } from './repositories/email.repository';

@Module({
  providers: [PrismaService, EmailRepository],
  exports: [PrismaService, EmailRepository],
})
export class DatabaseModule {}
