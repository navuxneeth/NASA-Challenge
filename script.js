// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Header Navigation
const burgerMenu = document.getElementById('burger-menu');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

burgerMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
    burgerMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burgerMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 8, 20, 0.95)';
    } else {
        header.style.background = 'rgba(0, 8, 20, 0.9)';
    }
});

// Orbit Timer (Simulated)
function updateOrbitTimer() {
    const timerElement = document.getElementById('sunrise-timer');
    if (!timerElement) return;

    let minutes = 45;
    let seconds = 0;

    setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 0) {
            minutes = 45;
            seconds = 0;
        }
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

updateOrbitTimer();

// POI (Points of Interest) Data
const poiData = {
    wildfires: {
        title: 'Wildfire Monitoring: California',
        description: 'Astronaut imagery helps ground teams track active wildfires, providing crucial intelligence for containment efforts and disaster relief. Real-time observations from the ISS allow for rapid response and coordination of firefighting resources.',
        data: 'Fire spread rate: 2.3 acres/min | Area affected: 15,000+ acres | Wind speed: 35 mph',
        link: 'https://earthobservatory.nasa.gov/topic/fires'
    },
    hurricane: {
        title: 'Hurricane Tracking: Atlantic Basin',
        description: 'ISS cameras capture high-resolution images of developing hurricanes, helping meteorologists predict storm paths and intensity. These observations are critical for early warning systems and evacuation planning.',
        data: 'Wind speed: 140 mph | Category: 4 | Diameter: 350 miles | Movement: 15 mph NW',
        link: 'https://earthobservatory.nasa.gov/topic/severe-storms'
    },
    deforestation: {
        title: 'Deforestation Monitoring: Amazon Basin',
        description: 'Regular ISS photography tracks deforestation patterns in critical rainforest regions. This data helps environmental agencies monitor illegal logging and assess the impact on global climate systems.',
        data: 'Area deforested: 2,500 sq km/year | Forest coverage change: -3.2% | CO2 impact: significant',
        link: 'https://earthobservatory.nasa.gov/topic/land'
    }
};

// POI Interaction
const pois = document.querySelectorAll('.poi');
const poiPanel = document.getElementById('poi-panel');
const closePanel = document.querySelector('.close-panel');

pois.forEach(poi => {
    poi.addEventListener('click', () => {
        const poiType = poi.getAttribute('data-poi');
        const data = poiData[poiType];

        if (data) {
            document.getElementById('poi-title').textContent = data.title;
            document.getElementById('poi-description').textContent = data.description;
            document.getElementById('poi-data').textContent = data.data;
            document.getElementById('poi-learn-more').href = data.link;
            
            // Simulate image carousel
            const poiImages = document.getElementById('poi-images');
            poiImages.innerHTML = '<p style="color: #999;">High-resolution ISS imagery</p>';
            
            poiPanel.classList.add('active');
        }
    });
});

if (closePanel) {
    closePanel.addEventListener('click', () => {
        poiPanel.classList.remove('active');
    });
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (poiPanel.classList.contains('active') && 
        !poiPanel.contains(e.target) && 
        !e.target.closest('.poi')) {
        poiPanel.classList.remove('active');
    }
});

// NBL Simulation
const buoyancySlider = document.getElementById('buoyancy-slider');
const astronaut = document.getElementById('astronaut');
const startTaskBtn = document.getElementById('start-task-btn');
const taskIndicator = document.getElementById('task-indicator');
const connectionPoint = document.getElementById('connection-point');
const taskFeedback = document.getElementById('task-feedback');

let taskActive = false;
let astronautPosition = { x: 0, y: 0 };
let isDragging = false;

// Buoyancy Control
if (buoyancySlider && astronaut) {
    buoyancySlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        const poolEnvironment = document.querySelector('.pool-environment');
        const maxY = poolEnvironment.clientHeight - astronaut.clientHeight;
        
        // Convert slider value to vertical position (inverted)
        const yPercent = (100 - value) / 100;
        const newY = yPercent * maxY * 0.8;
        
        astronaut.style.top = `${newY}px`;
        
        // Check if in neutral zone (45-55)
        if (value >= 45 && value <= 55) {
            astronaut.style.filter = 'brightness(1.2)';
            if (taskActive) {
                taskFeedback.textContent = 'Perfect buoyancy! Now move to the connection point.';
                taskFeedback.className = 'task-feedback success';
            }
        } else {
            astronaut.style.filter = 'brightness(1)';
            if (taskActive && taskFeedback.className === 'task-feedback success') {
                taskFeedback.textContent = 'Adjust buoyancy to neutral zone (45-55)';
                taskFeedback.className = 'task-feedback error';
            }
        }
    });
}

