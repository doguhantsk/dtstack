import { supabase } from './supabase.js';

// Admin CRUD for projects
const projectsContainerSelector = '.projects-list'; // will create this container in admin.html

export async function loadProjects() {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    const container = document.querySelector(projectsContainerSelector);
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="card"><em>Henüz proje yok.</em></div>';
      return;
    }

    data.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card';
      el.style.display = 'flex';
      el.style.justifyContent = 'space-between';
      el.style.alignItems = 'center';
      el.innerHTML = `
        <div style="display:flex; gap:16px; align-items:center;">
          <div style="width:120px;height:70px;overflow:hidden;border-radius:8px;background:#111;">
            ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fas fa-image" style="font-size:28px;color:#888;padding:12px;"></i>'}
          </div>
          <div>
            <strong>${escapeHtml(p.title)}</strong>
            <div style="color:#9ca3af;font-size:0.9rem">${p.category || ''} • ${p.tags ? p.tags.join(', ') : ''}</div>
          </div>
        </div>
        <div>
          <button class="btn-edit" data-id="${p.id}" style="margin-right:8px;">Düzenle</button>
          <button class="btn-delete" data-id="${p.id}" style="background:#ef4444;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Sil</button>
        </div>
      `;
      container.appendChild(el);
    });

    // attach delete handlers
    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
        try {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (error) throw error;
          await loadProjects();
        } catch (err) {
          console.error(err);
          alert('Silme sırasında hata oluştu. Konsolu kontrol edin.');
        }
      });
    });

    // edit handlers placeholder (could open modal with prefilled values)
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        // load project and prefill form
        const { data: proj, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (error) return alert('Proje yüklenirken hata: ' + error.message);
        openProjectModal(proj);
      });
    });

  } catch (err) {
    console.error('Projeler yüklenirken hata:', err);
    const container = document.querySelector(projectsContainerSelector);
    if (container) container.innerHTML = '<div class="card"><em>Projeler yüklenemedi.</em></div>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
  });
}

// Modal handling
const modalSelector = '#projectModal';
const modalFormSelector = '#projectForm';

export function initAdminCrud() {
  const addBtn = document.getElementById('btnAddProject');
  if (addBtn) addBtn.addEventListener('click', () => openProjectModal());

  const modal = document.querySelector(modalSelector);
  if (!modal) return;

  modal.querySelector('.close-modal').addEventListener('click', () => {
    closeProjectModal();
  });

  const form = document.querySelector(modalFormSelector);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      category: formData.get('category'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(t=>t.trim()).filter(Boolean) : []
    };

    const id = formData.get('project_id');
    try {
      if (id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }
      closeProjectModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert('Proje kaydedilirken hata oluştu.');
    }
  });
}

export function openProjectModal(project = null) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return;
  const form = modal.querySelector(modalFormSelector);
  form.reset();
  form.querySelector('input[name="project_id"]').value = project ? project.id : '';
  form.querySelector('input[name="title"]').value = project ? project.title : '';
  form.querySelector('input[name="image_url"]').value = project ? project.image_url : '';
  form.querySelector('input[name="category"]').value = project ? project.category : '';
  form.querySelector('input[name="tags"]').value = project ? (project.tags || []).join(', ') : '';
  form.querySelector('textarea[name="description"]').value = project ? project.description : '';
  modal.style.display = 'block';
}

export function closeProjectModal() {
  const modal = document.querySelector(modalSelector);
  if (modal) modal.style.display = 'none';
}

// If loaded directly (not just imported)
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // expose for console
    window.adminLoadProjects = loadProjects;
    window.adminOpenProjectModal = openProjectModal;
    window.adminCloseProjectModal = closeProjectModal;

    loadProjects();
    initAdminCrud();
  });
}
