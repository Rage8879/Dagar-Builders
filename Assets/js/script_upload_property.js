document.getElementById('uploadPropertyForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form data
    const formData = new FormData(event.target);
    const propertyData = Object.fromEntries(formData.entries());

    // Convert numeric fields
    propertyData.price = parseFloat(propertyData.price);
    propertyData.area = parseFloat(propertyData.area);
    propertyData.bedrooms = parseInt(propertyData.bedrooms, 10);
    propertyData.bathrooms = parseInt(propertyData.bathrooms, 10);

    // Handle file uploads
    const posterImageFile = formData.get('posterImage');
    const additionalImagesFiles = formData.getAll('additionalImages');
    const videoFiles = formData.getAll('videos');

    try {
        // Upload files to the server or cloud storage and get URLs
        propertyData.image = await uploadFile(posterImageFile);
        for (let i = 0; i < additionalImagesFiles.length; i++) {
            propertyData[`image${i + 1}`] = await uploadFile(additionalImagesFiles[i]);
        }
        for (let i = 0; i < videoFiles.length; i++) {
            propertyData[`video${i + 1}`] = await uploadFile(videoFiles[i]);
        }

        // Fetch existing properties data from JSON file
        const response = await fetch('./Assets/json/properties.json');
        const properties = await response.json();

        // Determine the next ID
        const nextId = properties.length ? Math.max(...properties.map(p => p.id)) + 1 : 1;
        propertyData.id = nextId;

        // Add the new property to the properties array
        properties.push(propertyData);

        // Save the updated properties array back to the JSON file
        await saveProperties(properties);

        alert('Property uploaded successfully!');
        event.target.reset(); // Reset the form
    } catch (error) {
        console.error('Error uploading property:', error);
        alert('Error uploading property. Please try again.');
    }
});

// Function to upload a file and return its URL
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('YOUR_FILE_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }

    const result = await response.json();
    return result.url; // Assuming the response contains the file URL
}

// Function to save properties to the JSON file
async function saveProperties(properties) {
    const response = await fetch('./Assets/json/properties.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(properties)
    });

    if (!response.ok) {
        throw new Error('Failed to save properties');
    }
}