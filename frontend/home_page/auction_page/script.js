// Auction Data Model
const auctionData = {
  items: [
    {
      id: 1,
      title: "Vintage Camera",
      description: "Rare 1950s Leica camera in excellent working condition. Comes with original leather case.",
      startingPrice: 50,
      currentBid: 80,
      bids: [
        { bidder: "Alice", amount: 80, time: "12:05 PM" },
        { bidder: "Bob", amount: 75, time: "11:58 AM" }
      ]
    },
    {
      id: 2,
      title: "Antique Pocket Watch",
      description: "19th century Swiss pocket watch with gold casing. Fully functional and recently serviced.",
      startingPrice: 100,
      currentBid: 30,
      bids: [
        { bidder: "Eve", amount: 30, time: "10:30 AM" }
      ]
    },
    {
      id: 3,
      title: "Signed First Edition Book",
      description: "First edition of 'To Kill a Mockingbird' signed by Harper Lee. Excellent condition.",
      startingPrice: 200,
      currentBid: 0,
      bids: []
    }
  ],
  liveBids: [
    { bidder: "Alice", amount: 80, itemId: 1, time: "just now" },
    { bidder: "Eve", amount: 30, itemId: 2, time: "2 min ago" }
  ],
  selectedItemId: null,
  auctionEndTime: null,
  timerInterval: null,
  isAuctionEnded: false
};

// DOM Elements
const itemsGrid = document.getElementById('itemsGrid');
const bidsFeed = document.getElementById('bidsFeed');
const selectedItemTitle = document.getElementById('selectedItemTitle');
const selectedItemDescription = document.getElementById('selectedItemDescription');
const currentBidValue = document.getElementById('currentBidValue');
const bidHistoryTimeline = document.getElementById('bidHistoryTimeline');
const placeBidButton = document.getElementById('placeBidButton');
const bidInput = document.getElementById('your-bid');
const bidErrorMessage = document.getElementById('bidErrorMessage');
const timerDisplay = document.getElementById('timerDisplay');

// Initialize the auction interface
function initAuction() {
  renderItems();
  renderLiveBids();
  
  // Set first item as selected by default
  if (auctionData.items.length > 0) {
    selectItem(auctionData.items[0].id);
  }
  
  // Set up event listeners
  placeBidButton.addEventListener('click', handlePlaceBid);
  bidInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handlePlaceBid();
  });
  
  // Start the auction timer (30 seconds)
  startAuctionTimer(30);
  
  // Simulate new bids coming in (for demo purposes)
  setInterval(simulateNewBid, 5000);
}

// Start auction timer
function startAuctionTimer(seconds) {
  auctionData.auctionEndTime = Date.now() + seconds * 1000;
  auctionData.isAuctionEnded = false;
  
  // Clear existing timer if any
  if (auctionData.timerInterval) {
    clearInterval(auctionData.timerInterval);
  }
  
  // Update timer immediately
  updateTimerDisplay();
  
  // Set up timer interval
  auctionData.timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Update timer display
function updateTimerDisplay() {
  if (auctionData.isAuctionEnded) return;
  
  const now = Date.now();
  const remaining = auctionData.auctionEndTime - now;
  
  if (remaining <= 0) {
    endAuction();
    return;
  }
  
  const seconds = Math.floor(remaining / 1000);
  timerDisplay.textContent = `Time remaining: ${seconds}s`;
  timerDisplay.style.color = seconds <= 10 ? 'var(--error)' : 'var(--dark)';
  
  // Blink when 5 seconds or less
  if (seconds <= 5) {
    timerDisplay.style.animation = 'blink 1s infinite';
  } else {
    timerDisplay.style.animation = 'none';
  }
}

// End auction and announce winner
function endAuction() {
  clearInterval(auctionData.timerInterval);
  auctionData.isAuctionEnded = true;
  
  // Disable bidding
  placeBidButton.disabled = true;
  bidInput.disabled = true;
  
  // Find all items with bids
  const itemsWithBids = auctionData.items.filter(item => item.bids.length > 0);
  
  if (itemsWithBids.length === 0) {
    timerDisplay.textContent = "Auction ended - No winners";
    timerDisplay.style.color = 'var(--gray)';
    return;
  }
  
  // Sort items by current bid (descending)
  itemsWithBids.sort((a, b) => b.currentBid - a.currentBid);
  const winningItem = itemsWithBids[0];
  const winningBid = winningItem.bids[0];
  
  // Display winner
  timerDisplay.textContent = `Auction ended! Winner: ${winningBid.bidder} with $${winningBid.amount}`;
  timerDisplay.style.color = 'var(--success)';
  timerDisplay.style.fontWeight = 'bold';
  
  // Highlight winning item
  const winningItemElement = document.querySelector(`.item-card[data-item-id="${winningItem.id}"]`);
  if (winningItemElement) {
    winningItemElement.style.border = '2px solid var(--success)';
    winningItemElement.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.5)';
  }
  
  // Show celebration effect
  setTimeout(() => {
    timerDisplay.style.transform = 'scale(1.1)';
    timerDisplay.style.transition = 'all 0.3s';
  }, 1000);
}

// Render all available items
function renderItems() {
  itemsGrid.innerHTML = '';
  auctionData.items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = `item-card ${auctionData.selectedItemId === item.id ? 'selected' : ''}`;
    itemCard.dataset.itemId = item.id;
    itemCard.innerHTML = `
      <div class="item-checkbox">${auctionData.selectedItemId === item.id ? '✓' : ''}</div>
      <div class="item-content">
        <h3>${item.title}</h3>
        <p class="item-highlight">Current bid: $${item.currentBid || item.startingPrice}</p>
      </div>
    `;
    itemCard.addEventListener('click', () => selectItem(item.id));
    itemsGrid.appendChild(itemCard);
  });
}

