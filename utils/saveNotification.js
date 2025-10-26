import { apiFetch } from './apiFetch';
import config from './config';

export const saveNotification = async ({ user_id, team_id, message }) => {
  try {
    const payload = { message };

    if (user_id) payload.user_id = user_id;
    if (team_id) payload.team_id = team_id;

    await apiFetch(`${config.API_BASE_URL}/api/notifications`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to save notification:", err);
  }
};