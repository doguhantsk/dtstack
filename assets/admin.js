import { supabase } from './supabase.js';

async function checkSession() {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    const uid = session.user.id;
    // fetch profile with role
    const { data: profile, error } = await supabase.from('profiles').select('full_name, role').eq('id', uid).single();
    if (error) {
      console.warn('Profile fetch failed', error);
      window.location.href = 'login.html';
      return;
    }

    // check admin role
    if (!profile || profile.role !== 'admin') {
      // Not an admin -> kick out
      await supabase.auth.signOut();
      window.location.href = 'login.html';
      return;
    }

    const el = document.querySelector('.admin-username');
    if (el) el.textContent = profile.full_name || session.user.email;
  } catch (err) {
    console.error(err);
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkSession();

  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});
