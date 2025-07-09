import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import { Modules } from "@medusajs/framework/utils";
import { ResendNotificationTemplates } from '../service';

export default async function userInviteHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; token: string; user_email: string }>) {
  
  // --- Step 1: Add detailed logging ---
  console.log('✅ Invite handler triggered for invite event');
  console.log("📨 Preparing to send invite email to:", data.user_email);
  console.log("🔑 Token data:", { token: data.token?.substring(0, 10) + '...' });

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  );
  
  // --- Step 2: Add logging right before sending ---
  console.log(`🚀 Calling notification service to send INVITE_CREATED template...`);

  try {
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

    console.log("✅ Invite email notification created successfully!");
  } catch (error) {
    console.error("❌ ERROR sending invite email:", error);
    throw error;
  }
}

export const config: SubscriberConfig = {
  // --- Step 3: Listen for BOTH events ---
  event: ["invite.created", "invite.resent"],
}; 