import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  submitWaitlistEmail: defineAction({
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': import.meta.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [5],
        }),
      };

      const r = await fetch('https://api.brevo.com/v3/contacts', options);

      if (!r.ok) {
        console.error(r);
        throw new ActionError({
          message: 'Something went wrong while adding you to the waitlist 😢',
          statusCode: 500,
        });
      }
      return email;
    },
  }),
};
