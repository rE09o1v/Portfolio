const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contactForm');

const closeMobileMenu = () => {
  navMenu?.classList.remove('active');
  navToggle?.classList.remove('active');
};

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    const targetSection = document.querySelector(targetId);
    if (!targetSection) {
      return;
    }

    event.preventDefault();
    const offset = (header?.offsetHeight || 0) + 12;
    const top = targetSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle('scrolled', window.scrollY > 30);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

if (skillBars.length > 0) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const bar = entry.target;
        const level = bar.getAttribute('data-level') || '0%';
        bar.style.width = level;
        skillObserver.unobserve(bar);
      });
    },
    { threshold: 0.35 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = '0%';
    skillObserver.observe(bar);
  });
}

const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      alert('すべての項目を入力してください。');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('正しいメールアドレスを入力してください。');
      return;
    }

    console.log('contact payload', { name, email, message });
    alert('メッセージを受け取りました。ありがとうございます。');
    contactForm.reset();
  });
}

const sections = document.querySelectorAll('section[id]');
window.addEventListener(
  'scroll',
  () => {
    let currentId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY + (header?.offsetHeight || 0) + 28;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  },
  { passive: true }
);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
});
