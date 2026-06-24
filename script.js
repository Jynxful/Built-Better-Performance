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

// Platform badge tap-to-expand on mobile
function initPlatformToggles() {
    const badges = document.querySelectorAll('.platform-badge');
    if (window.innerWidth <= 768) {
        badges.forEach(badge => {
            badge.addEventListener('click', () => {
                const isOpen = badge.classList.contains('open');
                badges.forEach(b => b.classList.remove('open'));
                if (!isOpen) badge.classList.add('open');
            });
        });
    }
}
initPlatformToggles();
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

// ===== LIGHTBOX ZOOM =====
let zoomScale = 1;
let zoomOriginX = 0;
let zoomOriginY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let translateX = 0;
let translateY = 0;

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function applyZoom() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
    lightboxImg.style.cursor = zoomScale > 1 ? 'grab' : 'default';
}

function resetZoom() {
    zoomScale = 1;
    translateX = 0;
    translateY = 0;
    lightboxImg.style.transition = 'transform 0.2s ease';
    applyZoom();
    setTimeout(() => lightboxImg.style.transition = '', 200);
}

// Reset zoom when changing slides
const _showSlide = showSlide;
showSlide = function(index) {
    resetZoom();
    _showSlide(index);
};

// Also reset on close
const _closeLightbox = closeLightbox;
closeLightbox = function() {
    resetZoom();
    _closeLightbox();
};

// Desktop: scroll to zoom
const lightboxImgWrap = document.querySelector('.lightbox-img-wrap');
lightboxImgWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    zoomScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomScale + delta));
    if (zoomScale === MIN_ZOOM) { translateX = 0; translateY = 0; }
    applyZoom();
}, { passive: false });

// Desktop: drag to pan when zoomed
lightboxImg.addEventListener('mousedown', (e) => {
    if (zoomScale <= 1) return;
    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    lightboxImg.style.cursor = 'grabbing';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyZoom();
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    lightboxImg.style.cursor = zoomScale > 1 ? 'grab' : 'default';
});

// Desktop: double-click to reset zoom
lightboxImg.addEventListener('dblclick', resetZoom);

// Mobile: pinch to zoom
let pinchStartDist = 0;
let pinchStartScale = 1;
let pinchMidX = 0;
let pinchMidY = 0;
let touchStartX = 0;
let touchStartY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let isTouchDragging = false;
let lastTapTime = 0;

lightboxImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        // Pinch start
        pinchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartScale = zoomScale;
        pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        e.preventDefault();
    } else if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX - translateX;
        touchStartY = e.touches[0].clientY - translateY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        isTouchDragging = false;

        // Double-tap to reset
        const now = Date.now();
        if (now - lastTapTime < 300) {
            resetZoom();
            lastTapTime = 0;
        } else {
            lastTapTime = now;
        }
    }
}, { passive: false });

lightboxImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        // Pinch zoom
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        zoomScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartScale * (dist / pinchStartDist)));
        if (zoomScale === MIN_ZOOM) { translateX = 0; translateY = 0; }
        applyZoom();
        e.preventDefault();
    } else if (e.touches.length === 1 && zoomScale > 1) {
        // Pan when zoomed
        isTouchDragging = true;
        translateX = e.touches[0].clientX - touchStartX;
        translateY = e.touches[0].clientY - touchStartY;
        applyZoom();
        e.preventDefault();
    }
}, { passive: false });

// ===== QUOTE FORM TOGGLE =====
const quoteToggle = document.getElementById('quoteToggle');
const quoteFormWrap = document.getElementById('quoteFormWrap');
if (quoteToggle && quoteFormWrap) {
    quoteToggle.addEventListener('click', () => {
        const isOpen = quoteFormWrap.classList.contains('open');
        quoteFormWrap.classList.toggle('open', !isOpen);
        quoteToggle.setAttribute('aria-expanded', String(!isOpen));
    });
}

// ===== QUOTE FORM =====
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fname   = document.getElementById('fname').value.trim();
        const lname   = document.getElementById('lname').value.trim();
        const email   = document.getElementById('email').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const year    = document.getElementById('year').value.trim();
        const make    = document.getElementById('make').value.trim();
        const model   = document.getElementById('model').value.trim();
        const service = document.getElementById('service').value;
        const details = document.getElementById('details').value.trim();

        const subject = encodeURIComponent(`Quote Request — ${year} ${make} ${model}`);
        const body = encodeURIComponent(
`Name: ${fname} ${lname}
Email: ${email}
Phone: ${phone || 'Not provided'}

Vehicle: ${year} ${make} ${model}
Service: ${service}

Details:
${details || 'None provided'}`
        );

        window.location.href = `mailto:builtbetterperformance@gmail.com?subject=${subject}&body=${body}`;

        // Show confirmation
        quoteForm.style.opacity = '0.4';
        quoteForm.style.pointerEvents = 'none';
        const msg = document.createElement('p');
        msg.className = 'form-success';
        msg.style.display = 'block';
        msg.textContent = "Opening your email app... we'll get back to you fast.";
        quoteForm.after(msg);

        setTimeout(() => {
            quoteForm.style.opacity = '1';
            quoteForm.style.pointerEvents = '';
            msg.remove();
        }, 4000);
    });
}
