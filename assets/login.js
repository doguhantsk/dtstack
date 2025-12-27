import { supabase } from './supabase.js';

const form = document.getElementById('loginForm');
const msg = document.getElementById('loginMessage');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) { msg.textContent = ''; msg.style.color = '#d00'; }
    try {
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;

      console.log('Logging in', email);
      const res = await supabase.auth.signInWithPassword({ email, password });
      console.log('Supabase response', res);

      const error = res.error;
      const data = res.data;
      if (error) {
        throw error;
      }

      // If session exists, fetch user's profile to determine role and redirect accordingly
      const session = data?.session;
      if (session) {
        try {
          const uid = session.user.id;
          const { data: profile, error: pErr } = await supabase.from('profiles').select('role').eq('id', uid).single();
          if (pErr) throw pErr;
          const role = profile?.role || 'client';
          if (msg) { msg.style.color = 'green'; msg.textContent = 'Giriş başarılı, yönlendiriliyorsunuz...'; }
          // Redirect based on role
          if (role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            // Non-admin users go to the homepage (no account page)
            window.location.href = 'index.html';
          }
          return;
        } catch (fetchErr) {
          console.error('Profile fetch error', fetchErr);
          // Fallback: send to account page
          if (msg) { msg.style.color = 'green'; msg.textContent = 'Giriş başarılı, yönlendiriliyorsunuz...'; }
          window.location.href = 'account.html';
          return;
        }
      }

      // No session: likely email confirmation required
      if (msg) {
        msg.style.color = '#d00';
        msg.textContent = 'Giriş başarılı ancak oturum oluşturulmadı. Lütfen e-posta doğrulamasını kontrol edin.';
      } else {
        alert('Giriş başarılı ancak oturum oluşturulmadı. Lütfen e-posta doğrulamasını kontrol edin.');
      }
    } catch (err) {
      console.error(err);
      const text = err?.message || JSON.stringify(err) || 'Giriş başarısız.';
      if (msg) msg.textContent = text;
      else alert(text);
    }
  });
}