// Render live bids feed
function renderLiveBids() {
  bidsFeed.innerHTML = '';
  auctionData.liveBids.forEach(bid => {
    const item = auctionData.items.find(i => i.id === bid.itemId);
    const bidElement = document.createElement('div');
    bidElement.className = 'bid-notification';
    bidElement.innerHTML = `
      <span class="bidder">${bid.bidder}</span> bid 
      <span class="bid-amount">$${bid.amount}</span> on 
      <span class="bid-item">${item?.title || 'Item'}</span>
      <span class="bid-time">${bid.time}</span>
    `;
    bidsFeed.prepend(bidElement); // Newest bids at the top
  });
}

// Select an item to view details
function selectItem(itemId) {
  if (auctionData.isAuctionEnded) return;
  
  auctionData.selectedItemId = itemId;
  const item = auctionData.items.find(i => i.id === itemId);
  
  // Update UI
  selectedItemTitle.textContent = item.title;
  selectedItemDescription.textContent = item.description;
  currentBidValue.textContent = `$${item.currentBid || item.startingPrice}`;
  
  // Update min bid amount
  bidInput.min = (item.currentBid || item.startingPrice) + 1;
  bidInput.placeholder = `Enter $${(item.currentBid || item.startingPrice) + 1} or more`;
  
  // Render bid history
  renderBidHistory(item.bids);
  
  // Update items grid to show selected item
  renderItems();
}

// Render bid history for selected item
function renderBidHistory(bids) {
  bidHistoryTimeline.innerHTML = '';
  
  if (bids.length === 0) {
    bidHistoryTimeline.innerHTML = '<p>No bids yet. Be the first to bid!</p>';
    return;
  }
  
  bids.forEach(bid => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <span class="history-bidder">${bid.bidder}</span>
      <span class="history-amount">$${bid.amount}</span>
      <span class="history-time">${bid.time}</span>
    `;
    bidHistoryTimeline.appendChild(historyItem);
  });
}

// Handle placing a new bid
function handlePlaceBid() {
  if (auctionData.isAuctionEnded) {
    showBidError("Auction has ended - no more bids accepted");
    return;
  }
  
  if (!auctionData.selectedItemId) {
    showBidError("Please select an item first");
    return;
  }
  
  const bidAmount = parseFloat(bidInput.value);
  const item = auctionData.items.find(i => i.id === auctionData.selectedItemId);
  const minBid = (item.currentBid || item.startingPrice) + 1;
  
  if (!bidAmount || isNaN(bidAmount)) {
    showBidError("Please enter a valid bid amount");
    return;
  }
  
  if (bidAmount < minBid) {
    showBidError(`Bid must be at least $${minBid}`);
    return;
  }
  
  // Create new bid
  const newBid = {
    bidder: "You",
    amount: bidAmount,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  // Update item data
  item.currentBid = bidAmount;
  item.bids.unshift(newBid);
  
  // Add to live bids
  const liveBid = {
    bidder: "You",
    amount: bidAmount,
    itemId: item.id,
    time: "just now"
  };
  auctionData.liveBids.unshift(liveBid);
  
  // Update UI
  currentBidValue.textContent = `$${bidAmount}`;
  renderBidHistory(item.bids);
  renderLiveBids();
  renderItems();
  
  // Reset form
  bidInput.value = '';
  bidInput.min = bidAmount + 1;
  bidInput.placeholder = `Enter $${bidAmount + 1} or more`;
  bidErrorMessage.textContent = '';
  
  // Show success feedback
  placeBidButton.textContent = "Bid Placed!";
  placeBidButton.style.backgroundColor = "var(--success)";
  setTimeout(() => {
    placeBidButton.textContent = "Place Bid";
    placeBidButton.style.backgroundColor = "var(--primary)";
  }, 2000);
}

// Show bid error message
function showBidError(message) {
  bidErrorMessage.textContent = message;
  bidErrorMessage.style.color = "var(--error)";
  setTimeout(() => {
    bidErrorMessage.textContent = '';
  }, 3000);
}

// Simulate new bids coming in (for demo)
function simulateNewBid() {
  if (auctionData.isAuctionEnded) return;
  if (Math.random() > 0.7) { // 30% chance of new bid
    const availableItems = auctionData.items.filter(item => 
      item.id !== auctionData.selectedItemId && item.currentBid < 500
    );
    
    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      const newBidAmount = randomItem.currentBid + Math.floor(Math.random() * 20) + 5;
      
      const newBid = {
        bidder: ["Alice", "Bob", "Charlie", "Dana", "Eve"][Math.floor(Math.random() * 5)],
        amount: newBidAmount,
        itemId: randomItem.id,
        time: `${Math.floor(Math.random() * 5) + 1} min ago`
      };
      
      // Update data
      randomItem.currentBid = newBidAmount;
      randomItem.bids.unshift({
        bidder: newBid.bidder,
        amount: newBid.amount,
        time: newBid.time
      });
      
      auctionData.liveBids.unshift(newBid);
      
      // Update UI if needed
      if (randomItem.id === auctionData.selectedItemId) {
        currentBidValue.textContent = `$${newBidAmount}`;
        renderBidHistory(randomItem.bids);
      }
      
      renderLiveBids();
      renderItems();
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuction);