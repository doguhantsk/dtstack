document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Menü');
  toggle.innerHTML = '\u2630'; // hamburger
  // insert toggle after logo
  const logo = nav.querySelector('.logo');
  if (logo && logo.parentNode === nav) {
    nav.insertBefore(toggle, logo.nextSibling);
  } else {
    nav.insertBefore(toggle, nav.firstChild);
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    // prevent body scroll when menu open
    if (nav.classList.contains('open')) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });

  // close menu on link click
  const links = nav.querySelectorAll('.nav-links a');
  links.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }));
});
