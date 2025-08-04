import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  // 1. Get Service Role Key and create Admin Client
  const supabaseServiceRoleKey = locals.supabaseServiceRoleKey;
  if (!supabaseServiceRoleKey) {
    return new Response(JSON.stringify({ error: 'Service role key is missing.' }), { status: 500 });
  }
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 2. Check for admin authentication
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401 });
  }
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Authentication failed.' }), { status: 401 });
  }

  // 3. Get post ID from the request body
  const { id } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Post ID is required.' }), { status: 400 });
  }

  // 4. Get the image URL from the post before deleting it
  const { data: postData, error: fetchError } = await supabaseAdmin
    .from('posts')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError || !postData) {
    // If the post is already gone, we can consider it a success.
    return new Response(JSON.stringify({ message: 'Post not found, assumed already deleted.' }), { status: 200 });
  }

  // 5. Delete the image from Supabase Storage
  if (postData.image_url) {
    const imageName = postData.image_url.split('/').pop();
    if (imageName) {
      await supabaseAdmin.storage.from('images').remove([imageName]);
    }
  }

  // 6. Delete the post from the database
  const { error: deleteError } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: `Database delete failed: ${deleteError.message}` }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Post deleted successfully.' }), { status: 200 });
};
