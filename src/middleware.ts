import { defineMiddleware } from 'astro:middleware';

// `defineMiddleware` is used to create a middleware function that will run for every request.
export const onRequest = defineMiddleware((context, next) => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;



  // Store the key in `context.locals`. This makes it available
  // in all server-side code, like API endpoints and server-rendered pages.
  context.locals.supabaseServiceRoleKey = serviceRoleKey;

  // Move to the next middleware or the page/API route itself.
  return next();
});
