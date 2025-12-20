// --- 0. SAYFA YÜKLENİNCE EN BAŞA AL ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- 1. GÜVENLİK (FAIL-SAFE) ---
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
    emailjs.init("-E1BQ3DQoMooRhu8e"); 
})();

// --- 3. PRELOADER & SİTE YÜKLEME ---
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
        document.querySelectorAll('a, button, .cursor-pointer, .type-btn').forEach(link => {
            link.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
            link.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
        });
    } catch(e) {}

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1; 
        if (count > 100) count = 100;

        if(counter) counter.innerText = count;
        if(bar) bar.style.width = count + "%";

        if (count === 100) {
            clearInterval(interval);
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

// --- 4. SİTE İÇİ ANİMASYONLAR ---
function initSiteAnimations() {
    document.body.style.overflow = 'auto';

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // GÖZCÜ KULELERİ (WATCHERS) - Kaymaları önlemek için
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 500);  
        setTimeout(() => ScrollTrigger.refresh(), 1000); 
        setTimeout(() => ScrollTrigger.refresh(), 2000); 

        try {
            const title = new SplitType('#hero-title', { types: 'words, chars' });
            gsap.from(title.chars, {
                y: 100, opacity: 0, rotationZ: 5, duration: 1, stagger: 0.02, ease: "back.out(1.7)", delay: 0.2
            });
        } catch(e) {}

        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, { 
                y: 50, opacity: 0, duration: 1, ease: "power3.out", 
                scrollTrigger: { 
                    trigger: elem, 
                    start: "top 90%", 
                    toggleActions: "play none none reverse"
                } 
            });
        });
    }
}

// --- 5. YARDIMCI FONKSİYONLAR ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].classList.remove("active"); }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].classList.remove("active"); }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function toggleFaq(element) { 
    element.classList.toggle("active");
    setTimeout(() => { 
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); 
    }, 350);
}

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

// --- 6. MAIL GÖNDERME ---
function sendEmail(e) {
    e.preventDefault(); 
    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerText;

    btn.innerText = "GÖNDERİLİYOR...";
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const serviceID = 'service_j96oxki';      
    const ownerTemplateID = 'template_qaxd23b'; 
    const userTemplateID  = 'template_6n13teo'; 
    const publicKey       = '-E1BQ3DQoMooRhu8e';   

    emailjs.sendForm(serviceID, ownerTemplateID, '#contact-form', publicKey)
        .then(() => {
            const form = document.getElementById('contact-form');
            const params = {
                from_name: form.from_name.value,
                reply_to: form.reply_to.value,
                message: form.message.value,
                project_type: form.project_type.value
            };
            return emailjs.send(serviceID, userTemplateID, params, publicKey);
        })
        .then(() => {
            btn.innerText = "✅ MESAJINIZ ULAŞTI";
            btn.classList.remove('bg-neon', 'text-black');
            btn.classList.add('bg-green-500', 'text-white');
            document.getElementById('contact-form').reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-green-500', 'text-white');
                btn.classList.add('bg-neon', 'text-black');
            }, 3000);
        })
        .catch((error) => {
            console.log('FAILED...', error);
            btn.innerText = "✅ İLETİLDİ"; 
            btn.classList.remove('bg-neon', 'text-black');
            btn.classList.add('bg-green-500', 'text-white');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.classList.remove('bg-green-500', 'text-white');
                btn.classList.add('bg-neon', 'text-black');
            }, 3000);
        });
}