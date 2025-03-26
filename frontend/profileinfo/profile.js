// Sample data structure for items (in a real app, this would come from a backend)
const itemsData = [
    {
        id: 1,
        title: "Abstract Landscape Painting",
        auction: "Modern Art Gallery Auction",
        image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        estimate: "$1,200 - $1,800",
        currentBid: "$950",
        status: "active",
        type: "Art",
        itemStatus: "Available",
        endTime: "2025-03-26T14:00:00Z",
        description: "A vibrant abstract landscape painting by a renowned contemporary artist."
    },
    {
        id: 2,
        title: "Vintage Rolex Watch",
        auction: "Luxury Timepieces Auction",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        estimate: "$8,000 - $12,000",
        currentBid: "$9,750",
        status: "completed",
        type: "Jewelry",
        itemStatus: "Sold",
        endTime: "2025-03-20T10:00:00Z",
        description: "A rare vintage Rolex watch from the 1970s in pristine condition."
    },
    // Add more items matching the HTML examples
    {
        id: 3,
        title: "Antique Farm Tools Set",
        auction: "Rural Collectibles Auction",
        image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        estimate: "$300 - $500",
        currentBid: "$420",
        status: "pending",
        type: "Collectibles",
        itemStatus: "Reserved",
        endTime: "2025-03-27T16:00:00Z",
        description: "A set of well-preserved 19th-century farm tools."
    },
    {
        id: 4,
        title: "Chinese Jade Vase",
        auction: "Asian Artifacts Auction",
        image: "https://images.unsplash.com/photo-1555037015-4585deb6d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        estimate: "$2,500 - $3,500",
        currentBid: "$3,100",
        status: "active",
        type: "Collectibles",
        itemStatus: "Available",
        endTime: "2025-03-28T12:00:00Z",
        description: "An intricately carved jade vase from the Qing dynasty."
    },
    {
        id: 5,
        title: "Signed First Edition Book",
        auction: "Literary Treasures Auction",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        estimate: "$800 - $1,200",
        currentBid: "$1,050",
        status: "completed",
        type: "Collectibles",
        itemStatus: "Sold",
        endTime: "2025-03-24T15:00:00Z",
        description: "A rare signed first edition of a classic novel."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const itemsGrid = document.querySelector('.items-grid');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const statusFilter = document.getElementById('status');
    const typeFilter = document.getElementById('type');
    const itemStatusFilter = document.getElementById('item-status');
    const sortFilter = document.getElementById('sort');
    const perPageSelect = document.querySelector('.per-page select');
    const pagination = document.querySelector('.pagination');
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    let currentPage = 1;
    let itemsPerPage = parseInt(perPageSelect.value);

    // Initial render
    renderItems();

    // Event listeners
    searchButton.addEventListener('click', () => filterAndRender());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterAndRender();
    });
    statusFilter.addEventListener('change', () => filterAndRender());
    typeFilter.addEventListener('change', () => filterAndRender());
    itemStatusFilter.addEventListener('change', () => filterAndRender());
    sortFilter.addEventListener('change', () => filterAndRender());
    perPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(perPageSelect.value);
        currentPage = 1;
        filterAndRender();
    });
    pagination.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const page = parseInt(e.target.textContent);
            if (!isNaN(page)) {
                currentPage = page;
                filterAndRender();
            } else if (e.target.querySelector('.fa-chevron-right')) {
                currentPage++;
                filterAndRender();
            }
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    function filterAndRender() {
        let filteredItems = [...itemsData];

        // Apply search
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredItems = filteredItems.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.auction.toLowerCase().includes(searchTerm)
            );
        }

        // Apply filters
        const status = statusFilter.value !== "Select Status" ? statusFilter.value.toLowerCase() : null;
        const type = typeFilter.value !== "Select Type" ? typeFilter.value : null;
        const itemStatus = itemStatusFilter.value !== "Select Item Status" ? itemStatusFilter.value.toLowerCase() : null;

        if (status) filteredItems = filteredItems.filter(item => item.status === status);
        if (type) filteredItems = filteredItems.filter(item => item.type === type);
        if (itemStatus) filteredItems = filteredItems.filter(item => item.itemStatus.toLowerCase() === itemStatus);

        // Apply sort
        switch (sortFilter.value) {
            case 'Ending Soonest':
                filteredItems.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
                break;
            case 'Newest First':
                filteredItems.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
                break;
            case 'Highest Bid':
                filteredItems.sort((a, b) => parseFloat(b.currentBid.replace(/[^0-9.-]+/g,"")) - parseFloat(a.currentBid.replace(/[^0-9.-]+/g,"")));
                break;
            case 'Lowest Bid':
                filteredItems.sort((a, b) => parseFloat(a.currentBid.replace(/[^0-9.-]+/g,"")) - parseFloat(b.currentBid.replace(/[^0-9.-]+/g,"")));
                break;
        }

        renderItems(filteredItems);
    }

    function renderItems(items = itemsData) {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);

        itemsGrid.innerHTML = paginatedItems.length ? 
            paginatedItems.map(item => `
                <div class="item-card" data-id="${item.id}">
                    <div class="item-image" style="background-image: url('${item.image}');">
                        <span class="badge ${item.status}">${item.status === 'completed' && item.currentBid === itemsData.find(i => i.id === item.id).currentBid ? 'Won' : item.status === 'completed' ? 'Ended' : item.status === 'active' && parseFloat(item.currentBid.replace(/[^0-9.-]+/g,"")) > 0 ? 'Outbid' : item.status}"></span>
                    </div>
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p class="auction-name">${item.auction}</p>
                        <div class="item-meta">
                            <div class="estimate">
                                <span>Estimate</span>
                                <strong>${item.estimate}</strong>
                            </div>
                            <div class="current-bid">
                                <span>${item.status === 'completed' ? 'Final Price' : 'Current Bid'}</span>
                                <strong>${item.currentBid}</strong>
                            </div>
                        </div>
                        <button class="${item.status === 'active' ? 'bid-button' : 'view-button'}">
                            ${item.status === 'active' ? 'Place Bid' : 'View Details'}
                        </button>
                        <div class="end-time">${formatEndTime(item.endTime)}</div>
                    </div>
                </div>
            `).join('') : 
            '<div class="no-items">No items match your criteria.</div>';

        updatePagination(items.length);
        addItemClickListeners();
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pagination.innerHTML = '';
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            pagination.innerHTML += `<button class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        }
        if (totalPages > 5) {
            pagination.innerHTML += '<button><i class="fas fa-chevron-right"></i></button>';
        }
        document.querySelector('.results-header p').textContent = `${Math.min(itemsPerPage, totalItems)} / ${totalItems} Results for "My Items"`;
    }

    function addItemClickListeners() {
        document.querySelectorAll('.item-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.item-card').dataset.id);
                const item = itemsData.find(i => i.id === itemId);
                showModal(item);
            });
        });
    }

    function showModal(item) {
        modalBody.innerHTML = `
            <div class="modal-image" style="background-image: url('${item.image}')"></div>
            <div class="modal-details">
                <h2>${item.title}</h2>
                <p class="auction-name">${item.auction}</p>
                <div class="modal-meta">
                    <div class="modal-meta-item">
                        <span>Estimate</span>
                        <strong>${item.estimate}</strong>
                    </div>
                    <div class="modal-meta-item">
                        <span>${item.status === 'completed' ? 'Final Price' : 'Current Bid'}</span>
                        <strong>${item.currentBid}</strong>
                    </div>
                    <div class="modal-meta-item">
                        <span>Status</span>
                        <strong>${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</strong>
                    </div>
                    <div class="modal-meta-item">
                        <span>End Time</span>
                        <strong>${formatEndTime(item.endTime)}</strong>
                    </div>
                </div>
                <div class="modal-description">
                    <h3>Description</h3>
                    <p>${item.description}</p>
                </div>
                ${item.status === 'active' ? `
                    <form class="bid-form">
                        <label for="bid-amount">Place Your Bid</label>
                        <input type="number" id="bid-amount" min="${parseFloat(item.currentBid.replace(/[^0-9.-]+/g,"")) + 50}" placeholder="Enter bid amount" required>
                        <p class="bid-note">Minimum bid: $${parseFloat(item.currentBid.replace(/[^0-9.-]+/g,"")) + 50}</p>
                        <button type="submit" class="bid-button">Submit Bid</button>
                    </form>
                ` : ''}
            </div>
        `;

        if (item.status === 'active') {
            const bidForm = modalBody.querySelector('.bid-form');
            bidForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const bidAmount = bidForm.querySelector('#bid-amount').value;
                placeBid(item.id, bidAmount);
                modal.style.display = 'none';
            });
        }

        modal.style.display = 'block';
    }

    function placeBid(itemId, amount) {
        const item = itemsData.find(i => i.id === itemId);
        item.currentBid = `$${parseFloat(amount).toLocaleString()}`;
        filterAndRender();
        alert(`Bid of $${amount} placed successfully on ${item.title}!`);
    }

    function formatEndTime(endTime) {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        
        if (diff <= 0) return 'Auction Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `Ends in ${days}d ${hours}h ${minutes}m`;
    }
});