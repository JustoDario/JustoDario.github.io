document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     CAROUSELS (snap + buttons)
  =============================== */
  function setupSnapCarousel({ viewport, items, prevBtn, nextBtn }) {
    if (!viewport || !items.length || !prevBtn || !nextBtn) return;

    let index = 0;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const scrollToIndex = (i) => {
      index = clamp(i, 0, items.length - 1);
      viewport.scrollTo({
        left: items[index].offsetLeft,
        behavior: 'smooth'
      });
      updateButtons();
    };

    const updateButtons = () => {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === items.length - 1;

      prevBtn.style.opacity = prevBtn.disabled ? '0.35' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.35' : '1';
    };

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(index + 1);
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(index - 1);
    });

    // Sync index if user scrolls manually
    let scrollTimeout = null;
    viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const current = viewport.scrollLeft;
        let closest = 0;
        let closestDist = Infinity;

        items.forEach((el, i) => {
          const d = Math.abs(el.offsetLeft - current);
          if (d < closestDist) {
            closestDist = d;
            closest = i;
          }
        });

        index = closest;
        updateButtons();
      }, 120);
    });

    updateButtons();
  }

  // Internal carousels
  document.querySelectorAll('.carousel-container').forEach(container => {
    const viewport = container.querySelector('.media-carousel');
    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if (!viewport || !track) return;
    const items = Array.from(track.children);

    setupSnapCarousel({ viewport, items, prevBtn, nextBtn });
  });

  // External carousels
  document.querySelectorAll('.section-slider-container').forEach(container => {
    const viewport = container.querySelector('.main-slider');
    const prevBtn = container.querySelector('.sec-prev');
    const nextBtn = container.querySelector('.sec-next');

    if (!viewport) return;
    const items = Array.from(viewport.querySelectorAll('.slider-item'));

    setupSnapCarousel({ viewport, items, prevBtn, nextBtn });
  });

  /* ===============================
     Smooth scroll navbar
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  /* ===============================
     Language Toggle (EN/ES)
  =============================== */
  const translations = {
    en: {
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.skills": "Skills",
      "nav.contact": "Contact",

      "hero.subtitle": "Robotics Engineering Student at URJC",
      "hero.tagline": "Passionate about robotics, programming and real world solutions",
      "hero.viewWork": "View My Work",
      "hero.cv": 'CV <i class="fas fa-download"></i>',

      "about.title": "About Me",
      "about.p1": "Hi, I’m Justo, a Robotics Software Engineering student passionate about building real robots and learning how autonomous systems work in practice. I’m always looking for hands-on opportunities involving mapping, perception, and robot control.",
      "about.p2": "Currently, I lead the SCARA project at RoboTech (URJC Student Association), and I’m also part of Técnico Solar Boat’s Autonomous Systems team, where I’m responsible for developing the mapping pipeline.",
      "about.p3": "This year, I’m drafting a publication-style project paper on reactive locomotion control for low-cost quadrupeds, based on my latest personal project: a servo-actuated quadruped “robot cat”.",
      "about.p4": "Outside robotics, I enjoy hands-on building, boxing, fishing, video games, creative 3D design, and international experiences (I’m currently on Erasmus in Lisbon and actively seeking Summer 2026 internships).",

      "experience.title": "Experience",
      "exp.scara.title": "RoboTech Student Association: Treasurer & SCARA Project Lead",
      "exp.scara.caption": "The SCARA Project aims to combine advanced control systems with AI-based decision making to enable our robot to play chess autonomously.",
      "exp.scara.btn": 'Visit RoboTech Website <i class="fas fa-arrow-up-right-from-square"></i>',

      "exp.tsb.title": "Técnico Solar Boat: Autonomous Systems Member — Mapping Responsible",
      "exp.tsb.caption": "Responsible for the mapping implementation within the autonomous navigation stack.",
      "exp.tsb.btn": 'Visit Técnico Solar Boat Website <i class="fas fa-arrow-up-right-from-square"></i>',

      "projects.title": "Projects",
      "proj.quad.title": "Quadruped Robot",
      "proj.quad.desc": "12-DOF servo-actuated quadruped robot developed in ROS 2.",

      "education.title": "Education",
      "education.uni": "Universidad Rey Juan Carlos (2023 - Present)",
      "education.desc": "Focus on control, software architecture and hardware-software integration.",

      "skills.title": "Skills & Technologies",

      "contact.title": "Contact",
      "contact.email": 'Send Email <i class="fas fa-paper-plane"></i>'
    },

    es: {
      "nav.about": "Sobre mí",
      "nav.experience": "Experiencia",
      "nav.projects": "Proyectos",
      "nav.skills": "Tecnologías",
      "nav.contact": "Contacto",

      "hero.subtitle": "Estudiante de Ingeniería Robótica en la URJC",
      "hero.tagline": "Apasionado por la robótica, la programación y las soluciones reales",
      "hero.viewWork": "Ver Proyectos",
      "hero.cv": 'CV <i class="fas fa-download"></i>',

      "about.title": "Sobre mí",
      "about.p1": "Hola, soy Justo, estudiante de Ingeniería Robótica (Software) y me encanta construir robots reales y entender cómo funcionan los sistemas autónomos en la práctica. Siempre busco oportunidades hands-on relacionadas con mapping, percepción y control.",
      "about.p2": "Actualmente lidero el proyecto SCARA en RoboTech (Asociación estudiantil URJC), y también formo parte del equipo de Sistemas Autónomos de Técnico Solar Boat, donde soy responsable del desarrollo del pipeline de mapping.",
      "about.p3": "Este año estoy redactando un paper en formato publicación sobre control reactivo de locomoción para cuadrúpedos de bajo coste, basado en mi proyecto personal más reciente: un “robot gato” cuadrúpedo con servomotores.",
      "about.p4": "Fuera de la robótica, me gusta construir cosas, el boxeo, la pesca, los videojuegos, el diseño 3D creativo y las experiencias internacionales (ahora mismo estoy de Erasmus en Lisboa y buscando internships para el verano de 2026).",

      "experience.title": "Experiencia",
      "exp.scara.title": "RoboTech URJC: Tesorero & Líder del Proyecto SCARA",
      "exp.scara.caption": "El proyecto SCARA busca combinar control avanzado con toma de decisiones basada en IA para que el robot juegue al ajedrez de forma autónoma.",
      "exp.scara.btn": 'Visitar web de RoboTech <i class="fas fa-arrow-up-right-from-square"></i>',

      "exp.tsb.title": "Técnico Solar Boat: Sistemas Autónomos — Responsable de Mapping",
      "exp.tsb.caption": "Responsable de la implementación del mapping dentro del stack de navegación autónoma.",
      "exp.tsb.btn": 'Visitar web de Técnico Solar Boat <i class="fas fa-arrow-up-right-from-square"></i>',

      "projects.title": "Proyectos",
      "proj.quad.title": "Robot Cuadrúpedo",
      "proj.quad.desc": "Robot cuadrúpedo de 12 DOF con servos, desarrollado con ROS 2.",

      "education.title": "Educación",
      "education.uni": "Universidad Rey Juan Carlos (2023 - Actualidad)",
      "education.desc": "Enfoque en control, arquitectura software e integración hardware-software.",

      "skills.title": "Tecnologías y habilidades",

      "contact.title": "Contacto",
      "contact.email": 'Enviar correo <i class="fas fa-paper-plane"></i>'
    }
  };

  const langToggleBtn = document.getElementById('langToggle');

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = translations[lang]?.[key];
      if (value) el.innerHTML = value;
    });

    // Botón muestra el idioma al que cambias
    langToggleBtn.textContent = (lang === 'en') ? 'ES' : 'EN';
  }

  let currentLang = localStorage.getItem('portfolioLang') || 'en';
  applyLanguage(currentLang);

  langToggleBtn.addEventListener('click', () => {
    currentLang = (currentLang === 'en') ? 'es' : 'en';
    localStorage.setItem('portfolioLang', currentLang);
    applyLanguage(currentLang);
  });

});