// Start Task
if (startTaskBtn) {
    startTaskBtn.addEventListener('click', () => {
        taskActive = true;
        startTaskBtn.disabled = true;
        startTaskBtn.textContent = 'Task in Progress...';
        taskIndicator.classList.add('active');
        connectionPoint.classList.add('active');
        taskFeedback.textContent = 'Adjust your buoyancy to the neutral zone (45-55)';
        taskFeedback.className = 'task-feedback';
    });
}

// Drag Astronaut
if (astronaut) {
    let startX, startY;
    
    astronaut.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - astronautPosition.x;
        startY = e.clientY - astronautPosition.y;
        astronaut.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const poolEnvironment = document.querySelector('.pool-environment');
        const rect = poolEnvironment.getBoundingClientRect();
        
        let newX = e.clientX - startX;
        let newY = e.clientY - startY - rect.top;
        
        // Constrain to pool boundaries
        newX = Math.max(0, Math.min(newX, rect.width - astronaut.clientWidth));
        newY = Math.max(0, Math.min(newY, rect.height - astronaut.clientHeight));
        
        astronautPosition.x = newX;
        astronautPosition.y = newY;
        
        astronaut.style.left = `${newX}px`;
        astronaut.style.top = `${newY}px`;
        
        // Check proximity to connection point if task is active
        if (taskActive && connectionPoint.classList.contains('active')) {
            checkConnectionProximity();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        astronaut.style.cursor = 'grab';
    });

    // Touch support
    astronaut.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX - astronautPosition.x;
        startY = touch.clientY - astronautPosition.y;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const poolEnvironment = document.querySelector('.pool-environment');
        const rect = poolEnvironment.getBoundingClientRect();
        
        let newX = touch.clientX - startX;
        let newY = touch.clientY - startY - rect.top;
        
        newX = Math.max(0, Math.min(newX, rect.width - astronaut.clientWidth));
        newY = Math.max(0, Math.min(newY, rect.height - astronaut.clientHeight));
        
        astronautPosition.x = newX;
        astronautPosition.y = newY;
        
        astronaut.style.left = `${newX}px`;
        astronaut.style.top = `${newY}px`;
        
        if (taskActive && connectionPoint.classList.contains('active')) {
            checkConnectionProximity();
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function checkConnectionProximity() {
    const astronautRect = astronaut.getBoundingClientRect();
    const connectionRect = connectionPoint.getBoundingClientRect();
    
    const distance = Math.sqrt(
        Math.pow(astronautRect.left - connectionRect.left, 2) +
        Math.pow(astronautRect.top - connectionRect.top, 2)
    );
    
    const buoyancyValue = parseInt(buoyancySlider.value);
    const inNeutralZone = buoyancyValue >= 45 && buoyancyValue <= 55;
    
    if (distance < 100 && inNeutralZone) {
        completeTask();
    }
}

function completeTask() {
    if (!taskActive) return;
    
    taskActive = false;
    connectionPoint.classList.remove('active');
    taskIndicator.classList.remove('active');
    taskFeedback.textContent = '✓ Task Complete! You successfully attached the power cable!';
    taskFeedback.className = 'task-feedback success';
    
    setTimeout(() => {
        startTaskBtn.disabled = false;
        startTaskBtn.textContent = 'Start Another Task';
        taskFeedback.textContent = '';
        taskFeedback.className = 'task-feedback';
    }, 3000);
}

// Benefits Section Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const benefitCards = document.querySelectorAll('.benefit-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active benefit card
        benefitCards.forEach(card => {
            card.classList.remove('active');
            if (card.id === targetTab) {
                card.classList.add('active');
            }
        });
    });
});

// Did You Know Carousel
const factItems = document.querySelectorAll('.fact-carousel .fact-item');
const dots = document.querySelectorAll('.carousel-dots .dot');
let currentFactIndex = 0;

function showFact(index) {
    factItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    factItems[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextFact() {
    currentFactIndex = (currentFactIndex + 1) % factItems.length;
    showFact(currentFactIndex);
}

// Auto-rotate facts every 5 seconds
setInterval(nextFact, 5000);

// Manual dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentFactIndex = index;
        showFact(currentFactIndex);
    });
});

// Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This is a demo form.');
        contactForm.reset();
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // ESC to close POI panel
    if (e.key === 'Escape' && poiPanel.classList.contains('active')) {
        poiPanel.classList.remove('active');
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        currentFactIndex = (currentFactIndex - 1 + factItems.length) % factItems.length;
        showFact(currentFactIndex);
    } else if (e.key === 'ArrowRight') {
        nextFact();
    }
});

// Prevent context menu on interactive elements for better UX
document.querySelectorAll('.poi, .astronaut, .cta-button, .task-btn').forEach(element => {
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add visual feedback for touch interactions
if ('ontouchstart' in window) {
    document.querySelectorAll('button, .nav-link, .poi').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// ============================================
// REAL API INTEGRATIONS
// ============================================

// Initialize Real-Time ISS Tracking
function initISSTracking() {
    if (CONFIG.ISS_LOCATION_ENABLED && typeof issTracker !== 'undefined') {
        issTracker.startTracking((position) => {
            if (position) {
                const latElement = document.getElementById('iss-lat');
                const lonElement = document.getElementById('iss-lon');
                
                if (latElement && lonElement) {
                    latElement.textContent = `Lat: ${position.latitude.toFixed(2)}°`;
                    lonElement.textContent = `Lon: ${position.longitude.toFixed(2)}°`;
                }
            }
        }, 10000); // Update every 10 seconds
    }
}

// Load Live Earth Events from NASA EONET
async function loadLiveEvents() {
    if (typeof eonetApi === 'undefined') return;
    
    const eventsContainer = document.getElementById('live-events-list');
    if (!eventsContainer) return;
    
    try {
        const events = await eonetApi.getEvents(null, 5);
        
        if (events.length > 0) {
            eventsContainer.innerHTML = events.map(event => `
                <div class="event-item">
                    <div class="event-icon">${getCategoryIcon(event.categories[0].id)}</div>
                    <div class="event-info">
                        <strong>${event.title}</strong>
                        <span class="event-date">${new Date(event.geometry[0].date).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = '<p>No current events</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = '<p>Unable to load events</p>';
    }
}

function getCategoryIcon(categoryId) {
    const icons = {
        'wildfires': '🔥',
        'severeStorms': '🌪️',
        'volcanoes': '🌋',
        'floods': '🌊',
        'drought': '🏜️',
        'dustHaze': '💨',
        'snow': '❄️'
    };
    return icons[categoryId] || '🌍';
}

// NASA Image Gallery Integration
let currentGallerySearch = 'ISS';

async function loadGalleryImages(query = 'ISS') {
    if (typeof nasaApi === 'undefined') return;
    
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<p class="loading-text">Loading images...</p>';
    
    try {
        const results = await nasaApi.searchImages(query);
        
        if (results.length > 0) {
            const images = results.slice(0, 12); // Limit to 12 images
            
            galleryGrid.innerHTML = images.map((item, index) => {
                const imageUrl = item.links && item.links[0] ? item.links[0].href : '';
                const title = item.data[0].title || 'NASA Image';
                const description = item.data[0].description || '';
                
                return `
                    <div class="gallery-item" data-index="${index}" data-url="${imageUrl}" data-title="${title.replace(/"/g, '&quot;')}" data-description="${description.replace(/"/g, '&quot;')}">
                        <img src="${imageUrl}" alt="${title}" loading="lazy">
                        <div class="gallery-overlay">
                            <p>${title.substring(0, 60)}${title.length > 60 ? '...' : ''}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to gallery items
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', () => {
                    openGalleryModal(
                        item.dataset.url,
                        item.dataset.title,
                        item.dataset.description
                    );
                });
            });
        } else {
            galleryGrid.innerHTML = '<p>No images found. Try a different search term.</p>';
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p>Unable to load images. Please check your API configuration.</p>';
    }
}

function openGalleryModal(imageUrl, title, description) {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    
    if (modal && modalImg && modalCaption) {
        modal.style.display = 'flex';
        modalImg.src = imageUrl;
        modalCaption.innerHTML = `<strong>${title}</strong><br>${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`;
    }
}

// Gallery search functionality
const gallerySearchBtn = document.getElementById('gallery-search-btn');
const gallerySearchInput = document.getElementById('gallery-search');

if (gallerySearchBtn && gallerySearchInput) {
    gallerySearchBtn.addEventListener('click', () => {
        const query = gallerySearchInput.value.trim() || 'ISS';
        loadGalleryImages(query);
    });
    
    gallerySearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = gallerySearchInput.value.trim() || 'ISS';
            loadGalleryImages(query);
        }
    });
}

