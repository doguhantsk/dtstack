document.addEventListener('DOMContentLoaded', function () {
	const nav = document.querySelector('nav');
	if (!nav) return;

	// Ensure there's a hamburger button (markup may be missing)
	let hamburger = nav.querySelector('.hamburger');
	if (!hamburger) {
		hamburger = document.createElement('button');
		hamburger.className = 'hamburger';
		hamburger.setAttribute('aria-label', 'Menü');
		hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
		const links = nav.querySelector('.nav-links');
		if (links) nav.insertBefore(hamburger, links);
		else nav.appendChild(hamburger);
	}

	// Create mobile overlay (if not present) and populate with nav links + CTA
	let overlay = document.querySelector('.mobile-nav-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.className = 'mobile-nav-overlay';

		const linksContainer = nav.querySelector('.nav-links');
		if (linksContainer) {
			const copy = linksContainer.cloneNode(true);
			// convert links to mobile style
			copy.querySelectorAll('a').forEach(a => {
				a.classList.add('mobile-link');
			});
			overlay.appendChild(copy);
		}

		// Clone CTA button if exists
		const cta = nav.querySelector('.btn-shiny');
		if (cta) {
			const ctaClone = cta.cloneNode(true);
			ctaClone.style.display = 'inline-block';
			ctaClone.style.marginTop = '20px';
			overlay.appendChild(ctaClone);
		}

		document.body.appendChild(overlay);
	}

	function openMenu() { overlay.classList.add('active'); hamburger.classList.add('active'); document.body.style.overflow = 'hidden'; }
	function closeMenu() { overlay.classList.remove('active'); hamburger.classList.remove('active'); document.body.style.overflow = ''; }

	hamburger.addEventListener('click', function () {
		if (overlay.classList.contains('active')) closeMenu(); else openMenu();
	});

	// Close when clicking outside links (overlay background)
	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) closeMenu();
	});

	// Close on link click
	overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
});
