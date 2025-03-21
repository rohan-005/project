let index = 0;
const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.querySelector(".carousel-controls button:first-child");
const nextBtn = document.querySelector(".carousel-controls button:last-child");

function showSlide() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % items.length;
    showSlide();
}

function prevSlide() {
    index = (index - 1 + items.length) % items.length;
    showSlide();
}

let autoSlide = setInterval(nextSlide, 2000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2000);
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
});
prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
});

if (items.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
}