// Close modal
const modalClose = document.querySelector('.modal-close');
const galleryModal = document.getElementById('gallery-modal');

if (modalClose && galleryModal) {
    modalClose.addEventListener('click', () => {
        galleryModal.style.display = 'none';
    });
    
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
    });
}

// Update POI data with real information
async function updatePOIWithRealData(poiType) {
    if (typeof eonetApi === 'undefined') return;
    
    try {
        let events = [];
        if (poiType === 'wildfires') {
            events = await eonetApi.getWildfires();
        } else if (poiType === 'hurricane') {
            events = await eonetApi.getSevereStorms();
        }
        
        if (events.length > 0) {
            const event = events[0];
            const poiImages = document.getElementById('poi-images');
            
            if (poiImages) {
                poiImages.innerHTML = `
                    <div class="real-event-data">
                        <p><strong>Latest Event:</strong> ${event.title}</p>
                        <p><strong>Date:</strong> ${new Date(event.geometry[0].date).toLocaleString()}</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error updating POI:', error);
    }
}

// Initialize all API features on page load
window.addEventListener('load', () => {
    console.log('%c🚀 Orbital Perspectives 🌍', 'font-size: 24px; font-weight: bold; color: #0b3d91;');
    console.log('%cWelcome to your journey to the International Space Station!', 'font-size: 14px; color: #333;');
    console.log('%cThis interactive experience showcases the ISS Cupola and NBL Training with REAL NASA data!', 'font-size: 12px; color: #666;');
    
    // Initialize ISS tracking
    initISSTracking();
    
    // Initialize interactive world map
    initISSWorldMap();
    
    // Load live events
    loadLiveEvents();
    
    // Load initial gallery images
    loadGalleryImages('ISS');
    
    // Refresh events every 5 minutes
    setInterval(loadLiveEvents, 300000);
    
    // Performance monitoring
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    }
});

// ============================================
// Interactive ISS World Map with Canvas
// ============================================

let worldMapCanvas = null;
let worldMapCtx = null;
let issPosition = { lat: 0, lon: 0 };
let pathCoordinates = [];
let showPath = true;
let showGrid = true;
let mapZoom = 1;
let mapOffsetX = 0;
let mapOffsetY = 0;
let isMapDragging = false;
let mapDragStart = { x: 0, y: 0 };

// Simplified world continents data (approximate coordinates)
const worldContinents = [
    // North America
    { name: "North America", coords: [
        [-170, 15], [-140, 72], [-60, 72], [-60, 15], [-110, 10], [-85, 28], [-80, 25], [-82, 28], [-100, 30], [-125, 40], [-170, 15]
    ]},
    // South America
    { name: "South America", coords: [
        [-80, 12], [-70, 12], [-35, -55], [-70, -55], [-80, -20], [-80, 12]
    ]},
    // Europe
    { name: "Europe", coords: [
        [-10, 36], [40, 36], [40, 71], [-10, 60], [-10, 36]
    ]},
    // Africa
    { name: "Africa", coords: [
        [-18, 35], [50, 35], [50, -35], [-18, -35], [-18, 35]
    ]},
    // Asia
    { name: "Asia", coords: [
        [40, 5], [145, 5], [145, 75], [40, 75], [40, 5]
    ]},
    // Australia
    { name: "Australia", coords: [
        [113, -10], [153, -10], [153, -43], [113, -43], [113, -10]
    ]}
];

function initISSWorldMap() {
    worldMapCanvas = document.getElementById('world-map-canvas');
    if (!worldMapCanvas) {
        console.error('Map canvas not found');
        return;
    }

    worldMapCtx = worldMapCanvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Setup mouse interactions
    setupCanvasInteractions();
    
    // Setup control buttons
    setupMapControls();

    // Start tracking ISS on map
    if (CONFIG.ISS_LOCATION_ENABLED && typeof issTracker !== 'undefined') {
        issTracker.startTracking((position) => {
            if (position) {
                updateISSOnMap(position);
            }
        }, 5000); // Update every 5 seconds
    }
    
    // Fallback: Use simulated ISS position if API is blocked
    // This ensures the map demo works even without API access
    if (!issPosition.lat && !issPosition.lon) {
        simulateISSPosition();
        setInterval(simulateISSPosition, 5000);
    }

    // Start animation loop
    animateWorldMap();

    console.log('🗺️ Interactive ISS World Map initialized!');
}

// Simulate ISS orbital motion for demo purposes
let simulatedTime = 0;
function simulateISSPosition() {
    // ISS orbital period is ~92 minutes (5520 seconds)
    // Simulate orbital motion
    simulatedTime += 5; // 5 seconds increment
    const orbitalProgress = (simulatedTime % 5520) / 5520;
    
    // Simulate orbit with inclination of ~51.6 degrees
    const lon = (orbitalProgress * 360 - 180); // Full circle around Earth
    const lat = Math.sin(orbitalProgress * Math.PI * 2) * 51.6; // Oscillate between -51.6 and +51.6
    
    const simulatedPosition = {
        latitude: lat,
        longitude: lon,
        timestamp: Date.now() / 1000
    };
    
    updateISSOnMap(simulatedPosition);
    
    // Update tracker for consistency
    if (typeof issTracker !== 'undefined') {
        issTracker.currentPosition = simulatedPosition;
    }
}

function resizeCanvas() {
    if (!worldMapCanvas) return;
    const container = worldMapCanvas.parentElement;
    worldMapCanvas.width = container.clientWidth;
    worldMapCanvas.height = container.clientHeight;
}

function latLonToXY(lat, lon) {
    // Simple equirectangular projection
    const width = worldMapCanvas.width;
    const height = worldMapCanvas.height;
    
    const x = ((lon + 180) / 360) * width * mapZoom + mapOffsetX;
    const y = ((90 - lat) / 180) * height * mapZoom + mapOffsetY;
    
    return { x, y };
}

function xyToLatLon(x, y) {
    const width = worldMapCanvas.width;
    const height = worldMapCanvas.height;
    
    const lon = ((x - mapOffsetX) / (width * mapZoom)) * 360 - 180;
    const lat = 90 - ((y - mapOffsetY) / (height * mapZoom)) * 180;
    
    return { lat, lon };
}

function drawWorldMap() {
    if (!worldMapCtx) return;
    
    const ctx = worldMapCtx;
    const width = worldMapCanvas.width;
    const height = worldMapCanvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a2332';
    ctx.fillRect(0, 0, width, height);
    
    // Draw ocean
    ctx.fillStyle = '#2c3e5a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    if (showGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        
        // Latitude lines
        for (let lat = -90; lat <= 90; lat += 15) {
            ctx.beginPath();
            for (let lon = -180; lon <= 180; lon += 5) {
                const point = latLonToXY(lat, lon);
                if (lon === -180) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        }
        
        // Longitude lines
        for (let lon = -180; lon <= 180; lon += 15) {
            ctx.beginPath();
            for (let lat = -90; lat <= 90; lat += 5) {
                const point = latLonToXY(lat, lon);
                if (lat === -90) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        }
        
        // Equator
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 5) {
            const point = latLonToXY(0, lon);
            if (lon === -180) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
    }
    
    // Draw continents
    ctx.fillStyle = '#4a7c59';
    ctx.strokeStyle = '#2d4a38';
    ctx.lineWidth = 2;
    
    worldContinents.forEach(continent => {
        ctx.beginPath();
        continent.coords.forEach((coord, i) => {
            const point = latLonToXY(coord[1], coord[0]);
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });
    
    // Draw orbital path
    if (showPath && pathCoordinates.length > 1) {
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        pathCoordinates.forEach((coord, i) => {
            const point = latLonToXY(coord.lat, coord.lon);
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }
    
    // Draw ISS
    if (issPosition) {
        const issPoint = latLonToXY(issPosition.lat, issPosition.lon);
        
        // Draw glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffd700';
        
        // Draw ISS icon
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛰️', issPoint.x, issPoint.y);
        
        ctx.shadowBlur = 0;
        
        // Draw pulse circle
        const time = Date.now() / 1000;
        const pulseRadius = 15 + Math.sin(time * 2) * 5;
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(time * 2) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(issPoint.x, issPoint.y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function animateWorldMap() {
    drawWorldMap();
    requestAnimationFrame(animateWorldMap);
}

function updateISSOnMap(position) {
    if (!position) return;

    issPosition = {
        lat: position.latitude,
        lon: position.longitude
    };

    // Update info panel
    const mapLatElement = document.getElementById('map-lat');
    const mapLonElement = document.getElementById('map-lon');
    
    if (mapLatElement && mapLonElement) {
        mapLatElement.textContent = `Latitude: ${issPosition.lat.toFixed(4)}°`;
        mapLonElement.textContent = `Longitude: ${issPosition.lon.toFixed(4)}°`;
    }

    // Add to path
    pathCoordinates.push({ lat: issPosition.lat, lon: issPosition.lon });
    
    // Keep only last 50 points to avoid performance issues
    if (pathCoordinates.length > 50) {
        pathCoordinates.shift();
    }
}

function setupCanvasInteractions() {
    if (!worldMapCanvas) return;
    
    const tooltip = document.getElementById('map-tooltip');
    
    // Mouse move for tooltip
    worldMapCanvas.addEventListener('mousemove', (e) => {
        const rect = worldMapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const issPoint = latLonToXY(issPosition.lat, issPosition.lon);
        const dist = Math.sqrt(Math.pow(x - issPoint.x, 2) + Math.pow(y - issPoint.y, 2));
        
        if (dist < 30) {
            const timestamp = issTracker.currentPosition ? new Date(issTracker.currentPosition.timestamp * 1000).toLocaleTimeString() : 'N/A';
            tooltip.innerHTML = `
                <h4>🛰️ ISS Position</h4>
                <p><strong>Lat:</strong> ${issPosition.lat.toFixed(4)}°</p>
                <p><strong>Lon:</strong> ${issPosition.lon.toFixed(4)}°</p>
                <p><strong>Alt:</strong> ~408 km</p>
                <p><strong>Speed:</strong> 27,600 km/h</p>
                <p style="font-size: 0.8em; opacity: 0.8;">Updated: ${timestamp}</p>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        } else {
            tooltip.style.display = 'none';
        }
        
        // Handle dragging
        if (isMapDragging) {
            mapOffsetX += e.clientX - mapDragStart.x;
            mapOffsetY += e.clientY - mapDragStart.y;
            mapDragStart = { x: e.clientX, y: e.clientY };
        }
    });
    
    // Mouse down for dragging
    worldMapCanvas.addEventListener('mousedown', (e) => {
        isMapDragging = true;
        mapDragStart = { x: e.clientX, y: e.clientY };
    });
    
    // Mouse up to stop dragging
    worldMapCanvas.addEventListener('mouseup', () => {
        isMapDragging = false;
    });
    
    worldMapCanvas.addEventListener('mouseleave', () => {
        isMapDragging = false;
        if (tooltip) tooltip.style.display = 'none';
    });
    
    // Double click to center on ISS
    worldMapCanvas.addEventListener('dblclick', () => {
        centerOnISS();
    });
}

