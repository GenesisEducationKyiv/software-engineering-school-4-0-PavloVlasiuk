import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { DatabaseModule } from 'src/database/database.module';
import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';

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
    AppConfigModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
