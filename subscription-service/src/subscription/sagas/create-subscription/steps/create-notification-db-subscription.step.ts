import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { IResponse } from '../../../../common/interfaces';
import { Subscription } from '../../../entities';
import { NOTIFICATION_CLIENT } from '../../../subscription.constants';
import { IStep } from '../../interfaces';
import { COMMANDS } from '../../saga.constants';

@Injectable()
export class CreateNotificationDBSubscriptionStep
  implements IStep<Partial<Subscription>>
{
  constructor(
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
  ) {
    notificationClient.connect();
  }

  async execute(params: Partial<Subscription>): Promise<void> {
    console.log('Notification service transaction');

    const response = await lastValueFrom<IResponse>(
      this.notificationClient.send(COMMANDS.SUBSCRIPTION_CREATE, params),
    );

    if (!response.success)
      throw new RpcException({
        details: response.message,
        code: response.statusCode,
      });
  }

  async compensate(params: Partial<Subscription>): Promise<void> {
    console.log('Notification service compensate transaction');

    await lastValueFrom(
      this.notificationClient.send(COMMANDS.SUBSCRIPTION_DELETE, params),
    );
  }
}
