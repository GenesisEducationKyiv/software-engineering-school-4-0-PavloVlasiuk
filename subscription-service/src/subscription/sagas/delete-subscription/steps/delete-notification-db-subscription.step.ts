import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';

import { IResponse } from '../../../../common/interfaces';
import { Subscription } from '../../../entities';
import { NOTIFICATION_CLIENT } from '../../../subscription.constants';
import { IStep } from '../../interfaces';
import { COMMANDS } from '../../saga.constants';

@Injectable()
export class DeleteNotificationDBSubscriptionStep
  implements IStep<Partial<Subscription>>
{
  constructor(
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
    @InjectPinoLogger(DeleteNotificationDBSubscriptionStep.name)
    private readonly logger: PinoLogger,
  ) {
    notificationClient.connect();
  }

  async execute(params: Partial<Subscription>): Promise<void> {
    this.logger.info(
      'External(notification microservice) - Triggering transaction to delete subscription',
    );

    const response = await lastValueFrom<IResponse>(
      this.notificationClient.send(COMMANDS.SUBSCRIPTION_DELETE, params),
    );

    if (!response.success)
      throw new RpcException({
        details: response.message,
        code: response.statusCode,
      });
  }

  async compensate(params: Partial<Subscription>): Promise<void> {
    this.logger.info(
      'External(notification microservice) - Triggering compensate transaction to create subscription',
    );

    await lastValueFrom(
      this.notificationClient.send(COMMANDS.SUBSCRIPTION_CREATE, params),
    );
  }
}
