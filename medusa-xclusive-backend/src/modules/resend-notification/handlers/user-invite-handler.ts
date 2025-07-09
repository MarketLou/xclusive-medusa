import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import { Modules } from "@medusajs/framework/utils";
import { ResendNotificationTemplates } from '../service';

export default async function userInviteHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; token: string; user_email: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  );

  // The 'data' object from the event contains 'user_email' and 'token'
  await notificationModuleService.createNotifications({
    to: data.user_email,
    channel: "email",
    template: ResendNotificationTemplates.INVITE_CREATED,
    data: {
      subject: 'You have been invited!',
      user_email: data.user_email,
      token: data.token,
    },
  });
}

export const config: SubscriberConfig = {
  event: "invite.created",
}; 