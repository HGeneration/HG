window.HELP_IMPROVE_VIDEOJS = false;

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function syncCarouselVideos(carousels) {
    const allCarouselVideos = document.querySelectorAll('.results-carousel video');

    if (allCarouselVideos.length === 0) return;

    const pauseOtherVideos = currentVideo => {
        allCarouselVideos.forEach(video => {
            if (video !== currentVideo) {
                video.pause();
            }
        });
    };

    allCarouselVideos.forEach(video => {
        video.addEventListener('play', () => pauseOtherVideos(video));
    });

    if (!carousels || carousels.length === 0) return;

    carousels.forEach(carousel => {
        carousel.on('before:show', state => {
            allCarouselVideos.forEach(video => video.pause());

            const nextIndex = state && typeof state.next === 'number' ? state.next : null;
            const nextSlide = nextIndex !== null ? carousel.slides.find(slide => parseInt(slide.dataset.sliderIndex, 10) === nextIndex) : null;
            const nextVideo = nextSlide ? nextSlide.querySelector('video') : null;
            if (nextVideo) {
                nextVideo.currentTime = 0;
                nextVideo.play().catch(() => {});
            }
        });
    });
}

$(document).ready(function() {
    var videoCarouselOptions = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: false,
		pauseOnHover: true,
        breakpoints: [
            { changePoint: 480, slidesToShow: 1, slidesToScroll: 1 },
            { changePoint: 640, slidesToShow: 1, slidesToScroll: 1 },
            { changePoint: 768, slidesToShow: 1, slidesToScroll: 1 }
        ]
    };

    var videoCarousels = bulmaCarousel.attach('#video-results-carousel', videoCarouselOptions);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    syncCarouselVideos(videoCarousels);

})
