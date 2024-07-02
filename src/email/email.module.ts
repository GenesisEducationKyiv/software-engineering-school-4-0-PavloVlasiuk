import * as path from 'path';

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { EmailController } from './email.controller';
import { EMAIL_REPOSITORY, MAILING_SERVICE } from './interfaces';
import { EmailRepository } from './repositories/email.repository';
import { EmailService, NodeMailerService } from './services';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (appConfigService: AppConfigService) => ({
        transport: {
          host: appConfigService.get<string>('email.host'),
          secure: false,
          auth: {
            user: appConfigService.get<string>('email.user'),
            pass: appConfigService.get<string>('email.password'),
          },
        },
        defaults: {
          from: appConfigService.get<string>('email.from'),
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    { provide: MAILING_SERVICE, useClass: NodeMailerService },
    { provide: EMAIL_REPOSITORY, useClass: EmailRepository },
  ],
  exports: [EmailService],
})
export class EmailModule {}
