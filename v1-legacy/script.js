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
        link: 'https://earthobservatory.nasa.gov/topic/fires',
        coords: [37.0, -119.0] // California
    },
    hurricane: {
        title: 'Hurricane Tracking: Atlantic Basin',
        description: 'ISS cameras capture high-resolution images of developing hurricanes, helping meteorologists predict storm paths and intensity. These observations are critical for early warning systems and evacuation planning.',
        data: 'Wind speed: 140 mph | Category: 4 | Diameter: 350 miles | Movement: 15 mph NW',
        link: 'https://earthobservatory.nasa.gov/topic/severe-storms',
        coords: [25.0, -70.0] // Atlantic
    },
    deforestation: {
        title: 'Deforestation Monitoring: Amazon Basin',
        description: 'Regular ISS photography tracks deforestation patterns in critical rainforest regions. This data helps environmental agencies monitor illegal logging and assess the impact on global climate systems.',
        data: 'Area deforested: 2,500 sq km/year | Forest coverage change: -3.2% | CO2 impact: significant',
        link: 'https://earthobservatory.nasa.gov/topic/land',
        coords: [-3.0, -60.0] // Amazon
    }
};

// Initialize Cupola Globe Map with POI markers
let cupolaGlobe = null;

function initCupolaGlobe() {
    const globeContainer = document.getElementById('cupola-globe-map');
    if (!globeContainer) return;

    // Initialize Leaflet map for cupola view
    cupolaGlobe = L.map('cupola-globe-map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        minZoom: 2,
        maxZoom: 6,
        dragging: true,
        scrollWheelZoom: false
    });

    // Add satellite imagery for realistic Earth view
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    }).addTo(cupolaGlobe);

    // Add POI markers to the globe
    Object.keys(poiData).forEach(poiKey => {
        const poi = poiData[poiKey];
        const poiIcon = L.divIcon({
            html: '<div class="poi-globe-marker"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            className: ''
        });

        const marker = L.marker(poi.coords, { icon: poiIcon }).addTo(cupolaGlobe);
        
        // Add click event to show POI panel
        marker.on('click', () => {
            showPOIPanel(poiKey);
        });
        
        // Add tooltip
        marker.bindTooltip(poi.title.split(':')[0], {
            permanent: false,
            direction: 'top'
        });
    });

    console.log('🌍 Cupola Globe initialized with real Earth imagery!');
}

// ============================================
// ISS Timeline Functionality
// ============================================

let currentOrbitIndex = 0;
let orbitScheduleData = [];
const ORBIT_PERIOD = 92.68; // ISS orbital period in minutes

function initISSTimeline() {
    // Generate orbit schedule for today (16 orbits)
    generateOrbitSchedule();
    
    // Update timeline displays
    updateTimelineDisplay();
    
    // Setup timeline controls
    setupTimelineControls();
    
    // Update every second
    setInterval(updateTimelineDisplay, 1000);
    
    console.log('⏰ ISS Timeline initialized!');
}

function generateOrbitSchedule() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    
    orbitScheduleData = [];
    let orbitTime = new Date(startOfDay);
    
    // Generate approximately 16 orbits for today
    for (let i = 1; i <= 16; i++) {
        const orbitStart = new Date(orbitTime);
        const orbitEnd = new Date(orbitTime.getTime() + ORBIT_PERIOD * 60000);
        const sunriseTime = new Date(orbitTime.getTime() + (ORBIT_PERIOD / 2) * 60000);
        const sunsetTime = new Date(orbitEnd);
        
        orbitScheduleData.push({
            number: i,
            startTime: orbitStart,
            endTime: orbitEnd,
            sunriseTime: sunriseTime,
            sunsetTime: sunsetTime,
            completed: orbitEnd < now
        });
        
        orbitTime = orbitEnd;
    }
    
    // Find current orbit
    currentOrbitIndex = orbitScheduleData.findIndex(orbit => 
        now >= orbit.startTime && now <= orbit.endTime
    );
    
    if (currentOrbitIndex === -1) {
        currentOrbitIndex = orbitScheduleData.length - 1;
    }
    
    // Render orbit schedule
    renderOrbitSchedule();
}

