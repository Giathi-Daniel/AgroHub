// HERO SECTION SLIDER
const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    effect: "fade",
    autoplay: {
        delay: 5000,
    },
});

// PRODUCTS SECTION SLIDER 
var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        400: {
        slidesPerView: 2,
        spaceBetween: 3,
        },
        768: {
        slidesPerView: 3,
        spaceBetween: 4,
        },
        1024: {
        slidesPerView: 5,
        spaceBetween: 4,
        },
        1200: {
        slidesPerView: 6,
        spaceBetween: 6,
        },
    },
});