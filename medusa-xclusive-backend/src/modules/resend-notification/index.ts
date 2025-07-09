//
// This is the complete, corrected index.ts file
//
import ResendNotificationProviderService from './service';
import userInviteHandler from './handlers/user-invite-handler'; // <-- 1. Import the handler

export default {
  services: [ResendNotificationProviderService],
  subscribers: [userInviteHandler], // <-- 2. Add the subscribers array
};