import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase energy variables in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  const email = 'admin@05rpm.com';
  const password = '  ';

  console.log(`Attempting to create admin user: ${email}`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Admin user already exists. Attempting to update password instead...');
      
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError.message);
        return;
      }

      const existingUser = listData.users.find(u => u.email === email);
      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
          password: password
        });
        if (updateError) {
          console.error('Error updating password:', updateError.message);
        } else {
          console.log('Admin password updated successfully!');
        }
      }
    } else {
      console.error('Error creating admin user:', error.message);
    }
  } else {
    console.log('Admin user created successfully!', data.user?.id);
  }
}

seedAdmin();
