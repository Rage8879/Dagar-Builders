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

document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('search-btn');
    const searchPopover = document.getElementById('search-popover');
    const searchInput = searchPopover.querySelector('input'); // Select the input field within the popover

    // Toggle popover visibility on button click
    searchBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        searchPopover.style.display = searchPopover.style.display === 'block' ? 'none' : 'block';
        
        // Focus the input field if the popover is visible
        if (searchPopover.style.display === 'block') {
            searchInput.focus(); // Focus the input field
        }
    });

    // Close popover when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!searchBtn.contains(event.target) && !searchPopover.contains(event.target)) {
            searchPopover.style.display = 'none';
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const properties = [
        { id: 1, name: 'Comfortable Apartment', price: 38900, area: 3850, status: 'forRent', image: './Assets/images/property3.jpg', location: 'Belmont Gardens, Chicago', bedrooms: 3, bathrooms: 2, description: 'Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood', author: { name: 'William Seklo', title: 'Estate Agents', avatar: './Assets/images/author.jpg' } },
        { id: 2, name: 'Comfortable Apartment', price: 3900, area: 350, status: 'forSale', image: './Assets/images/property2.jpg', location: 'Belmont Gardens, Chicago', bedrooms: 3, bathrooms: 2, description: 'Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood', author: { name: 'William Seklo', title: 'Estate Agents', avatar: './Assets/images/author.jpg' } },
        { id: 3, name: 'Luxury Villa', price: 500000, area: 5000, status: 'forSale', image: './Assets/images/property1.jpg', location: 'Beverly Hills, Los Angeles', bedrooms: 5, bathrooms: 4, description: 'Spacious villa with stunning views and modern amenities', author: { name: 'Jane Doe', title: 'Real Estate Agent', avatar: './Assets/images/author2.jpg' } },
        { id: 4, name: 'Cozy Cottage', price: 150000, area: 1200, status: 'sold', image: './Assets/images/property3.jpg', location: 'Greenwich Village, New York', bedrooms: 2, bathrooms: 1, description: 'Charming cottage in a quiet neighborhood', author: { name: 'John Smith', title: 'Broker', avatar: './Assets/images/author3.jpg' } }
    ];

    let currentPage = 1;
    const propertiesPerPage = 2;
    let filteredProperties = properties;

    function renderProperties(properties) {
        const propertyList = document.getElementById('propertyList');
        propertyList.innerHTML = '';

        properties.forEach(property => {
            const propertyElement = document.createElement('li');
            propertyElement.innerHTML = `
                <li>
                    <div class="property-card">
                        <figure class="card-banner">
                            <a href="#">
                                <img src="${property.image}" alt="${property.name}" class="w-100">
                            </a>
                            <div class="card-badge ${property.status === 'forRent' ? 'green' : property.status === 'forSale' ? 'blue' : 'red'}">${property.status === 'forRent' ? 'For Rent' : property.status === 'forSale' ? 'For Sale' : 'Sold'}</div>
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
                            <div class="card-author">
                                <figure class="author-avatar">
                                    <img src="${property.author.avatar}" alt="${property.author.name}" class="w-100">
                                </figure>
                                <div>
                                    <p class="author-name">
                                        <a href="#">${property.author.name}</a>
                                    </p>
                                    <p class="author-title">${property.author.title}</p>
                                </div>
                            </div>
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
                </li>
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

    applyFiltersAndSort();
});