let selectedItemId = null;
let currentBid = 0;
let bidHistory = [];

// Mock data for items
const items = {
  1: { name: "Item 1", image: "item1.jpg", description: "This is item 1." },
  2: { name: "Item 2", image: "item2.jpg", description: "This is item 2." },
};

// Function to handle item selection
function selectItem(itemId) {
  selectedItemId = itemId;
  const item = items[itemId];

  // Update item details
  document.getElementById("item-image").src = item.image;
  document.getElementById("item-description").textContent = item.description;
  document.getElementById("current-bid").textContent = currentBid;

  // Show item details section
  document.getElementById("item-details").style.display = "block";

  // Update bid history
  updateBidHistory();
}

// Function to handle bid submission
document.getElementById("bid-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const bidAmount = parseFloat(document.getElementById("bid-amount").value);

  if (bidAmount > currentBid) {
    currentBid = bidAmount;
    bidHistory.push({ bidder: "You", amount: bidAmount });

    // Update current bid and bid history
    document.getElementById("current-bid").textContent = currentBid;
    updateBidHistory();
  } else {
    alert("Your bid must be higher than the current bid.");
  }
});

// Function to update bid history
function updateBidHistory() {
  const bidHistoryList = document.getElementById("bid-history");
  bidHistoryList.innerHTML = bidHistory
    .map((bid) => `<li>${bid.bidder}: $${bid.amount}</li>`)
    .join("");
}

// Function to simulate random bids
function simulateRandomBids() {
  const liveBidsList = document.getElementById("live-bids");
  const bidders = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  const itemsList = Object.values(items);

  setInterval(() => {
    const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
    const randomItem = itemsList[Math.floor(Math.random() * itemsList.length)];
    const randomBidAmount = Math.floor(Math.random() * 100) + 1;

    // Add the bid to the live bids list
    const bidEntry = document.createElement("li");
    bidEntry.textContent = `${randomBidder} bid $${randomBidAmount} on ${randomItem.name}`;
    liveBidsList.prepend(bidEntry);

    // Limit the number of displayed bids
    if (liveBidsList.children.length > 10) {
      liveBidsList.removeChild(liveBidsList.lastChild);
    }
  }, 5000); // Simulate a new bid every 5 seconds
}

// Start simulating random bids
simulateRandomBids();



document.addEventListener("DOMContentLoaded", function () {
  
  const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeStyle = document.getElementById("theme-style");

// Check local storage for saved theme
if (localStorage.getItem("theme") === "dark") {
  themeStyle.href = "../dark_mode.css";
  themeIcon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
}

themeToggle.addEventListener("click", function () {
  if (themeStyle.href.includes("../style.css")) {
      themeStyle.href = "../dark_mode.css";
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
  } else {
      themeStyle.href = "../style.css";
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon"); // Change to moon icon
  }
});



});
