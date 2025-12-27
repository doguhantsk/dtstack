import { supabase } from './supabase.js';

const form = document.getElementById('forgotForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const email = form.email.value;
  try {
    // Optionally set redirectTo to your reset page if you implement one
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });
    if (error) throw error;
    msg.style.color = 'green';
    msg.textContent = 'E-posta gönderildi. Gelen kutunuzu ve spam klasörünüzü kontrol edin.';
  } catch (err) {
    console.error(err);
    msg.style.color = '#d00';
    msg.textContent = err.message || 'Sıfırlama isteği gönderilemedi.';
  }
});
