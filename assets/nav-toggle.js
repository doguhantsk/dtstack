document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // 1. Hamburger Butonunu Bul veya Oluştur
  let toggleBtn = document.querySelector('.nav-toggle');
  
  // Eğer HTML'de yoksa (eski dosyalarda) oluştur
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.innerHTML = '☰'; 
    
    // Logodan sonraya ekle
    const logo = nav.querySelector('.logo');
    if (logo) {
        logo.after(toggleBtn);
    } else {
        nav.appendChild(toggleBtn);
    }
  }

  // 2. Overlay Menüsünü Oluştur (Sadece bir kez)
  let overlay = document.querySelector('.mobile-nav-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    
    // Nav linklerini kopyala
    const originalLinks = nav.querySelector('.nav-links');
    if (originalLinks) {
        // Linkleri NodeList'ten alıp döngüye sok
        originalLinks.querySelectorAll('a').forEach((link, index) => {
            const clone = link.cloneNode(true);
            clone.classList.add('mobile-link'); 
            clone.style.transitionDelay = `${index * 0.1}s`; // Her link sırayla gelsin
            overlay.appendChild(clone);
        });
    }

    // CTA Butonunu kopyala (İletişime Geç)
    const cta = nav.querySelector('.btn-shiny');
    if (cta) {
        const ctaClone = cta.cloneNode(true);
        ctaClone.classList.add('mobile-link');
        ctaClone.classList.add('btn-shiny');
        ctaClone.style.marginTop = '20px';
        ctaClone.style.display = 'inline-block';
        overlay.appendChild(ctaClone);
    }

    // Body'e ekle
    document.body.appendChild(overlay);
  }

  // 3. Açma / Kapama Fonksiyonları
  function toggleMenu() {
    const isActive = overlay.classList.contains('active');
    
    if (isActive) {
        overlay.classList.remove('active');
        toggleBtn.innerHTML = '☰'; 
        document.body.style.overflow = ''; 
    } else {
        overlay.classList.add('active');
        toggleBtn.innerHTML = '✕'; 
        document.body.style.overflow = 'hidden'; 
    }
  }

  // Event Listener
  toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation(); 
      toggleMenu();
  });

  // Linklere Tıklayınca Kapat
  overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', toggleMenu);
  });
  
  // Dışarı tıklayınca kapat
  overlay.addEventListener('click', function(e) {
      if(e.target === overlay) toggleMenu();
  });

});
