document.addEventListener("DOMContentLoaded", function () {
    // Carousel Functionality
    let index = 0;
    const carousel = document.querySelector(".carousel");
    const belt_items = document.querySelectorAll(".carousel-item");
    const prevBtn = document.querySelector(".carousel-controls button:first-child");
    const nextBtn = document.querySelector(".carousel-controls button:last-child");

    function showSlide() {
        if (carousel) {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }
    }

    function nextSlide() {
        index = (index + 1) % belt_items.length;
        showSlide();
    }

    function prevSlide() {
        index = (index - 1 + belt_items.length) % belt_items.length;
        showSlide();
    }

    let autoSlide = setInterval(nextSlide, 2000);

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 2000);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoSlide();
        });

        if (belt_items.length <= 1) {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        }
    }

    // Leaderboard Functionality
    const itemsList = ["Vintage Clock", "Antique Vase", "Rare Coin", "Signed Jersey", "Painting", "Jewelry Set", "Collector's Watch"];
    
    function generateRandomBid() {
        const item = itemsList[Math.floor(Math.random() * itemsList.length)];
        const user = "User" + Math.floor(Math.random() * 1000);
        const time = new Date().toLocaleTimeString();
        const bidAmount = "$" + (Math.floor(Math.random() * 1000) + 100);
        const multiplier = (Math.random() * 5).toFixed(2) + "x";
        const finalPrice = (Math.random() > 0.5 ? "" : "-") + "$" + (Math.floor(Math.random() * 5000) + 500);
        return { item, user, time, bidAmount, multiplier, finalPrice };
    }

    function updateBids(sectionId) {
        const tbody = document.getElementById(sectionId);
        if (!tbody) return;
        tbody.innerHTML = "";
        for (let i = 0; i < 5 + Math.floor(Math.random() * 3); i++) {
            const bid = generateRandomBid();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bid.item}</td>
                <td>${bid.user}</td>
                <td>${bid.time}</td>
                <td>${bid.bidAmount}</td>
                <td>${bid.multiplier}</td>
                <td class="${bid.finalPrice.startsWith('-') ? 'negative' : 'positive'}">${bid.finalPrice}</td>
            `;
            tbody.appendChild(row);
        }
    }

    function showBids(type) {
        const liveBids = document.getElementById("live-bids");
        const completedBids = document.getElementById("completed-bids");
        const liveTab = document.getElementById("live-bids-tab");
        const completedTab = document.getElementById("completed-bids-tab");

        if (!liveBids || !completedBids || !liveTab || !completedTab) return;

        if (type === "live") {
            liveBids.classList.remove("hidden");
            completedBids.classList.add("hidden");
            liveTab.classList.add("active");
            completedTab.classList.remove("active");
        } else {
            completedBids.classList.remove("hidden");
            liveBids.classList.add("hidden");
            completedTab.classList.add("active");
            liveTab.classList.remove("active");
        }
    }

    function refreshBids() {
        updateBids("live-bids");
        updateBids("completed-bids");
    }

    // Initialize leaderboard and tabs
    refreshBids();
    setInterval(refreshBids, 3000);

    // Ensure tab switching works
    document.getElementById("live-bids-tab")?.addEventListener("click", () => showBids("live"));
    document.getElementById("completed-bids-tab")?.addEventListener("click", () => showBids("completed"));
});
