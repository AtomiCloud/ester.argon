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
      let r;
      try {
        r = await fetch('https://api.brevo.com/v3/contacts', options);
      } catch (error) {
        console.error('caught error', error);
        throw new ActionError({
          message: 'Something went wrong while adding you to the waitlist 😢',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      const body = await r.text();
      if (!r.ok) {
        // Check if the response is a JSON object
        let response;
        try {
          response = JSON.parse(body);
        } catch (error) {
          console.error('caught error', error);
          throw new ActionError({
            message: 'Something went wrong while adding you to the waitlist 😢',
            code: 'BAD_REQUEST',
          });
        }
        console.error(response);
        if (response.code && response.code == 'duplicate_parameter') {
          throw new ActionError({
            message: 'You are already on the waitlist!',
            code: 'CONFLICT',
          });
        } else {
          throw new ActionError({
            message: 'Something went wrong while adding you to the waitlist 😢',
            code: 'BAD_REQUEST',
          });
        }
      }
      console.log('Success', r.ok);
      return email;
    },
  }),
};
