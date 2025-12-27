import { supabase } from './supabase.js';

const msg = document.getElementById('msg');
const form = document.getElementById('accountForm');
const saveBtn = document.getElementById('saveBtn');
const signOutBtn = document.getElementById('signOutBtn');

async function loadProfile() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    const uid = session.user.id;
    const { data: profile, error } = await supabase.from('profiles').select('id, email, full_name, role').eq('id', uid).single();
    if (error) throw error;

    form.email.value = profile.email || session.user.email;
    form.full_name.value = profile.full_name || '';
    form.role.value = profile.role || 'client';
  } catch (err) {
    console.error(err);
    if (msg) msg.textContent = err.message || 'Profil yüklenemedi.';
  }
}

saveBtn.addEventListener('click', async () => {
  if (msg) { msg.textContent = ''; }
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) { window.location.href = 'login.html'; return; }
    const uid = session.user.id;
    const full_name = form.full_name.value;
    const { error } = await supabase.from('profiles').update({ full_name }).eq('id', uid);
    if (error) throw error;
    if (msg) { msg.style.color = 'green'; msg.textContent = 'Profil güncellendi.'; }
  } catch (err) {
    console.error(err);
    if (msg) { msg.style.color = '#d00'; msg.textContent = err.message || 'Güncelleme başarısız.'; }
  }
});

signOutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
});

loadProfile();
