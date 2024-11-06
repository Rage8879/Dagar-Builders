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
    const propertiesPerPage = 12;
    let filteredProperties = properties;

    function renderProperties(properties) {
        const propertyList = document.getElementById('propertyList');
        propertyList.innerHTML = '';

        properties.forEach(property => {
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
                            <strong>$${property.price}</strong>/Month
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

        currentPage = 1;
        updatePagination();
        renderProperties(filteredProperties.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage));
    }

    document.getElementById('sortBy').addEventListener('change', applyFiltersAndSort);
    document.getElementById('filterStatus').addEventListener('change', applyFiltersAndSort);

    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderProperties(filteredProperties.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage));
            updatePagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProperties(filteredProperties.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage));
            updatePagination();
        }
    });

    applyFiltersAndSort(); // Initial render
});