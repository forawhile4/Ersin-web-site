import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  // 0. Get Service Role Key from locals and create Admin Client
  const supabaseServiceRoleKey = locals.supabaseServiceRoleKey;
  if (!supabaseServiceRoleKey) {
    return new Response(
      JSON.stringify({
        error: 'Supabase service role key is not available. Check middleware setup.',
      }),
      { status: 500 }
    );
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 1. Check Authentication by verifying the user's JWT
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Authentication required: No access token found.' }), { status: 401 });
  }

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Authentication failed: Invalid token.' }), { status: 401 });
  }

  // 2. Handle Form Data
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File;

  if (!title || !location || !content || !imageFile) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
  }

  // 3. Upload Image to Storage
  const fileName = `${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from('images')
    .upload(fileName, imageFile);

  if (uploadError) {
    return new Response(JSON.stringify({ error: `Image upload failed: ${uploadError.message}` }), { status: 500 });
  }

  // 4. Get Public URL of the image
  const { data: urlData } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);

  if (!urlData || !urlData.publicUrl) {
    return new Response(JSON.stringify({ error: 'Could not retrieve public URL for the image.' }), { status: 500 });
  }
  const imageUrl = urlData.publicUrl;

  // 5. Insert Post into Database
  const { data, error: dbError } = await supabaseAdmin
    .from('posts')
    .insert([{ title, location, content, image_url: imageUrl }])
    .select();

  if (dbError) {
    return new Response(JSON.stringify({ error: `Database insert failed: ${dbError.message}` }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};
