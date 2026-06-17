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

// Apply to service items, build cards, platform badges, and info cards
document.querySelectorAll('.service-item, .build-card, .info-card, .platform-badge').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
