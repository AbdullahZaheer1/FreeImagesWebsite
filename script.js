// Configuration - Replace with your actual API keys
const API_KEYS = {
    unsplash: 'goMAiTA2jT0G3Oa9epODmaR1CqfD9eVSoW0Vmro9Bk8',
    pexels: 'DtcB3amMXQ54IXhIH3k98XwLXelQA7C5EjBRM1Hqf9cKiYeWbsSSep5X',
    pixabay: '46233130-b815d1b20dbcd9a0dfa3d9ae1'
};

// Demo keys (limited usage) - Replace with your own
const DEMO_KEYS = {
    pixabay: '46233130-b815d1b20dbcd9a0dfa3d9ae1' // Demo key - get your own from Pixabay
};

let currentSource = 'unsplash';

// Source selector
document.querySelectorAll('.source-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentSource = this.dataset.source;
        performSearch(document.getElementById('searchInput').value || 'nature');
    });
});

// Search function
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        performSearch(query);
    } else {
        performSearch('tech');
    }
});

// Enter key search
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

async function performSearch(query) {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('imageGrid').innerHTML = '';

    try {
        let images = [];

        switch (currentSource) {
            case 'unsplash':
                images = await searchUnsplash(query);
                break;
            case 'pexels':
                images = await searchPexels(query);
                break;
            case 'pixabay':
                images = await searchPixabay(query);
                break;
        }

        displayImages(images);
    } catch (error) {
        console.error('Search error:', error);
        document.getElementById('imageGrid').innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                        <h3>API Key Required</h3>
                        <p>Please get free API keys from:</p>
                        <p>1. <a href="https://unsplash.com/developers" target="_blank">Unsplash Developers</a></p>
                        <p>2. <a href="https://www.pexels.com/api/" target="_blank">Pexels API</a></p>
                        <p>3. <a href="https://pixabay.com/api/docs/" target="_blank">Pixabay API</a></p>
                        <p>Then replace the API keys in the code.</p>
                    </div>
                `;
    }

    document.getElementById('loading').style.display = 'none';
}

async function searchUnsplash(query) {
    // For demo - using sample images
    // Get your key from: https://unsplash.com/developers
    const accessKey = API_KEYS.unsplash;

    if (accessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
        return getDemoImages();
    }

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${accessKey}`
    );
    const data = await response.json();
    return data.results.map(img => ({
        url: img.urls.regular,
        download: img.links.download,
        photographer: img.user.name,
        profile: img.user.links.html
    }));
}

async function searchPexels(query) {
    // Get your key from: https://www.pexels.com/api/
    const apiKey = API_KEYS.pexels;

    if (apiKey === 'YOUR_PEXELS_API_KEY') {
        return getDemoImages();
    }

    const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=20`,
        {
            headers: {
                'Authorization': apiKey
            }
        }
    );
    const data = await response.json();
    return data.photos.map(photo => ({
        url: photo.src.large,
        download: photo.src.original,
        photographer: photo.photographer,
        profile: photo.photographer_url
    }));
}

async function searchPixabay(query) {
    // Using demo key - replace with yours
    const apiKey = DEMO_KEYS.pixabay;

    const response = await fetch(
        `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=20`
    );
    const data = await response.json();
    return data.hits.map(img => ({
        url: img.largeImageURL || img.webformatURL,
        download: img.largeImageURL,
        photographer: img.user,
        profile: `https://pixabay.com/users/${img.user}-${img.user_id}/`
    }));
}

function getDemoImages() {
    // Demo images for preview
    return [
        {
            url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
            download: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
            photographer: 'Nature Photographer',
            profile: 'https://unsplash.com'
        },
        {
            url: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?w=600',
            download: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg',
            photographer: 'City View',
            profile: 'https://pexels.com'
        },
        {
            url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
            download: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
            photographer: 'Tree Landscape',
            profile: 'https://pixabay.com'
        }
    ];
}

function displayImages(images) {
    const grid = document.getElementById('imageGrid');
    grid.innerHTML = '';

    images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
                    <img src="${img.url}" alt="Stock Image" loading="lazy">
                    <div class="image-info">
                        <p><strong>By:</strong> ${img.photographer}</p>
                        <button class="download-btn" onclick="downloadImage('${img.download}', '${img.photographer}')">
                            View Image
                        </button>
                    </div>
                `;

        grid.appendChild(card);
    });

    // Add sample images if grid is empty
    if (images.length === 0) {
        grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <h3>No images found. Try "nature", "business", "technology" etc.</h3>
                        <p>Or get API keys to access millions of images.</p>
                    </div>
                `;
    }
}

function downloadImage(url, photographer) {
    // Create temporary link for download
    const link = document.createElement('a');
    link.href = url;
    link.download = `freestock-${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show notification
    alert(`\nImage by: ${photographer}\nFree for commercial use.`);
}

// Load initial images
window.onload = () => {
    performSearch('nature');
};