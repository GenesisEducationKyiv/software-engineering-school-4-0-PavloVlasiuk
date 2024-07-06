import * as path from 'path';

import { Module, Provider } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MAILING_SERVICE } from './interfaces';
import { NodeMailerService } from './services';
import { AppConfigModule } from '../config/app-config';
import { AppConfigService } from '../config/app-config';

const MailingServiceImpl: Provider = {
  provide: MAILING_SERVICE,
  useClass: NodeMailerService,
};

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: AppConfigService) => ({
        transport: {
          host: config.get<string>('email.host'),
          secure: false,
          auth: {
            user: config.get<string>('email.user'),
            pass: config.get<string>('email.password'),
          },
        },
        defaults: {
          from: config.get<string>('email.from'),
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
  ],
  providers: [MailingServiceImpl],
  exports: [MailingServiceImpl],
})
export class MailingModule {}
