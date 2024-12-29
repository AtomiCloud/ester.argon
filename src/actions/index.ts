import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { getSecret } from 'astro:env/server';

export const server = {
  submitWaitlistEmail: defineAction({
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      const apiKey = getSecret('BREVO_API_KEY');

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          listIds: [5],
        }),
      };

      const r = await fetch('https://api.brevo.com/v3/contacts', options);

      if (!r.ok) {
        console.error(r.statusText);
        console.error(r.status);
        console.error(r.url);
        throw new ActionError({
          message: 'Something went wrong while adding you to the waitlist 😢',
          statusCode: 'INTERNAL_SERVER_ERROR',
        });
      }
      return email;
    },
  }),
};
