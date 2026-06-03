// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Simple review carousel dots (click to scroll)
const dots = document.querySelectorAll('.dot');
const reviewCards = document.querySelectorAll('.review-card');

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        // On mobile, scroll to the corresponding review
        if (window.innerWidth <= 768 && reviewCards[index]) {
            reviewCards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});
