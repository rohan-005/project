document.addEventListener("DOMContentLoaded", function () {
    // Carousel Functionality
    let index = 0;
    const carousel = document.querySelector(".carousel");
    let beltItems = document.querySelectorAll(".carousel-item");

    function updateItems() {
        beltItems = document.querySelectorAll(".carousel-item");
        if (carousel) {
            carousel.style.width = `${beltItems.length * 100}%`; // Adjust carousel width dynamically
            beltItems.forEach(item => item.style.flex = "0 0 100%");
        }
    }

    function showSlide() {
        updateItems(); // Ensure new items are included
        if (carousel) {
            carousel.style.transition = "transform 0.5s ease-in-out";
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }
    }

    function nextSlide() {
        index = (index + 1) % beltItems.length; // Loop through images
        showSlide();
    }

    let autoSlide = setInterval(nextSlide, 3000); // Auto-slide every 3 seconds

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 3000);
    }

    // Initialize the first slide
    showSlide();

    // Live auction notifications update
    const notifications = document.getElementById("notifications");
    const liveUpdates = [
        "Bid placed on Item C",
        "New auction started for Item D",
        "Item E sold to highest bidder"
    ];

    setInterval(() => {
        if (notifications) {
            const newNotification = document.createElement("li");
            newNotification.textContent = liveUpdates[Math.floor(Math.random() * liveUpdates.length)];
            notifications.appendChild(newNotification);

            if (notifications.children.length > 5) {
                notifications.removeChild(notifications.firstChild);
            }
        }
    }, 5000);

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


    const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeStyle = document.getElementById("theme-style");

// Check local storage for saved theme
if (localStorage.getItem("theme") === "dark") {
    themeStyle.href = "dark_mode.css";
    themeIcon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
}

themeToggle.addEventListener("click", function () {
    if (themeStyle.href.includes("style.css")) {
        themeStyle.href = "dark_mode.css";
        localStorage.setItem("theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
    } else {
        themeStyle.href = "style.css";
        localStorage.setItem("theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon"); // Change to moon icon
    }
});



});
