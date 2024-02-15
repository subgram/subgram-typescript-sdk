export type CheckoutPageResponse = {
  subscription_uuid: string;
  checkout_url: string;
}

export type UserProductAccessStatusResponse = {
  has_access: boolean;
}

export type SubscriptionStatusResponse = {
  subscription_uuid: string;
  status: string;
  started_at: string | null;
  ending_at: string | null;
  cancelled_at: string | null;
  user_has_access: boolean;
  can_be_purchased: boolean;
  can_be_cancelled: boolean;
  can_be_upgraded: boolean;
}

export type CustomerEventObject = {
  telegram_id: number;
  name: string | null;
  email: string | null;
  language_code: string | null;
}

export type SubscriptionEventObject = {
  status: SubscriptionStatusResponse;
  customer: CustomerEventObject;
}

export enum EventType {
  SUBSCRIPTION_STARTED = "subscription.started",
  SUBSCRIPTION_RENEWED = "subscription.renewed",
  SUBSCRIPTION_RENEW_FAILED = "subscription.renew_failed",
  SUBSCRIPTION_CANCELLED = "subscription.cancelled",
  SUBSCRIPTION_UPGRADED = "subscription.upgraded",
}

export type Event = {
  event_id: number;
  type: EventType;
  object: SubscriptionEventObject;
}