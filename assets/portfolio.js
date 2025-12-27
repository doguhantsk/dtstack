import { supabase } from './supabase.js';

async function loadProjects() {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    const grid = document.querySelector('.portfolio-grid') || document.querySelector('.projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    data.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-img">${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fas fa-image"></i>'}</div>
        <div class="project-info">
          <span class="project-category">${p.category || ''}</span>
          <h3>${p.title}</h3>
          <p>${p.description || ''}</p>
          <a href="#" class="project-link">İncele <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Projeler yüklenirken hata:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjects);
} else {
  loadProjects();
}
