// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Service accordion toggle
function toggleService(item) {
    const isActive = item.classList.contains('active');
    // Close all others
    document.querySelectorAll('.service-item').forEach(el => {
        el.classList.remove('active');
    });
    // Toggle clicked one
    if (!isActive) {
        item.classList.add('active');
    }
}

// Subtle navbar opacity on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.borderBottomColor = 'rgba(255,255,255,0.08)';
    } else {
        navbar.style.borderBottomColor = 'rgba(255,255,255,0.05)';
    }
});

// Fade in elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to vertically scrolled elements (not build cards in horizontal scroll)
document.querySelectorAll('.service-item, .info-card, .platform-badge').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Build cards use a horizontal scroll container — fade them in on load instead
document.querySelectorAll('.build-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 300 + i * 100);
});

// ===== LIGHTBOX =====
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxClose= document.getElementById('lightboxClose');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentGallery = [];
let currentIndex   = 0;

function openLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex   = index;
    showSlide(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showSlide(index) {
    lightboxImg.src = currentGallery[index];
    lightboxImg.alt = '';
    // Counter
    if (currentGallery.length > 1) {
        lightboxCounter.textContent = `${index + 1} / ${currentGallery.length}`;
    } else {
        lightboxCounter.textContent = '';
    }
    // Arrow visibility
    lightboxPrev.classList.toggle('hidden', currentGallery.length <= 1);
    lightboxNext.classList.toggle('hidden', currentGallery.length <= 1);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showSlide(currentIndex);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showSlide(currentIndex);
}

// Attach click handlers to build cards with galleries
document.querySelectorAll('.build-card[data-gallery]').forEach(card => {
    const gallery = JSON.parse(card.dataset.gallery);
    const imgWrap = card.querySelector('.build-img');
    if (imgWrap) {
        imgWrap.addEventListener('click', () => openLightbox(gallery, 0));
    }
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevSlide);
lightboxNext.addEventListener('click', nextSlide);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevSlide();
    if (e.key === 'ArrowRight')  nextSlide();
});
