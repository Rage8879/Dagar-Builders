let currentPage = 1;
const itemsPerPage = 8;
let filteredAndSortedProperties = [];
let properties = [];

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
        properties = await response.json();

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
    const sortBy = document.getElementById('sortBy').value;
    const filterStatus = Array.from(document.querySelectorAll('#filterStatus input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    let properties = JSON.parse(localStorage.getItem('filteredProperties')) || [];

    // Apply status filter
    if (filterStatus.length === 0) {
        filteredAndSortedProperties = properties; // No filters applied, show all properties
    } else {
        filteredAndSortedProperties = properties.filter(property => 
            filterStatus.includes(property.status)
        );
    }

    // Apply sorting
    if (sortBy === 'priceAsc') {
        filteredAndSortedProperties.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
        filteredAndSortedProperties.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'areaAsc') {
        filteredAndSortedProperties.sort((a, b) => a.area - b.area);
    } else if (sortBy === 'areaDesc') {
        filteredAndSortedProperties.sort((a, b) => b.area - a.area);
    }

    currentPage = 1; // Reset to first page
    renderPaginatedPropertyCards(filteredAndSortedProperties); // Render cards to the propertyList container
}

// Function to render paginated property cards
function renderPaginatedPropertyCards(properties) {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = ""; // Clear previous results

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProperties = properties.slice(start, end);

    if (paginatedProperties.length === 0) {
        propertyList.innerHTML = "<p>No matching properties found.</p>";
        return;
    }

    // Use the shared function to render property cards
    window.renderPropertyCards(paginatedProperties, 'propertyList');
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
