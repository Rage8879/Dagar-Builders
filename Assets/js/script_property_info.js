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

        // Create slideshow HTML
        let slideshowHtml = '';
        let slideIndex = 1;
        const mediaKeys = ['image', ...Object.keys(property).filter(key => key.startsWith('image') && key !== 'image'), ...Object.keys(property).filter(key => key.startsWith('video'))];
        mediaKeys.forEach((key, index) => {
            if (key.startsWith('image')) {
                slideshowHtml += `
                    <div class="mySlides fade">
                        <div class="numbertext">${index + 1} / ${mediaKeys.length}</div>
                        <img src="${property[key]}" style="width:100%">
                    </div>
                `;
            } else if (key.startsWith('video')) {
                const videoUrl = property[key];
                if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                    const videoId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
                    slideshowHtml += `
                        <div class="mySlides fade">
                            <div class="numbertext">${index + 1} / ${mediaKeys.length}</div>
                            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    `;
                } else {
                    slideshowHtml += `
                        <div class="mySlides fade">
                            <div class="numbertext">${index + 1} / ${mediaKeys.length}</div>
                            <video controls style="width:100%">
                                <source src="${videoUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    `;
                }
            }
        });

        document.getElementById('propertyInfo').innerHTML = `
            <div class="slideshow-container">
                ${slideshowHtml}
                <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                <a class="next" onclick="plusSlides(1)">&#10095;</a>
            </div>
            <br>
            <div style="text-align:center">
                ${Array.from({ length: mediaKeys.length }, (_, i) => `<span class="dot" onclick="currentSlide(${i + 1})"></span>`).join('')}
            </div>
            <div class="property-card">
                <div class="card-content">
                    <div class="card-price">
                        <strong>$${property.price}</strong>${property.status === 'forRent' || property.status === 'PG Room' ? '/Month' : ''}
                    </div>
                    <h3 class="h3 card-title">${property.name}</h3>
                    <p class="card-text">${property.description}</p>
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
            </div>
        `;

        showSlides(slideIndex);

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

// Slideshow functions
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return; // Exit if no slides
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";

    // Adjust the container size based on the media dimensions
    const slideshowContainer = document.querySelector('.slideshow-container');
    const currentSlide = slides[slideIndex-1].querySelector('img, video, iframe');
    if (currentSlide.tagName === 'IMG') {
        currentSlide.onload = function() {
            slideshowContainer.style.width = `${currentSlide.naturalWidth}px`;
            slideshowContainer.style.height = `${currentSlide.naturalHeight}px`;
        };
    } else if (currentSlide.tagName === 'VIDEO') {
        currentSlide.onloadedmetadata = function() {
            slideshowContainer.style.width = `${currentSlide.videoWidth}px`;
            slideshowContainer.style.height = `${currentSlide.videoHeight}px`;
        };
    } else if (currentSlide.tagName === 'IFRAME') {
        slideshowContainer.style.width = '100%';
        slideshowContainer.style.height = '315px'; // Fixed height for YouTube iframe
    }
}

// Add event listeners for touch events and keyboard events
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    let startX;

    // Touch events for swiping
    slideshowContainer.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
    });

    slideshowContainer.addEventListener('touchmove', function(event) {
        if (!startX) return;
        let endX = event.touches[0].clientX;
        let diffX = startX - endX;

        if (diffX > 50) {
            plusSlides(1); // Swipe left
        } else if (diffX < -50) {
            plusSlides(-1); // Swipe right
        }
        startX = null;
    });

    // Keyboard events for arrow keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            plusSlides(-1); // Left arrow key
        } else if (event.key === 'ArrowRight') {
            plusSlides(1); // Right arrow key
        }
    });
});