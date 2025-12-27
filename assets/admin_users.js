// Admin users management (uses global _supabase instance)
async function fetchUsers() {
  const container = document.getElementById('userListContainer');
  container.innerHTML = 'Yükleniyor...';
  const { data, error } = await _supabase.from('profiles').select('id, email, role, full_name').order('email');
  if (error) {
    container.innerHTML = '<p>Liste yüklenirken hata oluştu.</p>';
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Henüz kullanıcı yok.</p>';
    return;
  }

  const rows = data.map(u => {
    const name = u.full_name || '';
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;">
          <div style="font-weight:600;color:white;">${u.email}</div>
          <div style="color:#9ca3af;font-size:0.9rem;">${name}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <select data-id="${u.id}" class="role-select" style="padding:6px;border-radius:6px;background:#071022;color:#fff;border:1px solid rgba(255,255,255,0.04);">
            <option value="client" ${u.role === 'client' ? 'selected' : ''}>client</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
          </select>
          <button data-id="${u.id}" class="btn-update-user" style="padding:6px 10px;border-radius:6px;background:#2563eb;color:#fff;border:none;">Güncelle</button>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = rows;

  // Attach listeners
  container.querySelectorAll('.btn-update-user').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const sel = container.querySelector(`select[data-id="${id}"]`);
      const newRole = sel.value;
      if (!confirm('Kullanıcının rolünü "' + newRole + '" olarak değiştirmek istediğinize emin misiniz?')) return;

      const { error } = await _supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) {
        alert('Güncelleme hatası: ' + error.message);
        console.error(error);
      } else {
        alert('Rol başarıyla güncellendi.');
        fetchUsers();
      }
    });
  });
}

// Expose globally so admin.html can call it
window.fetchUsers = fetchUsers;
