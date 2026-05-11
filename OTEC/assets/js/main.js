/* ===================================
   ANACAP SPA - main.js
   Funcionalidades del sitio público
   =================================== */

// ── 1. Header: scroll → efecto glass ──────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ── 2. Menú móvil ─────────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu       = document.getElementById('navMenu');

mobileMenuBtn?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Cerrar menú al hacer clic en un link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// ── 3. Nav link activo según sección visible ───────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

// ── 4. Animación de entrada con IntersectionObserver ───────────────
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(
    '.feature-card, .curso-card, .convenio-card, .why-item, .stat'
).forEach(el => {
    el.classList.add('fade-in-element');
    animateOnScroll.observe(el);
});

// ── 5. Formulario de agendamiento ─────────────────────────────────
const agendarForm = document.getElementById('agendarForm');

agendarForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = agendarForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled  = true;

    // Simula petición (aquí irá el fetch al backend PHP)
    await delay(1000);

    const nombre = agendarForm.querySelector('[name="nombre"]')?.value || '';
    const fecha  = agendarForm.querySelector('[name="fecha"]')?.value  || '';
    const hora   = agendarForm.querySelector('[name="hora"]')?.value   || '';

    showToast(
        `✅ ¡Cita agendada! ${nombre}, te esperamos el ${formatDate(fecha)} a las ${hora} hrs.`,
        'success'
    );

    btn.innerHTML = originalText;
    btn.disabled  = false;
    agendarForm.reset();
});

// ── 6. Formulario de contacto ─────────────────────────────────────
const contactoForm = document.getElementById('contactoForm');

contactoForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactoForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled  = true;

    await delay(1000);

    showToast('✅ Mensaje enviado. Te responderemos a la brevedad.', 'success');
    btn.innerHTML = originalText;
    btn.disabled  = false;
    contactoForm.reset();
});

// ── 7. Calendario de agendamiento interactivo ─────────────────────
const calendarEl = document.getElementById('calendarDays');
if (calendarEl) {
    buildCalendar();
}

function buildCalendar() {
    const now      = new Date();
    let currentYear  = now.getFullYear();
    let currentMonth = now.getMonth();

    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    const monthLabel  = document.getElementById('calendarMonth');
    const prevBtn     = document.getElementById('calPrev');
    const nextBtn     = document.getElementById('calNext');
    const horaSelect  = document.getElementById('hora');

    function render() {
        if (monthLabel) monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarEl.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        // Ajuste semana lunes = 0
        const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

        // Celdas vacías
        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('span');
            empty.className = 'cal-empty';
            calendarEl.appendChild(empty);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let d = 1; d <= totalDays; d++) {
            const cell = document.createElement('button');
            cell.type      = 'button';
            cell.textContent = d;
            cell.className   = 'cal-day';

            const cellDate = new Date(currentYear, currentMonth, d);
            const dayOfWeek = cellDate.getDay();

            if (cellDate < today || dayOfWeek === 0 || dayOfWeek === 6) {
                cell.disabled  = true;
                cell.classList.add('disabled');
            } else {
                cell.addEventListener('click', () => {
                    calendarEl.querySelectorAll('.cal-day').forEach(b => b.classList.remove('selected'));
                    cell.classList.add('selected');
                    // Rellenar el input fecha oculto
                    const fechaInput = document.getElementById('fecha');
                    if (fechaInput) {
                        fechaInput.value = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                    }
                });
            }
            calendarEl.appendChild(cell);
        }
    }

    prevBtn?.addEventListener('click', () => {
        if (currentMonth === 0) { currentMonth = 11; currentYear--; }
        else currentMonth--;
        render();
    });
    nextBtn?.addEventListener('click', () => {
        if (currentMonth === 11) { currentMonth = 0; currentYear++; }
        else currentMonth++;
        render();
    });

    render();
}

// ── 8. Botones de horario en el panel de agenda ────────────────────
document.querySelectorAll('.time-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const horaInput = document.getElementById('hora');
        if (horaInput) horaInput.value = btn.dataset.hora;
    });
});

// ── Utilidades ─────────────────────────────────────────────────────
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
}

function showToast(message, type = 'info') {
    const existing = document.querySelector('.anacap-toast');
    existing?.remove();

    const toast = document.createElement('div');
    toast.className = `anacap-toast anacap-toast--${type}`;
    toast.innerHTML = message;

    Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '100px',
        right:        '30px',
        background:   type === 'success' ? '#1a3a2a' : '#1a2744',
        color:        '#fff',
        border:       `1.5px solid ${type === 'success' ? '#25d366' : '#d4af37'}`,
        borderRadius: '10px',
        padding:      '16px 24px',
        fontSize:      '0.95rem',
        fontFamily:   'Montserrat, sans-serif',
        fontWeight:   '600',
        zIndex:       '9999',
        maxWidth:     '360px',
        boxShadow:    '0 8px 24px rgba(0,0,0,0.5)',
        animation:    'slideInToast 0.35s ease',
        lineHeight:   '1.4',
    });

    document.body.appendChild(toast);

    // Añadir keyframe si no existe
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
          @keyframes slideInToast {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideOutToast {
            to { opacity: 0; transform: translateY(20px); }
          }
          .fade-in-element { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
          .fade-in-element.visible { opacity: 1; transform: none; }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.35s ease forwards';
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

// ── 9. Smooth scroll para links internos con offset del header ─────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')) || 80;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth',
        });
    });
});
