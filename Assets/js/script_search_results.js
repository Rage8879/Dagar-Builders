let currentPage = 1;
const itemsPerPage = 8;
let filteredAndSortedProperties = [];

// Function to get the search query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
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
    renderPaginatedPropertyCards(filteredAndSortedProperties); // Render cards to the propertyList container
}

// Function to render paginated property cards
function renderPaginatedPropertyCards(properties) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProperties = properties.slice(start, end);

    renderPropertyCards(paginatedProperties, 'propertyList');
    updatePaginationInfo(properties.length);
}

// Function to change the page
function changePage(direction) {
    const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    renderPaginatedPropertyCards(filteredAndSortedProperties); // Render cards to the propertyList container
}

// Function to update pagination information
function updatePaginationInfo(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
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
