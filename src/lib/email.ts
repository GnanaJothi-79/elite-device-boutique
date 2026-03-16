export const sendNotificationEmail = async (type: string, data: Record<string, string>) => {
  try {
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type, data }),
      }
    );
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
};
