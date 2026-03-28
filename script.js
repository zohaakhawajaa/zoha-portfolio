// Elements
const navbar = document.getElementById('navbar');
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileBtnIcon = document.querySelector('.mobile-menu-btn i');
const navLinks = document.querySelector('.nav-links');
const reveals = document.querySelectorAll('.reveal');

// 1. Navigation Scrolled State
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Mobile Menu Toggle
mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle icon
    if(navLinks.classList.contains('active')) {
        mobileBtnIcon.classList.remove('fa-bars');
        mobileBtnIcon.classList.add('fa-times');
    } else {
        mobileBtnIcon.classList.remove('fa-times');
        mobileBtnIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtnIcon.classList.remove('fa-times');
        mobileBtnIcon.classList.add('fa-bars');
    });
});

// Active link switching
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// 3. Scroll Reveal Animation
function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // init

// 4. Parallax effect on background blobs
const blobs = document.querySelectorAll('.blob');
window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// 5. 3D Tilt Effect for Project Cards
const cards = document.querySelectorAll('.project-item');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const tiltX = (y - 0.5) * 20; // max 10deg
        const tiltY = (x - 0.5) * -20; // max 10deg
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// 6. Scroll Progress Bar
const progressLine = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressLine.style.width = scrolled + "%";
});

// 7. Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
                item.classList.add('show');
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        });
    });
});

// 8. Staggered Hero Reveal & Text Scramble
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const phrases = [
    'AI Engineer',
    'Data Scientist',
    'ML Researcher',
    'Solution Architect'
];

const scrambleEl = document.getElementById('scramble-role');
if (scrambleEl) {
    const fx = new TextScramble(scrambleEl);
    let counter = 0;
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };
    next();
}

window.addEventListener('load', () => {
    const reveals = document.querySelectorAll('.reveal-init');
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, 150 * index);
    });
});

// 9. Immersive Mouse Effects (Flashlight & Parallax)
const flashlight = document.querySelector('.cursor-flashlight');
const maxiText = document.querySelector('.maxi-text');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    
    // Flashlight
    if (flashlight) {
        flashlight.style.left = `${clientX}px`;
        flashlight.style.top = `${clientY}px`;
    }
    
    // Maxi-Text Parallax
    if (maxiText) {
        const xPos = (clientX / window.innerWidth - 0.5) * 50;
        const yPos = (clientY / window.innerHeight - 0.5) * 50;
        maxiText.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
    }
});

// 10. Refined Magnetic Effects
const magneticElements = document.querySelectorAll('.magnetic, .name, .btn-primary, .btn-secondary, .logo');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const mx = e.clientX - left - width / 2;
        const my = e.clientY - top - height / 2;
        
        this.style.transform = `translate(${mx * 0.25}px, ${my * 0.25}px)`;
        this.style.transition = 'none';
        this.style.zIndex = '50';
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.transform = `translate(0px, 0px)`;
        this.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        this.style.zIndex = 'auto';
    });
});

// 11. Section Reveal Skew
const observerOptions = {
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => sectionObserver.observe(el));

// 9. Copy Email Functionality
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            const originalText = emailLink.innerText;
            emailLink.innerText = "Email Copied! ✅";
            setTimeout(() => {
                emailLink.innerText = originalText;
            }, 2000);
        });
    });
}
