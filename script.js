// ===== ELEMENTS =====
const video = document.getElementById('mansionVideo');
const sections = document.querySelectorAll('.section');
const progressItems = document.querySelectorAll('.progress-item');
const contactSection = document.getElementById('contactSection');

// Total scrollable height
let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

// Video duration (after metadata loads)
let videoDuration = 10; // fallback

// Update the video time based on scroll
function updateVideo() {
    const scrollTop = window.scrollY;
    const progress = scrollTop / scrollHeight;
    const currentTime = progress * videoDuration;

    if (!isNaN(video.duration) && video.duration > 0) {
        video.currentTime = Math.min(currentTime, video.duration);
    }
}

// Update UI: sections visibility, progress indicator, parallax
function updateUI() {
    const scrollTop = window.scrollY;
    const scrollProgress = scrollTop / scrollHeight;

    // ---- Sections visibility ----
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        if (isVisible) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }

        // Parallax on section content
        const content = section.querySelector('.section-content');
        if (content) {
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            const parallax = center * -0.05;
            content.style.transform = `translateY(${parallax}px)`;
        }
    });

    // ---- Progress indicator ----
    let activeIndex = Math.floor(scrollProgress * 6);
    activeIndex = Math.max(0, Math.min(5, activeIndex));

    progressItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Contact slide activation with delay (only after reaching the very bottom)
let contactTimeout = null;
function updateContactSlide() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    // Only trigger when we are at the absolute bottom (with a 20px margin)
    if (scrollTop >= maxScroll - 20) {
        // set a timeout to add visible class after 700ms delay
        if (!contactTimeout) {
            contactTimeout = setTimeout(() => {
                contactSection.classList.add('visible');
            }, 700);
        }
    } else {
        // Clear timeout and remove visible class
        if (contactTimeout) {
            clearTimeout(contactTimeout);
            contactTimeout = null;
        }
        contactSection.classList.remove('visible');
    }
}

// Combined scroll handler
function onScroll() {
    updateVideo();
    updateUI();
    updateContactSlide();
}

// Handle video metadata to update duration
video.addEventListener('loadedmetadata', () => {
    videoDuration = video.duration || 10;
});

// Initial call
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
    scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    onScroll();
});

// Run on load
window.addEventListener('load', onScroll);

// Smooth scroll for CTA links (just a minimal enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});