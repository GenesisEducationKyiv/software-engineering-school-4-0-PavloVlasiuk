import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: string): T {
    const value = this.configService.get<T>(key);

    if (!value) {
      throw new Error(`${key} environment variable is not defined`);
    }

    return value;
  }
}
