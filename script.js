// --- 0. BAŞLANGIÇ AYARLARI ---
// Sayfayı yenileyince en tepeye al (Tarayıcı hafızasını sil)
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- 1. GÜVENLİK MODU (FAIL-SAFE) ---
// Eğer site 4 saniye içinde açılmazsa (internet yavaşsa), zorla aç.
setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if(preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
        if(typeof initSiteAnimations === 'function') initSiteAnimations();
    }
}, 4000);

// --- 2. EMAILJS BAŞLATMA ---
(function(){
    // Senin Public Key'in
    try {
        if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
            emailjs.init("-E1BQ3DQoMooRhu8e");
        } else {
            console.warn('emailjs not loaded yet. Will attempt to init on load.');
            window.addEventListener('load', () => {
                if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
                    emailjs.init("-E1BQ3DQoMooRhu8e");
                } else {
                    console.error('emailjs still not available after load.');
                }
            });
        }
    } catch (e) {
        console.error('emailjs init error', e);
    }
})();

// --- 3. SİTE YÜKLEME VE PRELOADER ---
// window.load: Tüm resimler ve CSS yüklendikten sonra çalışır.
window.addEventListener("load", () => {
    const counter = document.getElementById("loader-text");
    const bar = document.getElementById("loader-bar");
    const preloader = document.getElementById("preloader");
    const cursor = document.getElementById("cursor");

    // Cursor Takibi
    try {
        document.addEventListener('mousemove', (e) => {
            if(cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });
        document.querySelectorAll('a, button, .cursor-pointer, .type-btn, input, textarea').forEach(link => {
            link.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
            link.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
        });
    } catch(e) {}

    // Yükleme Sayacı
    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1; 
        if (count > 100) count = 100;

        if(counter) counter.innerText = count;
        if(bar) bar.style.width = count + "%";

        if (count === 100) {
            clearInterval(interval);
            // Animasyonla Perdeyi Kaldır
            if (typeof gsap !== 'undefined') {
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                    delay: 0.2,
                    onComplete: initSiteAnimations
                });
            } else {
                preloader.style.display = 'none';
                initSiteAnimations();
            }
        }
    }, 20);
});

// --- 4. ANİMASYONLARI BAŞLAT ---
function initSiteAnimations() {
    document.body.style.overflow = 'auto'; // Scroll kilidini aç

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- 🚨 KRİTİK BÖLÜM: GÖZCÜ KULELERİ (WATCHERS) 🚨 ---
        // Tailwind CSS geç yüklense bile, bu kodlar yerleşimleri
        // 0.5, 1 ve 2. saniyede tekrar hesaplayıp düzeltir.
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 500);  
        setTimeout(() => ScrollTrigger.refresh(), 1000); 
        setTimeout(() => ScrollTrigger.refresh(), 2000); 

        // Başlık Animasyonu
        try {
            const title = new SplitType('#hero-title', { types: 'words, chars' });
            gsap.from(title.chars, {
                y: 100, opacity: 0, rotationZ: 5, duration: 1, stagger: 0.02, ease: "back.out(1.7)", delay: 0.2
            });
        } catch(e) {}

        // Reveal (Yukarı Kayarak Gelme) Animasyonları
        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, { 
                y: 50, opacity: 0, duration: 1, ease: "power3.out", 
                scrollTrigger: { 
                    trigger: elem, 
                    start: "top 90%", // Tetiklenme noktası
                    toggleActions: "play none none reverse"
                } 
            });
        });
    }
}

// --- 5. ETKİLEŞİM FONKSİYONLARI ---

// Tab (Sekme) Değiştirme
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].classList.remove("active"); }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].classList.remove("active"); }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    // Tab değişince boy değişir, hesabı yenile
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

// SSS (Accordion) Açma
function toggleFaq(element) { 
    element.classList.toggle("active");
    setTimeout(() => { 
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); 
    }, 350);
}

// Proje Modalı
const modal = document.getElementById('project-modal');
const frame = document.getElementById('project-frame');
const titleModal = document.getElementById('modal-title');

function openProject(url, name) {
    frame.src = url;
    if(titleModal) titleModal.innerText = name;
    if(modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProject() {
    if(modal) modal.classList.remove('active');
    setTimeout(() => { if(frame) frame.src = ''; }, 800);
    document.body.style.overflow = 'auto';
}

// Formdaki Proje Türü Seçimi
function selectType(btn, value) {
    const input = document.getElementById('project_type_input');
    if(input) input.value = value;
    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(b => {
        b.classList.remove('bg-neon', 'text-black', 'font-bold', 'border-neon');
        b.classList.add('border-white/10', 'text-gray-400');
    });
    btn.classList.remove('border-white/10', 'text-gray-400');
    btn.classList.add('bg-neon', 'text-black', 'font-bold', 'border-neon');
}

// --- 6. MAIL GÖNDERME (ÇİFT YÖNLÜ) ---
function sendEmail(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const originalText = btn ? btn.innerText : '';

    if (btn) {
        btn.innerText = "GÖNDERİLİYOR...";
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // SENİN ID BİLGİLERİN (Hepsini Kontrol Ettim)
    const serviceID = 'service_j96oxki';      
    const ownerTemplateID = 'template_qaxd23b'; // Sana gelen
    const userTemplateID  = 'template_6n13teo'; // Müşteriye giden (Auto-Reply)
    const publicKey       = '-E1BQ3DQoMooRhu8e';   

    const form = document.getElementById('contact-form');
    if (!form) {
        console.error('contact-form not found');
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        return;
    }

    if (typeof emailjs === 'undefined' || typeof emailjs.sendForm !== 'function') {
        console.error('emailjs is not loaded');
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        return;
    }

    const formData = new FormData(form);
    const params = {
        from_name: formData.get('from_name') || formData.get('name') || '',
        reply_to: formData.get('reply_to') || formData.get('email') || '',
        message: formData.get('message') || '',
        project_type: formData.get('project_type') || formData.get('project_type_input') || ''
    };

    // 1. Önce SANA mail at (form element verisiyle)
    emailjs.sendForm(serviceID, ownerTemplateID, form, publicKey)
        .then(() => {
            // 2. Sonra MÜŞTERİYE mail at
            return emailjs.send(serviceID, userTemplateID, params, publicKey);
        })
        .then(() => {
            // BAŞARILI
            if (btn) {
                btn.innerText = "✅ MESAJINIZ ULAŞTI";
                btn.classList.remove('bg-neon', 'text-black');
                btn.classList.add('bg-green-500', 'text-white');
            }
            form.reset();
            
            setTimeout(() => {
                if (btn) {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-green-500', 'text-white');
                    btn.classList.add('bg-neon', 'text-black');
                }
            }, 3000);
        })
    .catch((error) => {
    console.log('FAILED...', error); // Tarayıcı konsoluna hatayı yazar
    if (btn) {
        btn.innerText = "❌ HATA OLUŞTU"; // Kullanıcıya hatayı göster
        btn.classList.remove('bg-neon', 'text-black');
        btn.classList.add('bg-red-500', 'text-white'); // Kırmızı renk yap
        
        // 3 saniye sonra butonu eski haline getir
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.remove('bg-red-500', 'text-white');
            btn.classList.add('bg-neon', 'text-black');
        }, 3000);
    }
    alert("Hata Detayı: " + JSON.stringify(error)); // Telefondan deniyorsanız hatayı ekrana basar
});
}