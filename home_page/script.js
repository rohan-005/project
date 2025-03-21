let index = 0;
const carousel = document.querySelector(".carousel");
const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.querySelector(".carousel-controls button:first-child");
const nextBtn = document.querySelector(".carousel-controls button:last-child");

// Function to show slide
function showSlide() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

// Function to move to the next slide
function nextSlide() {
    index = (index + 1) % items.length;
    showSlide();
}

// Function to move to the previous slide
function prevSlide() {
    index = (index - 1 + items.length) % items.length;
    showSlide();
}

// Auto slide every 3 seconds
let autoSlide = setInterval(nextSlide, 2000);

// Stop auto-slide on manual click and restart after inactivity
function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2000);
}

// Add event listeners for navigation buttons
nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
});
prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
});

// Hide navigation buttons if only one slide exists
if (items.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
}
