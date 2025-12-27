import { supabase } from './supabase.js';

const form = document.getElementById('registerForm');
const msg = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');
  const full_name = formData.get('full_name') || null;

  try {
    const { data, error } = await supabase.auth.signUp({ email, password }, { data: { full_name } });
    if (error) throw error;

    // If a user row was created, try to update the profiles table's full_name
    try {
      const userId = data?.user?.id;
      if (userId && full_name) {
        await supabase.from('profiles').update({ full_name }).eq('id', userId);
      }
    } catch (uErr) {
      console.warn('Profile update skipped or failed', uErr);
    }

    msg.style.color = 'green';
    msg.textContent = 'Kayıt başarılı. Lütfen e-postanızı doğrulayın (eğer gerekiyorsa).';
    form.reset();
  } catch (err) {
    msg.style.color = '#d00';
    msg.textContent = err.message || 'Kayıt sırasında hata oluştu.';
    console.error(err);
  }
});
