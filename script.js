const video = document.getElementById('mansionVideo');
video.controls = false;
video.removeAttribute('controls');
const sections = document.querySelectorAll('.section');
const contactSection = document.getElementById('contactSection');
const progressItems = document.querySelectorAll('.progress-item');

let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
let videoDuration = 10;

function updateVideo() {
    const scrollTop = window.scrollY;
    const progress = scrollTop / scrollHeight;
    const currentTime = progress * videoDuration;

    if (!isNaN(video.duration) && video.duration > 0) {
        video.currentTime = Math.min(currentTime, video.duration);
    }
    // subtle zoom
    if (progress > 0.1 && progress < 0.9) {
        video.classList.add('scale');
    } else {
        video.classList.remove('scale');
    }
}

function updateUI() {
    const scrollTop = window.scrollY;
    const scrollProgress = scrollTop / scrollHeight;

    // Include contact section in the sections list for visibility
    const allSections = [...sections, contactSection];

    allSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        if (isVisible) section.classList.add('visible');
        else section.classList.remove('visible');

        const content = section.querySelector('.section-content') || section.querySelector('.contact-container');
        if (content) {
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            const parallax = center * -0.04;
            content.style.transform = `translateY(${parallax}px)`;
        }
    });

    let activeIndex = Math.floor(scrollProgress * 6);
    activeIndex = Math.max(0, Math.min(5, activeIndex));
    progressItems.forEach((item, index) => {
        if (index === activeIndex) item.classList.add('active');
        else item.classList.remove('active');
    });
}

function onScroll() {
    updateVideo();
    updateUI();
}

video.addEventListener('loadedmetadata', () => {
    videoDuration = video.duration || 10;
});

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
    scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    onScroll();
});

window.addEventListener('load', onScroll);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});