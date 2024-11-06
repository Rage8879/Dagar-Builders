// Function to get the search query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to render property cards
function renderPropertyCards(properties) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ""; // Clear previous results

    if (properties.length === 0) {
        resultsContainer.innerHTML = "<p>No matching properties found.</p>";
        return;
    }

    properties.forEach(property => {
        const propertyCard = `
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
            </div>`;
        resultsContainer.insertAdjacentHTML("beforeend", propertyCard);
    });
}

// Function to load and filter properties based on the query parameter
async function loadAndSearchProperties() {
    const query = getQueryParameter('query');
    if (!query) return;

    try {
        const response = await fetch('./Assets/json/properties.json');
        if (!response.ok) throw new Error('Failed to load properties data');
        const properties = await response.json();

        // Filter properties based on the query
        const filteredProperties = properties.filter(property => {
            const fieldsToSearch = `${property.name} ${property.location} ${property.description} ${property.status}`.toLowerCase();
            return fieldsToSearch.includes(query.toLowerCase());
        });

        renderPropertyCards(filteredProperties);
    } catch (error) {
        console.error("Error loading properties:", error);
    }
}

// Initialize the property search on page load
document.addEventListener('DOMContentLoaded', loadAndSearchProperties);
