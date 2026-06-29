// ConnectHub carousel interactions

document.addEventListener('DOMContentLoaded', function () {
    var myCarouselEl = document.getElementById('carouselExampleCaptions');
    if (!myCarouselEl) return;

    var carousel = bootstrap.Carousel.getOrCreateInstance(myCarouselEl, {
        interval: false,
        ride: false
    });

    // Wire up every "Next" button inside slides to advance the carousel
    var nextButtons = myCarouselEl.querySelectorAll('.next-btn');
    nextButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            carousel.next();
        });
    });
});