function setupMapControls() {
    // Center on ISS button
    const centerBtn = document.getElementById('center-iss-btn');
    if (centerBtn) {
        centerBtn.addEventListener('click', centerOnISS);
    }

    // Toggle path button
    const togglePathBtn = document.getElementById('toggle-path-btn');
    if (togglePathBtn) {
        togglePathBtn.addEventListener('click', () => {
            showPath = !showPath;
            togglePathBtn.textContent = showPath ? '🛰️ Hide Path' : '🛰️ Show Path';
        });
    }

    // Toggle grid button
    const toggleLayerBtn = document.getElementById('toggle-layer-btn');
    if (toggleLayerBtn) {
        toggleLayerBtn.addEventListener('click', () => {
            showGrid = !showGrid;
            toggleLayerBtn.textContent = showGrid ? '🗺️ Hide Grid' : '🗺️ Show Grid';
        });
    }
    
    // Zoom in button
    const zoomInBtn = document.getElementById('zoom-in-btn');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            mapZoom = Math.min(mapZoom * 1.2, 5);
        });
    }
    
    // Zoom out button
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            mapZoom = Math.max(mapZoom / 1.2, 0.5);
        });
    }
}

function centerOnISS() {
    if (!issPosition) return;
    const issPoint = latLonToXY(issPosition.lat, issPosition.lon);
    mapOffsetX = worldMapCanvas.width / 2 - ((issPosition.lon + 180) / 360) * worldMapCanvas.width * mapZoom;
    mapOffsetY = worldMapCanvas.height / 2 - ((90 - issPosition.lat) / 180) * worldMapCanvas.height * mapZoom;
}
