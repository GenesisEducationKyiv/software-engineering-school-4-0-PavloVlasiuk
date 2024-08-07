// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.0
//   protoc               v4.25.3
// source: subscription/subscription.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "subscription";

export interface SubscribeEmailDto {
  email: string;
}

export interface Empty {
}

export interface Subscriber {
  id: string;
  email: string;
}

export interface Subscribers {
  subscribers: Subscriber[];
}

export const SUBSCRIPTION_PACKAGE_NAME = "subscription";

export interface SubscriptionServiceClient {
  subscribe(request: SubscribeEmailDto): Observable<Empty>;

  getAllSubscribers(request: Empty): Observable<Subscribers>;
}

export interface SubscriptionServiceController {
  subscribe(request: SubscribeEmailDto): Promise<Empty> | Observable<Empty> | Empty;

  getAllSubscribers(request: Empty): Promise<Subscribers> | Observable<Subscribers> | Subscribers;
}

export function SubscriptionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["subscribe", "getAllSubscribers"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SubscriptionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SubscriptionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SUBSCRIPTION_SERVICE_NAME = "SubscriptionService";
