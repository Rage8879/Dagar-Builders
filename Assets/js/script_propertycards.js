// shared.js

// Function to render property cards
function renderPropertyCards(properties, containerId) {
    const propertyList = document.getElementById(containerId);
    propertyList.innerHTML = ""; // Clear previous results

    properties.forEach(property => {
        const propertyElement = document.createElement('li');

        // Count the number of images and videos
        const imageKeys = Object.keys(property).filter(key => key.startsWith('image'));
        const videoKeys = Object.keys(property).filter(key => key.startsWith('video'));
        const imageCount = imageKeys.length;
        const videoCount = videoKeys.length;

        propertyElement.innerHTML = `
            <div class="property-card">
                <figure class="card-banner">
                    <a href="#">
                        <img src="${property.image}" alt="${property.name}" class="w-100" onclick="redirectToPropertyInfo('${property.id}')">
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
                            <span>${imageCount}</span>
                        </button>
                        <button class="banner-actions-btn">
                            <ion-icon name="film"></ion-icon>
                            <span>${videoCount}</span>
                        </button>
                    </div>
                </figure>
                <div class="card-content">
                    <div class="card-price">
                        <strong>₹ ${property.price.toLocaleString()}</strong>${property.status === 'forRent' || property.status === 'PG Room' ? '/Month' : ''}
                    </div>
                    <h3 class="h3 card-title" onclick="redirectToPropertyInfo('${property.id}')">
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
                            <ion-icon name="heart-outline"></ion-icon>
                        </button>
                        <button class="card-footer-actions-btn">
                            <ion-icon name="call-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>
        `;
        propertyList.appendChild(propertyElement);
    });
}

// Function to redirect to property info page
window.redirectToPropertyInfo = function(propertyId) {
    window.location = `property_info.html?id=${propertyId}`;
};