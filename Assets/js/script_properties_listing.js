'use strict';

/**
 * element toggle function
 */
const elemToggleFunc = function (elem) { 
    elem.classList.toggle("active"); 
}

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when clicking on any navbar link
 */
for (let i = 0; i < navbarLinks.length; i++) { 
    navElemArr.push(navbarLinks[i]); 
}

/**
 * add event on all elements for toggling navbar
 */
for (let i = 0; i < navElemArr.length; i++) {
    navElemArr[i].addEventListener("click", function () {
        elemToggleFunc(navbar);
        elemToggleFunc(overlay);
    });
}

/**
 * header active state
 */
const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    window.scrollY >= 400 ? header.classList.add("active")
        : header.classList.remove("active");
}); 

document.addEventListener('DOMContentLoaded', async function() {
    let properties = [];  // Declare properties as an empty array to hold loaded data.

    try {
        // Fetch properties data from JSON file.
        const response = await fetch('./Assets/json/properties.json');
        properties = await response.json();  // Load the properties data into the array.
        console.log(properties);  // Debug: Check if properties data loads correctly.
    } catch (error) {
        console.error("Error loading properties data:", error);
    }

    let currentPage = 1;
    const propertiesPerPage = 8;
    let filteredProperties = properties;

    function renderProperties(properties) {
        const propertyList = document.getElementById('propertyList');
        propertyList.innerHTML = '';

        // Calculate the start and end index for the current page
        const startIndex = (currentPage - 1) * propertiesPerPage;
        const endIndex = startIndex + propertiesPerPage;

        // Slice the properties array to get only the properties for the current page
        const propertiesToShow = properties.slice(startIndex, endIndex);

        // Use the shared function to render property cards
        renderPropertyCards(propertiesToShow, 'propertyList');
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    function applyFiltersAndSort() {
        const sortBy = document.getElementById('sortBy').value;
        const filterStatus = document.getElementById('filterStatus').value;

        // Apply filtering based on status
        filteredProperties = properties.filter(property => 
            (filterStatus === 'all' || property.status === filterStatus)
        );

        // Apply sorting if sortBy is not "none"
        if (sortBy !== 'none') {
            switch (sortBy) {
                case 'priceAsc':
                    filteredProperties.sort((a, b) => a.price - b.price);
                    break;
                case 'priceDesc':
                    filteredProperties.sort((a, b) => b.price - a.price);
                    break;
                case 'areaAsc':
                    filteredProperties.sort((a, b) => a.area - b.area);
                    break;
                case 'areaDesc':
                    filteredProperties.sort((a, b) => b.area - a.area);
                    break;
            }
        }

        currentPage = 1; // Reset to the first page after applying filters and sorting
        renderProperties(filteredProperties);
        updatePagination();
    }

    // Initial render
    renderProperties(filteredProperties);
    updatePagination();

    // Event listeners for filters and pagination
    document.getElementById('sortBy').addEventListener('change', applyFiltersAndSort);
    document.getElementById('filterStatus').addEventListener('change', applyFiltersAndSort);
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderProperties(filteredProperties);
            updatePagination();
        }
    });
    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProperties(filteredProperties);
            updatePagination();
        }
    });
});