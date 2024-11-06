let currentPage = 1;
const itemsPerPage = 12;
let filteredAndSortedProperties = [];

// Function to get the search query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to render property cards
function renderPropertyCards(properties) {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = ""; // Clear previous results

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProperties = properties.slice(start, end);

    if (paginatedProperties.length === 0) {
        propertyList.innerHTML = "<p>No matching properties found.</p>";
        return;
    }

    paginatedProperties.forEach(property => {
        const propertyElement = document.createElement('li');
        propertyElement.innerHTML = `
            <div class="property-card">
                <figure class="card-banner">
                    <a href="#">
                        <img src="${property.image}" alt="${property.name}" class="w-100">
                    </a>
                    <div class="card-badge ${property.status === 'forRent' ? 'green' : 
                                              property.status === 'forSale' ? 'blue' : 
                                              property.status === 'sold' ? 'red' : 
                                              property.status === 'PG Room' ? 'yellow' : ''}">
                    ${property.status === 'forRent' ? 'For Rent' :
                      property.status === 'forSale' ? 'For Sale' :
                      property.status === 'sold' ? 'Sold' :
                      property.status === 'PG Room' ? 'PG Room' : ''}
                    </div>
                    <div class="banner-actions">
                        <button class="banner-actions-btn">
                            <ion-icon name="location"></ion-icon>
                            <address>${property.location}</address>
                        </button>
                        <button class="banner-actions-btn">
                            <ion-icon name="camera"></ion-icon>
                            <span>4</span>
                        </button>
                        <button class="banner-actions-btn">
                            <ion-icon name="film"></ion-icon>
                            <span>2</span>
                        </button>
                    </div>
                </figure>
                <div class="card-content">
                    <div class="card-price">
                        <strong>$${property.price}</strong>${property.status === 'forRent' || property.status === 'PG Room' ? '/Month' : ''}
                    </div>
                    <h3 class="h3 card-title">
                        <a href="#">${property.name}</a>
                    </h3>
                    <p class="card-text">
                        ${property.description}
                    </p>
                    <ul class="card-list">
                        <li class="card-item">
                            <strong>${property.bedrooms}</strong>
                            <ion-icon name="bed-outline"></ion-icon>
                            <span>Bedrooms</span>
                        </li>
                        <li class="card-item">
                            <strong>${property.bathrooms}</strong>
                            <ion-icon name="man-outline"></ion-icon>
                            <span>Bathrooms</span>
                        </li>
                        <li class="card-item">
                            <strong>${property.area}</strong>
                            <ion-icon name="square-outline"></ion-icon>
                            <span>Square Ft</span>
                        </li>
                    </ul>
                </div>
                <div class="card-footer">
                    <div class="card-footer-actions">
                        <button class="card-footer-actions-btn">
                            <ion-icon name="resize-outline"></ion-icon>
                        </button>
                        <button class="card-footer-actions-btn">
                            <ion-icon name="heart-outline"></ion-icon>
                        </button>
                        <button class="card-footer-actions-btn">
                            <ion-icon name="add-circle-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>
        `;
        propertyList.appendChild(propertyElement);
    });

    updatePaginationInfo(properties.length);
}

// Function to load and filter properties based on the query parameter
async function loadAndSearchProperties() {
    const query = getQueryParameter('query');
    if (!query) return;

    try {
        const response = await fetch('./Assets/json/properties.json');
        if (!response.ok) throw new Error('Failed to load properties data');
        const properties = await response.json();

        // Split the query into individual keywords
        const keywords = query.toLowerCase().split(' ');

        // Filter properties based on the keywords
        filteredAndSortedProperties = properties.filter(property => {
            const fieldsToSearch = `${property.name} ${property.location} ${property.description} ${property.status}`.toLowerCase();
            return keywords.some(keyword => fieldsToSearch.includes(keyword));
        });

        // Save filtered properties to localStorage
        localStorage.setItem('filteredProperties', JSON.stringify(filteredAndSortedProperties));

        applyFiltersAndSort();
    } catch (error) {
        console.error("Error loading properties:", error);
    }
}

// Function to apply filters and sorting
function applyFiltersAndSort() {
    const statusFilter = document.getElementById('filterStatus').value;
    const sortBy = document.getElementById('sortBy').value;

    let properties = JSON.parse(localStorage.getItem('filteredProperties')) || [];

    // Apply status filter
    if (statusFilter !== 'all') {
        properties = properties.filter(property => property.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === 'priceAsc') {
        properties.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
        properties.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'areaAsc') {
        properties.sort((a, b) => a.area - b.area);
    } else if (sortBy === 'areaDesc') {
        properties.sort((a, b) => b.area - a.area);
    }

    filteredAndSortedProperties = properties;
    currentPage = 1; // Reset to first page
    renderPropertyCards(filteredAndSortedProperties);
}

// Function to change the page
function changePage(direction) {
    const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    renderPropertyCards(filteredAndSortedProperties);
}

// Function to update pagination information
function updatePaginationInfo(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listeners for DOM content loaded, filter and sort changes, and pagination buttons
document.addEventListener('DOMContentLoaded', () => {
    loadAndSearchProperties();

    // Add event listeners to filter and sort dropdowns
    document.getElementById('filterStatus').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sortBy').addEventListener('change', applyFiltersAndSort);

    // Add event listeners to pagination buttons
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
});
