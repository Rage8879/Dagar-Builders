document.addEventListener('DOMContentLoaded', async function() {
    const propertyId = parseInt(getQueryParameter('id'), 10); // Convert to number
    console.log('Property ID:', propertyId); // Log the property ID
    if (isNaN(propertyId)) {
        document.getElementById('propertyInfo').innerHTML = '<p>Property not found.</p>';
        return;
    }

    try {
        const response = await fetch('./Assets/json/properties.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const properties = await response.json();
        console.log('Properties:', properties); // Log the properties data
        const property = properties.find(p => p.id === propertyId);

        if (!property) {
            document.getElementById('propertyInfo').innerHTML = '<p>Property not found.</p>';
            return;
        }

        // Create tabs and content HTML
        let imagesHtml = '';
        let videosHtml = '';
        const imageKeys = ['image', ...Object.keys(property).filter(key => key.startsWith('image') && key !== 'image')];
        const videoKeys = Object.keys(property).filter(key => key.startsWith('video'));

        imageKeys.forEach((key, index) => {
            imagesHtml += `
                <img id="main-image-${index}" alt="${property.name}" height="400" src="${property[key]}" width="600" class="${index === 0 ? '' : 'hidden'}">
            `;
        });

        videoKeys.forEach((key, index) => {
            videosHtml += `
                <video controls height="400" width="600" class="${index === 0 ? '' : 'hidden'}">
                    <source src="${property[key]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        });

        let thumbnailsHtml = '';
        imageKeys.forEach((key, index) => {
            thumbnailsHtml += `
                <img alt="Thumbnail ${index + 1}" height="60" src="${property[key]}" width="60" onclick="changeImage(${index})" class="${index === 0 ? 'selected' : ''}">
            `;
        });

        document.getElementById('propertyInfo').innerHTML = `
            <div class="tabs">
                <div id="videos-tab" onclick="showVideos()">VIDEOS</div>
                <div id="images-tab" class="active" onclick="showImages()">IMAGES</div>
            </div>
            <div class="container-main">
                <div id="image-section" class="image-section">
                    <button class="nav-button prev-button" onclick="navigateImage(-1)">&#10094;</button>
                    ${imagesHtml}
                    <button class="nav-button next-button" onclick="navigateImage(1)">&#10095;</button>
                </div>
                <div id="video-section" class="image-section hidden">
                    ${videosHtml}
                </div>
                <div class="thumbnails">
                    ${thumbnailsHtml}
                </div>
            </div>
                <div class="details-section">
                    <h1>${property.name}</h1>
                    <p>Price: ₹ ${property.price.toLocaleString()}</p>
                    <p>Area: ${property.area} Sq Ft</p>
                    <p>Status: ${property.status}</p>
                    <p>Location: ${property.location}</p>
                    <p>Bedrooms: ${property.bedrooms}</p>
                    <p>Bathrooms: ${property.bathrooms}</p>
                    <p>${property.description}</p>
                </div>
        `;

    } catch (error) {
        console.error('Error loading property details:', error);
        document.getElementById('propertyInfo').innerHTML = `<p>Error loading property details: ${error.message}</p>`;
    }
});

// Function to get query parameter by name
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to change the main image
function changeImage(index) {
    // Remove 'selected' class from all thumbnails
    var thumbnails = document.querySelectorAll('.thumbnails img');
    thumbnails.forEach(function(thumbnail, i) {
        thumbnail.classList.remove('selected');
        document.getElementById(`main-image-${i}`).classList.add('hidden');
    });

    // Add 'selected' class to the clicked thumbnail
    thumbnails[index].classList.add('selected');
    document.getElementById(`main-image-${index}`).classList.remove('hidden');
}

// Function to navigate images
function navigateImage(direction) {
    var thumbnails = document.querySelectorAll('.thumbnails img');
    var currentIndex = Array.from(thumbnails).findIndex(thumbnail => thumbnail.classList.contains('selected'));
    var newIndex = (currentIndex + direction + thumbnails.length) % thumbnails.length;
    changeImage(newIndex);
}

// Function to show videos tab
function showVideos() {
    document.getElementById('image-section').classList.add('hidden');
    document.getElementById('video-section').classList.remove('hidden');
    document.getElementById('videos-tab').classList.add('active');
    document.getElementById('images-tab').classList.remove('active');
}

// Function to show images tab
function showImages() {
    document.getElementById('image-section').classList.remove('hidden');
    document.getElementById('video-section').classList.add('hidden');
    document.getElementById('videos-tab').classList.remove('active');
    document.getElementById('images-tab').classList.add('active');
}