function renderOrbitSchedule() {
    const scheduleContainer = document.getElementById('orbit-schedule');
    if (!scheduleContainer) return;
    
    const now = new Date();
    
    scheduleContainer.innerHTML = orbitScheduleData.map((orbit, index) => {
        const isActive = index === currentOrbitIndex;
        const statusClass = orbit.completed ? 'completed' : (isActive ? 'active' : '');
        
        return `
            <div class="orbit-item ${statusClass}" data-orbit="${index}">
                <div class="orbit-item-header">
                    <span class="orbit-number">Orbit #${orbit.number}</span>
                    <span class="orbit-time">${formatTime(orbit.startTime)} - ${formatTime(orbit.endTime)}</span>
                </div>
                <div class="orbit-details">
                    <span>🌅 ${formatTime(orbit.sunriseTime)}</span>
                    <span>🌇 ${formatTime(orbit.sunsetTime)}</span>
                    <span>${orbit.completed ? '✓ Completed' : (isActive ? '⚡ In Progress' : '⏳ Upcoming')}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to active orbit
    const activeOrbit = scheduleContainer.querySelector('.orbit-item.active');
    if (activeOrbit) {
        activeOrbit.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateTimelineDisplay() {
    const now = new Date();
    
    // Update current orbit if needed
    const newOrbitIndex = orbitScheduleData.findIndex(orbit => 
        now >= orbit.startTime && now <= orbit.endTime
    );
    
    if (newOrbitIndex !== -1 && newOrbitIndex !== currentOrbitIndex) {
        currentOrbitIndex = newOrbitIndex;
        renderOrbitSchedule();
    }
    
    if (currentOrbitIndex === -1 || currentOrbitIndex >= orbitScheduleData.length) return;
    
    const currentOrbit = orbitScheduleData[currentOrbitIndex];
    
    // Calculate orbit progress
    const orbitDuration = currentOrbit.endTime - currentOrbit.startTime;
    const orbitElapsed = now - currentOrbit.startTime;
    const orbitProgress = Math.max(0, Math.min(100, (orbitElapsed / orbitDuration) * 100));
    
    // Update circular progress
    const progressCircle = document.getElementById('orbit-progress-circle');
    const progressText = document.getElementById('orbit-percent');
    if (progressCircle && progressText) {
        const circumference = 565.48;
        const offset = circumference - (orbitProgress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = `${Math.round(orbitProgress)}%`;
    }
    
    // Update ISS icon position on orbit circle
    const issIcon = document.getElementById('iss-orbit-icon');
    if (issIcon) {
        const angle = (orbitProgress / 100) * 360;
        const radius = 90;
        const x = 100 + radius * Math.cos((angle - 90) * Math.PI / 180);
        const y = 100 + radius * Math.sin((angle - 90) * Math.PI / 180);
        issIcon.style.left = `${x}%`;
        issIcon.style.top = `${y}%`;
    }
    
    // Calculate time until next sunrise
    const sunriseElement = document.getElementById('timeline-sunrise');
    if (sunriseElement && currentOrbit.sunriseTime > now) {
        const timeToSunrise = currentOrbit.sunriseTime - now;
        sunriseElement.textContent = formatDuration(timeToSunrise);
    } else if (sunriseElement) {
        sunriseElement.textContent = 'Passed';
    }
    
    // Calculate time until next sunset
    const sunsetElement = document.getElementById('timeline-sunset');
    if (sunsetElement && currentOrbit.sunsetTime > now) {
        const timeToSunset = currentOrbit.sunsetTime - now;
        sunsetElement.textContent = formatDuration(timeToSunset);
    } else if (sunsetElement) {
        sunsetElement.textContent = 'Passed';
    }
    
    // Time elapsed in current orbit
    const elapsedElement = document.getElementById('timeline-elapsed');
    if (elapsedElement) {
        elapsedElement.textContent = formatDuration(orbitElapsed);
    }
    
    // Orbits completed today
    const orbitsElement = document.getElementById('timeline-orbits');
    if (orbitsElement) {
        const completedOrbits = orbitScheduleData.filter(o => o.completed).length;
        orbitsElement.textContent = `${completedOrbits} / 16`;
    }
}

function setupTimelineControls() {
    const prevBtn = document.getElementById('timeline-prev');
    const currentBtn = document.getElementById('timeline-current');
    const nextBtn = document.getElementById('timeline-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentOrbitIndex > 0) {
                currentOrbitIndex--;
                renderOrbitSchedule();
                updateTimelineDisplay();
            }
        });
    }
    
    if (currentBtn) {
        currentBtn.addEventListener('click', () => {
            const now = new Date();
            currentOrbitIndex = orbitScheduleData.findIndex(orbit => 
                now >= orbit.startTime && now <= orbit.endTime
            );
            if (currentOrbitIndex === -1) currentOrbitIndex = 0;
            renderOrbitSchedule();
            updateTimelineDisplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentOrbitIndex < orbitScheduleData.length - 1) {
                currentOrbitIndex++;
                renderOrbitSchedule();
                updateTimelineDisplay();
            }
        });
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showPOIPanel(poiType) {
    const data = poiData[poiType];
    const poiPanel = document.getElementById('poi-panel');
    
    if (data && poiPanel) {
        document.getElementById('poi-title').textContent = data.title;
        document.getElementById('poi-description').textContent = data.description;
        document.getElementById('poi-data').textContent = data.data;
        document.getElementById('poi-learn-more').href = data.link;
        
        // Simulate image carousel
        const poiImages = document.getElementById('poi-images');
        poiImages.innerHTML = '<p style="color: #999;">High-resolution ISS imagery</p>';
        
        poiPanel.classList.add('active');
        
        // Update with real data if available
        updatePOIWithRealData(poiType);
    }
}

// Close panel handlers
const poiPanel = document.getElementById('poi-panel');
const closePanel = document.querySelector('.close-panel');

if (closePanel) {
    closePanel.addEventListener('click', () => {
        poiPanel.classList.remove('active');
    });
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (poiPanel && poiPanel.classList.contains('active') && 
        !poiPanel.contains(e.target) && 
        !e.target.closest('.leaflet-marker-icon')) {
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
    
    // Initialize cupola globe with real Earth imagery
    initCupolaGlobe();
    
    // Initialize ISS timeline
    initISSTimeline();
    
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
// Interactive ISS World Map with Leaflet
// ============================================

let worldMap = null;
let issMarker = null;
let issPosition = { lat: 0, lon: 0 };
let pathCoordinates = [];
let pathPolyline = null;
let pathEndMarker = null; // Pulsing circle at the end of the path
let showPath = true;

function initISSWorldMap() {
    const mapContainer = document.getElementById('world-map-leaflet');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Initialize Leaflet map
    worldMap = L.map('world-map-leaflet', {
        center: [0, 0],
        zoom: 2,
        zoomControl: false, // We'll use custom controls
        minZoom: 2,
        maxZoom: 8
    });

    // Try multiple tile providers - fallback to offline if needed
    // Using Carto DB tiles which are more likely to work
    let tileLayerAdded = false;
    const tileProviders = [
        {
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            name: 'Carto Voyager'
        },
        {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            name: 'Carto Light'
        },
        {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            name: 'OpenStreetMap'
        }
    ];

    // Try to add the first tile layer
    const tileLayer = L.tileLayer(tileProviders[0].url, {
        attribution: tileProviders[0].attribution,
        maxZoom: 19
    }).addTo(worldMap);

    // Create custom ISS icon
    const issIcon = L.divIcon({
        html: '<div style="font-size: 32px; text-align: center; text-shadow: 0 0 10px #ffd700;">🛰️</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: 'iss-marker'
    });

    // Initialize ISS marker (initially hidden)
    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(worldMap);
    
    // Initialize path polyline
    pathPolyline = L.polyline([], {
        color: '#ffd700',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(worldMap);
    
    // Initialize path end marker (pulsing circle)
    const pathEndIcon = L.divIcon({
        html: '<div class="path-end-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: ''
    });
    pathEndMarker = L.marker([0, 0], { icon: pathEndIcon }).addTo(worldMap);
    
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

    console.log('🗺️ Interactive ISS World Map initialized with OpenStreetMap!');
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



function updateISSOnMap(position) {
    if (!position || !worldMap) return;

    issPosition = {
        lat: position.latitude,
        lon: position.longitude
    };

    // Update ISS marker position
    if (issMarker) {
        issMarker.setLatLng([issPosition.lat, issPosition.lon]);
        
        // Update popup content
        const timestamp = position.timestamp ? new Date(position.timestamp * 1000).toLocaleTimeString() : 'N/A';
        issMarker.bindPopup(`
            <div>
                <h4>🛰️ ISS Position</h4>
                <p><strong>Lat:</strong> ${issPosition.lat.toFixed(4)}°</p>
                <p><strong>Lon:</strong> ${issPosition.lon.toFixed(4)}°</p>
                <p><strong>Alt:</strong> ~408 km</p>
                <p><strong>Speed:</strong> 27,600 km/h</p>
                <p style="font-size: 0.8em; opacity: 0.8;">Updated: ${timestamp}</p>
            </div>
        `);
    }

    // Update info panel
    const mapLatElement = document.getElementById('map-lat');
    const mapLonElement = document.getElementById('map-lon');
    
    if (mapLatElement && mapLonElement) {
        mapLatElement.textContent = `Latitude: ${issPosition.lat.toFixed(4)}°`;
        mapLonElement.textContent = `Longitude: ${issPosition.lon.toFixed(4)}°`;
    }

    // Add to path
    pathCoordinates.push([issPosition.lat, issPosition.lon]);
    
    // Keep only last 50 points to avoid performance issues
    if (pathCoordinates.length > 50) {
        pathCoordinates.shift();
    }
    
    // Update path polyline
    if (pathPolyline && showPath) {
        pathPolyline.setLatLngs(pathCoordinates);
    }
    
    // Update path end marker to show at the latest position (end of path)
    if (pathEndMarker && pathCoordinates.length > 0) {
        const latestPosition = pathCoordinates[pathCoordinates.length - 1];
        pathEndMarker.setLatLng(latestPosition);
    }
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
            if (pathPolyline) {
                if (showPath) {
                    pathPolyline.addTo(worldMap);
                    if (pathEndMarker) pathEndMarker.addTo(worldMap);
                } else {
                    worldMap.removeLayer(pathPolyline);
                    if (pathEndMarker) worldMap.removeLayer(pathEndMarker);
                }
            }
            togglePathBtn.textContent = showPath ? '🛰️ Hide Path' : '🛰️ Show Path';
        });
    }

    // Toggle grid button - now toggles map type
    const toggleLayerBtn = document.getElementById('toggle-layer-btn');
    if (toggleLayerBtn) {
        let isStreetView = true;
        toggleLayerBtn.textContent = '🛰️ Satellite View';
        
        // Store tile layers - using CartoDB and Esri
        let streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        });
        
        let satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });
        
        streetLayer.addTo(worldMap);
        
        toggleLayerBtn.addEventListener('click', () => {
            if (isStreetView) {
                worldMap.removeLayer(streetLayer);
                satelliteLayer.addTo(worldMap);
                toggleLayerBtn.textContent = '🗺️ Street View';
            } else {
                worldMap.removeLayer(satelliteLayer);
                streetLayer.addTo(worldMap);
                toggleLayerBtn.textContent = '🛰️ Satellite View';
            }
            isStreetView = !isStreetView;
        });
    }
    
    // Zoom in button
    const zoomInBtn = document.getElementById('zoom-in-btn');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (worldMap) {
                worldMap.zoomIn();
            }
        });
    }
    
    // Zoom out button
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (worldMap) {
                worldMap.zoomOut();
            }
        });
    }
}

function centerOnISS() {
    if (!issPosition || !worldMap) return;
    worldMap.setView([issPosition.lat, issPosition.lon], 4, {
        animate: true,
        duration: 1
    });
}

// ============================================
// THEME SWITCHER
// ============================================

const themes = ['night', 'ocean', 'sunset'];
let currentThemeIndex = 0;

// Load saved theme or default to night (default)
const savedTheme = localStorage.getItem('orbitalTheme') || 'night';
currentThemeIndex = themes.indexOf(savedTheme);
if (currentThemeIndex === -1) currentThemeIndex = 0;

// Apply theme on load
function applyTheme(theme) {
    if (theme === 'night') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('orbitalTheme', theme);
}

// Initialize theme
applyTheme(themes[currentThemeIndex]);

// Theme button handler
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        applyTheme(newTheme);
        
        // Visual feedback
        const themeNames = {
            'night': 'Night',
            'ocean': 'Ocean',
            'sunset': 'Sunset'
        };
        themeBtn.textContent = '�� ' + themeNames[newTheme];
        
        setTimeout(() => {
            themeBtn.textContent = '🎨';
        }, 1500);
    });
}

// ============================================
// FIX: POI OVERLAY FUNCTIONALITY
// ============================================

// The issue was that the POI panel needs proper event handling
// This fix ensures the panel closes correctly and reopens properly

const poiPanelElement = document.getElementById('poi-panel');
const closePanelBtn = document.querySelector('.close-panel');

// Ensure close button works
if (closePanelBtn && poiPanelElement) {
    closePanelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        poiPanelElement.classList.remove('active');
    });
}

// Fix: Prevent panel from closing when clicking inside it
if (poiPanelElement) {
    poiPanelElement.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Enhanced showPOIPanel to ensure proper display
const originalShowPOIPanel = window.showPOIPanel || showPOIPanel;
window.showPOIPanel = function(poiType) {
    // Call original function
    if (originalShowPOIPanel) {
        originalShowPOIPanel(poiType);
    }
    
    // Ensure panel is visible and properly positioned
    const panel = document.getElementById('poi-panel');
    if (panel) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            panel.classList.add('active');
            panel.style.display = 'block';
        }, 10);
    }
};

console.log('✅ Theme switcher initialized!');
console.log('✅ POI overlay functionality fixed!');

// ============================================
// DOCKING CHALLENGE GAME
// ============================================

const dockingBtn = document.getElementById('start-docking-btn');
const dockingCanvas = document.getElementById('docking-challenge-canvas');
const dockingInstructions = document.getElementById('docking-instructions');
const dockingStatus = document.getElementById('docking-status');

if (dockingBtn && dockingCanvas) {
    let gameActive = false;
    let spacecraft = { x: 100, y: 300, vx: 0, vy: 0, angle: 0, vAngle: 0 };
    let iss = { x: 500, y: 200 };
    let animationId = null;

    dockingBtn.addEventListener('click', () => {
        if (!gameActive) {
            gameActive = true;
            dockingBtn.textContent = 'Reset';
            dockingCanvas.style.display = 'block';
            dockingInstructions.style.display = 'block';
            spacecraft = { x: 100, y: 300, vx: 0, vy: 0, angle: 0, vAngle: 0 };
            startDockingGame();
        } else {
            gameActive = false;
            dockingBtn.textContent = 'Play Now';
            dockingCanvas.style.display = 'none';
            dockingInstructions.style.display = 'none';
            dockingStatus.textContent = '';
            if (animationId) cancelAnimationFrame(animationId);
        }
    });

    function startDockingGame() {
        const ctx = dockingCanvas.getContext('2d');
        const keys = {};

        document.addEventListener('keydown', (e) => {
            if (gameActive) keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            if (gameActive) keys[e.key] = false;
        });

        function update() {
            if (!gameActive) return;

            // Handle controls
            if (keys['ArrowUp']) {
                const thrust = 0.2;
                spacecraft.vx += Math.cos(spacecraft.angle) * thrust;
                spacecraft.vy += Math.sin(spacecraft.angle) * thrust;
            }
            if (keys['ArrowLeft']) spacecraft.vAngle -= 0.05;
            if (keys['ArrowRight']) spacecraft.vAngle += 0.05;

            // Apply friction
            spacecraft.vx *= 0.99;
            spacecraft.vy *= 0.99;
            spacecraft.vAngle *= 0.95;

            // Update position
            spacecraft.x += spacecraft.vx;
            spacecraft.y += spacecraft.vy;
            spacecraft.angle += spacecraft.vAngle;

            // Boundaries
            spacecraft.x = Math.max(20, Math.min(580, spacecraft.x));
            spacecraft.y = Math.max(20, Math.min(380, spacecraft.y));

            // Check docking
            const dx = spacecraft.x - iss.x;
            const dy = spacecraft.y - iss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30 && Math.abs(spacecraft.vx) < 0.5 && Math.abs(spacecraft.vy) < 0.5) {
                dockingStatus.textContent = '🎉 Successful Docking!';
                dockingStatus.style.color = '#4ade80';
                gameActive = false;
                setTimeout(() => {
                    dockingBtn.textContent = 'Play Again';
                }, 1000);
            } else if (distance < 50) {
                dockingStatus.textContent = 'Approaching... Slow down!';
                dockingStatus.style.color = '#fbbf24';
            } else {
                dockingStatus.textContent = `Distance: ${Math.floor(distance)}m`;
                dockingStatus.style.color = 'var(--text)';
            }

            draw(ctx);
            if (gameActive) animationId = requestAnimationFrame(update);
        }

        function draw(ctx) {
            // Clear canvas
            ctx.fillStyle = '#000814';
            ctx.fillRect(0, 0, 600, 400);

            // Draw stars
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 50; i++) {
                const x = (i * 123) % 600;
                const y = (i * 456) % 400;
                ctx.fillRect(x, y, 2, 2);
            }

            // Draw ISS
            ctx.save();
            ctx.translate(iss.x, iss.y);
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(-25, -15, 50, 30);
            ctx.fillStyle = '#999999';
            ctx.fillRect(-30, -5, 10, 10);
            ctx.fillRect(20, -5, 10, 10);
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Draw spacecraft
            ctx.save();
            ctx.translate(spacecraft.x, spacecraft.y);
            ctx.rotate(spacecraft.angle);
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-10, -10);
            ctx.lineTo(-10, 10);
            ctx.closePath();
            ctx.fill();
            // Thrust indicator
            if (keys['ArrowUp']) {
                ctx.fillStyle = '#ff6b6b';
                ctx.fillRect(-15, -3, 8, 6);
            }
            ctx.restore();
        }

        update();
    }
}

// ============================================
// MINI BUOYANCY GAME
// ============================================

const buoyancyBtn = document.getElementById('start-buoyancy-btn');
const buoyancyGame = document.getElementById('buoyancy-game');
const miniAstronaut = document.getElementById('mini-astronaut');
const miniSlider = document.getElementById('mini-buoyancy-slider');

if (buoyancyBtn && buoyancyGame && miniAstronaut && miniSlider) {
    let buoyancyActive = false;

    buoyancyBtn.addEventListener('click', () => {
        buoyancyActive = !buoyancyActive;
        if (buoyancyActive) {
            buoyancyBtn.textContent = 'Stop Training';
            buoyancyGame.style.display = 'block';
        } else {
            buoyancyBtn.textContent = 'Start Training';
            buoyancyGame.style.display = 'none';
        }
    });

    miniSlider.addEventListener('input', (e) => {
        if (buoyancyActive) {
            const value = e.target.value;
            const topPosition = 80 - (value * 0.6); // Map 0-100 to 80-20
            miniAstronaut.style.top = `${topPosition}%`;
        }
    });
}

console.log('✅ Docking Challenge and Buoyancy games initialized!');

// ============================================
// ENHANCED DOCKING CHALLENGE GAME
// ============================================

// User Profile and Reward System
let userProfile = {
    score: 0,
    badges: [],
    completedTasks: {
        nbl: false,
        cupola: false,
        docking: false,
        earthObserver: false
    }
};

// Enhanced Docking Game
let enhancedDockingGame = {
    canvas: null,
    ctx: null,
    isRunning: false,
    spacecraft: {
        x: 100,
        y: 350,
        angle: -Math.PI / 2,
        velocityX: 0,
        velocityY: 0,
        angularVelocity: 0
    },
    iss: {
        x: 500,
        y: 100,
        angle: 0,
        dockingPortRadius: 15
    },
    keys: {},
    lastTime: 0
};

// Badge notification system
function showBadgeNotification(badgeName, icon) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        color: #e5e7eb;
        padding: 1rem;
        border-radius: 8px;
        border: 2px solid #10b981;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'VT323', monospace;
        font-size: 1.2rem;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">${icon}</span>
            <span>Badge Earned: ${badgeName}!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function addBadge(badgeName, icon) {
    if (!userProfile.badges.find(b => b.name === badgeName)) {
        userProfile.badges.push({ name: badgeName, icon: icon });
        showBadgeNotification(badgeName, icon);
    }
}

function addPoints(points) {
    userProfile.score += points;
    console.log(`Points added: +${points}. Total score: ${userProfile.score}`);
}

function initEnhancedDockingGame() {
    enhancedDockingGame.canvas = document.getElementById('docking-challenge-canvas');
    if (!enhancedDockingGame.canvas) return;
    
    enhancedDockingGame.ctx = enhancedDockingGame.canvas.getContext('2d');
    
    // Reset spacecraft position
    enhancedDockingGame.spacecraft = {
        x: 100,
        y: 350,
        angle: -Math.PI / 2,
        velocityX: 0,
        velocityY: 0,
        angularVelocity: 0
    };
    
    // Start enhanced game loop
    enhancedDockingGame.isRunning = true;
    enhancedDockingGame.lastTime = performance.now();
    requestAnimationFrame(updateEnhancedDockingGame);
    
    // Setup keyboard controls
    document.addEventListener('keydown', handleEnhancedDockingKeyDown);
    document.addEventListener('keyup', handleEnhancedDockingKeyUp);
}

function handleEnhancedDockingKeyDown(e) {
    if (!enhancedDockingGame.isRunning) return;
    enhancedDockingGame.keys[e.key] = true;
}

function handleEnhancedDockingKeyUp(e) {
    if (!enhancedDockingGame.isRunning) return;
    enhancedDockingGame.keys[e.key] = false;
}

function updateEnhancedDockingGame(currentTime) {
    if (!enhancedDockingGame.isRunning) return;
    
    const deltaTime = (currentTime - enhancedDockingGame.lastTime) / 1000;
    enhancedDockingGame.lastTime = currentTime;
    
    const ship = enhancedDockingGame.spacecraft;
    
    // Apply controls
    const thrustPower = 80;
    const rotationSpeed = 3;
    
    if (enhancedDockingGame.keys['ArrowUp']) {
        ship.velocityX += Math.cos(ship.angle) * thrustPower * deltaTime;
        ship.velocityY += Math.sin(ship.angle) * thrustPower * deltaTime;
    }
    
    if (enhancedDockingGame.keys['ArrowLeft']) {
        ship.angularVelocity = -rotationSpeed;
    } else if (enhancedDockingGame.keys['ArrowRight']) {
        ship.angularVelocity = rotationSpeed;
    } else {
        ship.angularVelocity = 0;
    }
    
    // Update position and rotation
    ship.angle += ship.angularVelocity * deltaTime;
    ship.x += ship.velocityX * deltaTime;
    ship.y += ship.velocityY * deltaTime;
    
    // Apply drag
    ship.velocityX *= 0.995;
    ship.velocityY *= 0.995;
    
    // Keep in bounds
    ship.x = Math.max(20, Math.min(580, ship.x));
    ship.y = Math.max(20, Math.min(380, ship.y));
    
    // Check enhanced docking
    checkEnhancedDocking();
    
    // Render
    renderEnhancedDockingGame();
    
    requestAnimationFrame(updateEnhancedDockingGame);
}

function renderEnhancedDockingGame() {
    const ctx = enhancedDockingGame.ctx;
    const ship = enhancedDockingGame.spacecraft;
    const iss = enhancedDockingGame.iss;
    
    // Clear canvas with space background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, 600, 400);
    
    // Draw enhanced starfield
    ctx.fillStyle = 'white';
    for (let i = 0; i < 80; i++) {
        const x = (i * 73) % 600;
        const y = (i * 97) % 400;
        const size = (i % 3) + 1;
        ctx.fillRect(x, y, size, size);
    }
    
    // Draw enhanced ISS
    ctx.save();
    ctx.translate(iss.x, iss.y);
    ctx.rotate(iss.angle);
    
    // ISS main body
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(-50, -25, 100, 50);
    
    // Solar panels
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-90, -20, 35, 40);
    ctx.fillRect(55, -20, 35, 40);
    
    // Module details
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(-40, -15, 80, 30);
    
    // Enhanced docking port
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 30, iss.dockingPortRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Docking port ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 30, iss.dockingPortRadius + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
    
    // Draw enhanced spacecraft
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Spacecraft body
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-12, 15);
    ctx.lineTo(12, 15);
    ctx.closePath();
    ctx.fill();
    
    // Spacecraft details
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(-8, -10, 16, 20);
    
    // Enhanced thruster effect
    if (enhancedDockingGame.keys['ArrowUp']) {
        const thrusterLength = 15 + Math.random() * 10;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(-6, 15);
        ctx.lineTo(0, 15 + thrusterLength);
        ctx.lineTo(6, 15);
        ctx.closePath();
        ctx.fill();
        
        // Inner flame
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-3, 15);
        ctx.lineTo(0, 15 + thrusterLength * 0.7);
        ctx.lineTo(3, 15);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
    
    // Enhanced UI
    const speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    const distance = Math.sqrt((ship.x - iss.x) ** 2 + (ship.y - (iss.y + 30)) ** 2);
    
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '16px VT323, monospace';
    ctx.fillText(`Speed: ${speed.toFixed(1)} m/s`, 10, 25);
    ctx.fillText(`Distance: ${distance.toFixed(1)} m`, 10, 45);
    
    // Alignment indicator
    const targetAngle = -Math.PI / 2;
    const angleDiff = Math.abs(ship.angle - targetAngle);
    const alignmentStatus = angleDiff < 0.3 ? '✓ ALIGNED' : '⚠ MISALIGNED';
    ctx.fillStyle = angleDiff < 0.3 ? '#10b981' : '#f59e0b';
    ctx.fillText(alignmentStatus, 10, 65);
}

function checkEnhancedDocking() {
    const ship = enhancedDockingGame.spacecraft;
    const iss = enhancedDockingGame.iss;
    
    // Calculate docking port position
    const portX = iss.x;
    const portY = iss.y + 30;
    
    // Distance to docking port
    const dx = ship.x - portX;
    const dy = ship.y - portY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate speed
    const speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    
    // Check alignment
    const targetAngle = -Math.PI / 2;
    const angleDiff = Math.abs(ship.angle - targetAngle);
    
    const statusElement = document.getElementById('docking-status');
    
    if (distance < 35) {
        if (speed < 20 && angleDiff < 0.3) {
            // Successful docking!
            enhancedDockingGame.isRunning = false;
            statusElement.textContent = '🎉 Perfect Docking Achieved!';
            statusElement.style.color = '#10b981';
            
            // Award enhanced rewards
            if (!userProfile.completedTasks.docking) {
                addPoints(150);
                addBadge('Elite Docking Specialist', '🎯');
                userProfile.completedTasks.docking = true;
            } else {
                addPoints(75);
            }
            
            setTimeout(() => {
                resetEnhancedDockingGame();
            }, 3000);
        } else if (speed >= 20) {
            // Collision
            enhancedDockingGame.isRunning = false;
            statusElement.textContent = '💥 Collision! Reduce approach speed.';
            statusElement.style.color = '#ef4444';
            
            setTimeout(() => {
                resetEnhancedDockingGame();
            }, 2500);
        } else if (angleDiff >= 0.3) {
            statusElement.textContent = '⚠️ Alignment error! Point spacecraft upward.';
            statusElement.style.color = '#f59e0b';
        }
    } else if (distance < 100) {
        statusElement.textContent = '🎯 Approaching docking port...';
        statusElement.style.color = '#3b82f6';
    } else {
        statusElement.textContent = '';
    }
}

function resetEnhancedDockingGame() {
    const statusElement = document.getElementById('docking-status');
    statusElement.textContent = '';
    
    const canvas = document.getElementById('docking-challenge-canvas');
    canvas.style.display = 'none';
    
    const instructions = document.getElementById('docking-instructions');
    instructions.style.display = 'none';
    
    const startBtn = document.getElementById('start-docking-btn');
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Launch Enhanced Mission';
    
    // Remove event listeners
    document.removeEventListener('keydown', handleEnhancedDockingKeyDown);
    document.removeEventListener('keyup', handleEnhancedDockingKeyUp);
}

// Override the original docking game button with enhanced version
document.addEventListener('DOMContentLoaded', () => {
    const originalStartBtn = document.getElementById('start-docking-btn');
    if (originalStartBtn) {
        // Remove any existing event listeners
        const newBtn = originalStartBtn.cloneNode(true);
        originalStartBtn.parentNode.replaceChild(newBtn, originalStartBtn);
        
        newBtn.textContent = 'Launch Enhanced Mission';
        newBtn.addEventListener('click', () => {
            newBtn.style.display = 'none';
            document.getElementById('docking-challenge-canvas').style.display = 'block';
            document.getElementById('docking-instructions').style.display = 'block';
            document.getElementById('docking-instructions').innerHTML = `
                <h4>🚀 Enhanced Docking Challenge</h4>
                <p><strong>↑ Up Arrow:</strong> Primary thrusters</p>
                <p><strong>← → Arrows:</strong> Rotation control</p>
                <p><strong>Mission:</strong> Dock with ISS docking port (golden circle)</p>
                <p><strong>Requirements:</strong> Speed < 20 m/s, Proper alignment</p>
                <p><em>Precision and patience are key to success!</em></p>
            `;
            initEnhancedDockingGame();
        });
    }
});

// Export enhanced game functions
window.enhancedGameRewards = {
    addPoints: addPoints,
    addBadge: addBadge,
    userProfile: userProfile
};
