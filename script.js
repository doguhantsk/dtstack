// Clean and validated script.js
// --- 0. BASLANGIC ---
(function(){
    if (history && history.scrollRestoration) history.scrollRestoration = 'manual';
    try { window.scrollTo(0,0); } catch(e) {}

    // Fail-safe preloader hide
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (typeof initSiteAnimations === 'function') initSiteAnimations();
        }
    }, 4000);

    // EmailJS init (safe)
    try {
        if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
            emailjs.init('-E1BQ3DQoMooRhu8e');
        } else {
            window.addEventListener('load', () => {
                if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
                    emailjs.init('-E1BQ3DQoMooRhu8e');
                } else {
                    console.warn('emailjs not available after load');
                }
            });
        }
    } catch (err) {
        console.error('emailjs init error', err);
    }

    // Site load actions
    window.addEventListener('load', () => {
        const counter = document.getElementById('loader-text');
        const bar = document.getElementById('loader-bar');
        const preloader = document.getElementById('preloader');
        const cursor = document.getElementById('cursor');

        // cursor follow
        try {
            document.addEventListener('mousemove', (e) => {
                if (cursor) {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                }
            });
            document.querySelectorAll('a, button, .cursor-pointer, .type-btn, input, textarea').forEach(el => {
                el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovered'));
            });
        } catch(e) {}

        // fake loader
        let count = 0;
        const interval = setInterval(() => {
            count += Math.floor(Math.random()*10) + 1;
            if (count > 100) count = 100;
            if (counter) counter.innerText = count;
            if (bar) bar.style.width = count + '%';
            if (count === 100) {
                clearInterval(interval);
                if (typeof gsap !== 'undefined') {
                    try { gsap.to(preloader, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.2, onComplete: initSiteAnimations }); } catch(e) { if (preloader) preloader.style.display = 'none'; initSiteAnimations(); }
                } else {
                    if (preloader) preloader.style.display = 'none';
                    initSiteAnimations();
                }
            }
        }, 20);
    });

    // Animations helper
    window.initSiteAnimations = function() {
        document.body.style.overflow = 'auto';
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try { gsap.registerPlugin(ScrollTrigger); } catch(e) {}
            ScrollTrigger.refresh();
            setTimeout(() => ScrollTrigger.refresh(), 500);
            setTimeout(() => ScrollTrigger.refresh(), 1000);
            setTimeout(() => ScrollTrigger.refresh(), 2000);
            try {
                const title = new SplitType('#hero-title', { types: 'words, chars' });
                gsap.from(title.chars, { y: 100, opacity: 0, rotationZ: 5, duration: 1, stagger: 0.02, ease: 'back.out(1.7)', delay: 0.2 });
            } catch(e) {}
            try {
                gsap.utils.toArray('.reveal').forEach(elem => {
                    gsap.from(elem, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: elem, start: 'top 90%', toggleActions: 'play none none reverse' } });
                });
            } catch(e) {}
        }
    };

    // Interaction helpers
    window.openTab = function(evt, tabName) {
        const tabcontent = document.getElementsByClassName('tab-content');
        for (let i=0;i<tabcontent.length;i++) tabcontent[i].classList.remove('active');
        const tablinks = document.getElementsByClassName('tab-btn');
        for (let i=0;i<tablinks.length;i++) tablinks[i].classList.remove('active');
        const el = document.getElementById(tabName);
        if (el) el.classList.add('active');
        if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };

    window.toggleFaq = function(element) { element.classList.toggle('active'); setTimeout(() => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }, 350); };

    // Modal
    const modal = document.getElementById('project-modal');
    const frame = document.getElementById('project-frame');
    const titleModal = document.getElementById('modal-title');
    window.openProject = function(url,name){ if(frame) frame.src = url; if(titleModal) titleModal.innerText = name; if(modal) modal.classList.add('active'); document.body.style.overflow='hidden'; };
    window.closeProject = function(){ if(modal) modal.classList.remove('active'); setTimeout(()=>{ if(frame) frame.src=''; },800); document.body.style.overflow='auto'; };

    window.selectType = function(btn, value){ const input = document.getElementById('project_type_input'); if(input) input.value = value; const buttons = document.querySelectorAll('.type-btn'); buttons.forEach(b=>{ b.classList.remove('bg-neon','text-black','font-bold','border-neon'); b.classList.add('border-white/10','text-gray-400'); }); if(btn){ btn.classList.remove('border-white/10','text-gray-400'); btn.classList.add('bg-neon','text-black','font-bold','border-neon'); } };

    // Send email
    window.sendEmail = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        const btn = document.getElementById('submit-btn');
        const originalText = btn ? btn.innerText : 'GÖNDER';
        if (btn) { btn.innerText = 'GÖNDERİLİYOR...'; btn.disabled = true; btn.classList.add('opacity-50','cursor-not-allowed'); }

        const serviceID = 'service_j96oxki';
        const ownerTemplateID = 'template_qaxd23b';
        const publicKey = '-E1BQ3DQoMooRhu8e';

        const form = document.getElementById('contact-form');
        if (!form) { console.error('contact-form not found'); if(btn){ btn.innerText = originalText; btn.disabled = false; btn.classList.remove('opacity-50','cursor-not-allowed'); } return; }
        if (typeof emailjs === 'undefined' || typeof emailjs.sendForm !== 'function') { console.error('emailjs is not loaded'); if(btn){ btn.innerText = originalText; btn.disabled = false; btn.classList.remove('opacity-50','cursor-not-allowed'); } return; }

        emailjs.sendForm(serviceID, ownerTemplateID, form, publicKey)
            .then(result => {
                console.log('Email sent', result.status, result.text);
                if (btn) { btn.innerText = '✅ MESAJINIZ ULAŞTI'; btn.classList.remove('bg-neon','text-black'); btn.classList.add('bg-green-500','text-white'); }
                form.reset();
                setTimeout(()=>{ if(btn){ btn.innerText = originalText; btn.disabled = false; btn.classList.remove('opacity-50','cursor-not-allowed','bg-green-500','text-white'); btn.classList.add('bg-neon','text-black'); } }, 3000);
            })
            .catch(error => {
                console.error('Email send failed', error);
                if (btn) { btn.innerText = '❌ HATA OLUŞTU'; btn.classList.remove('bg-neon','text-black'); btn.classList.add('bg-red-600','text-white'); setTimeout(()=>{ if(btn){ btn.innerText = originalText; btn.disabled = false; btn.classList.remove('bg-red-600','text-white'); btn.classList.add('bg-neon','text-black'); } },4000); }
                alert('Mail Hatası: ' + (error && error.text ? error.text : JSON.stringify(error)));
            });
    };

})();