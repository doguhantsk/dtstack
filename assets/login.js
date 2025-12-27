import { supabase } from './supabase.js';

const form = document.getElementById('loginForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // On success redirect
      window.location.href = 'admin.html';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Giriş başarısız.');
    }
  });
}
