/**
 * Cupola Mission Manager
 * Handles the immersive ISS Cupola experience with citizen science photography missions
 */

// Mission Manager Object
const missionManager = {
    currentMission: null,
    issPosition: null,
    targetRange: 500, // km - range to activate capture
    missionActive: false,
    captureEnabled: false,
    
    // Initialize the mission manager
    init: function() {
        console.log('🎯 Mission Manager initialized');
        this.setupEventListeners();
        this.handleLiveStream();
        this.startMission();
        this.trackISSPosition();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Mission patch selector
        const patchOptions = document.querySelectorAll('input[name="mission-patch"]');
        patchOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.updateMissionPatch(e.target.value);
            });
        });
        
        // Capture photo button
        const captureBtn = document.getElementById('capture-photo-btn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                if (this.captureEnabled) {
                    this.capturePhoto();
                }
            });
        }
        
        // Modal close button
        const modalCloseBtn = document.getElementById('modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal on background click
        const modal = document.getElementById('photo-capture-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    },
    
    // Handle live stream and fallback
    handleLiveStream: function() {
        const iframe = document.getElementById('live-earth-feed');
        const fallbackVideo = document.getElementById('fallback-earth-video');
        
        if (!iframe || !fallbackVideo) return;
        
        // Check iframe load status
        let loadTimeout = setTimeout(() => {
            console.log('⚠️ HDEV stream taking time to load, keeping iframe visible');
            // We'll keep the iframe visible as it might still load
            // The fallback will only show if iframe explicitly fails
        }, 10000);
        
        iframe.addEventListener('load', () => {
            clearTimeout(loadTimeout);
            console.log('✅ HDEV stream loaded successfully');
        });
        
        iframe.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            console.log('⚠️ HDEV stream failed, showing fallback video');
            iframe.style.display = 'none';
            fallbackVideo.style.display = 'block';
        });
        
        // Listen for iframe communication (if HDEV sends messages)
        window.addEventListener('message', (e) => {
            if (e.data === 'hdev-offline') {
                iframe.style.display = 'none';
                fallbackVideo.style.display = 'block';
            }
        });
    },
    
    // Update mission patch display
    updateMissionPatch: function(patchValue) {
        const patchImg = document.getElementById('selected-patch-img');
        const patchSources = {
            'expedition-70': 'https://www.nasa.gov/wp-content/uploads/2023/03/iss070-s-001.png',
            'expedition-71': 'https://www.nasa.gov/wp-content/uploads/2024/05/iss071-s-001.png',
            'artemis': 'https://www.nasa.gov/wp-content/uploads/2023/03/artemis-i-mission-patch.png',
            'crew-8': 'https://www.nasa.gov/wp-content/uploads/2023/11/crew-8-patch.png'
        };
        
        if (patchImg && patchSources[patchValue]) {
            patchImg.src = patchSources[patchValue];
        }
    },
    
    // Start a new mission
    startMission: async function() {
        console.log('🚀 Starting new photography mission...');
        
        try {
            // Fetch active events from EONET API
            const eonetApi = new EONETApi();
            const events = await eonetApi.getEvents(null, 20);
            
            if (events.length === 0) {
                console.log('⚠️ No active events, using fallback mission');
                this.useFallbackMission();
                return;
            }
            
            // Select a random event with valid coordinates
            let selectedEvent = null;
            let attempts = 0;
            
            while (!selectedEvent && attempts < events.length) {
                const randomEvent = events[Math.floor(Math.random() * events.length)];
                
                // Check if event has valid geometry
                if (randomEvent.geometry && randomEvent.geometry.length > 0) {
                    const coords = randomEvent.geometry[0].coordinates;
                    if (coords && coords.length >= 2) {
                        selectedEvent = randomEvent;
                        break;
                    }
                }
                attempts++;
            }
            
            if (!selectedEvent) {
                console.log('⚠️ No events with valid coordinates, using fallback');
                this.useFallbackMission();
                return;
            }
            
            // Set up mission with the selected event
            const coords = selectedEvent.geometry[0].coordinates;
            this.currentMission = {
                id: selectedEvent.id,
                title: selectedEvent.title,
                category: selectedEvent.categories[0].title,
                target: {
                    lat: coords[1], // GeoJSON is [lon, lat]
                    lon: coords[0]
                },
                description: `Monitor and photograph ${selectedEvent.categories[0].title.toLowerCase()} event: ${selectedEvent.title}`,
                scientificValue: this.getScientificValue(selectedEvent.categories[0].title)
            };
            
            this.missionActive = true;
            this.updateMissionDisplay();
            
            console.log('✅ Mission started:', this.currentMission.title);
            
        } catch (error) {
            console.error('Error fetching mission from EONET:', error);
            this.useFallbackMission();
        }
    },
    
    // Fallback mission if EONET fails
    useFallbackMission: function() {
        const fallbackMissions = [
            {
                id: 'fallback-1',
                title: 'California Wildfire Complex',
                category: 'Wildfires',
                target: { lat: 37.0, lon: -119.0 },
                description: 'Monitor and photograph wildfire activity in California',
                scientificValue: 'Your images help scientists track fire spread patterns and assess the impact on air quality and ecosystems. This data is critical for disaster response and climate research.'
            },
            {
                id: 'fallback-2',
                title: 'Atlantic Hurricane Formation',
                category: 'Severe Storms',
                target: { lat: 25.0, lon: -70.0 },
                description: 'Monitor and photograph tropical storm development in the Atlantic',
                scientificValue: 'Your photography provides valuable data for meteorologists to predict storm intensity and path, helping coastal communities prepare for potential impacts.'
            },
            {
                id: 'fallback-3',
                title: 'Amazon Deforestation',
                category: 'Deforestation',
                target: { lat: -3.0, lon: -60.0 },
                description: 'Monitor and photograph deforestation patterns in the Amazon Basin',
                scientificValue: 'These images help environmental agencies track illegal logging and assess the impact on global climate systems and biodiversity.'
            }
        ];
        
        const mission = fallbackMissions[Math.floor(Math.random() * fallbackMissions.length)];
        this.currentMission = mission;
        this.missionActive = true;
        this.updateMissionDisplay();
        
        console.log('✅ Fallback mission activated:', mission.title);
    },
    
    // Get scientific value description based on category
    getScientificValue: function(category) {
        const values = {
            'Wildfires': 'Your images help scientists track fire spread patterns and assess the impact on air quality and ecosystems. This data is critical for disaster response teams and climate research.',
            'Severe Storms': 'Your photography provides valuable data for meteorologists to predict storm intensity and path, helping coastal communities prepare for potential impacts.',
            'Volcanoes': 'These observations help volcanologists monitor volcanic activity and assess hazards, protecting nearby populations and air traffic.',
            'Sea and Lake Ice': 'Your images contribute to understanding polar ice dynamics and climate change, essential for predicting sea level rise.',
            'Drought': 'This data helps water resource managers and agricultural planners respond to drought conditions affecting millions of people.',
            'Floods': 'Real-time flood imagery assists emergency responders in coordinating rescue operations and assessing damage.',
            'Dust and Haze': 'These observations help scientists track air quality and atmospheric conditions affecting human health.',
            'Earthquakes': 'Post-earthquake imagery aids in damage assessment and helps coordinate relief efforts.',
            'Landslides': 'Your photography helps geologists study slope stability and assess risks to communities.',
            'Manmade': 'These observations document human impacts on the environment, from oil spills to urban growth.',
            'Snow': 'Snow cover data is essential for water resource management and understanding seasonal climate patterns.',
            'Temperature Extremes': 'Your images document heat waves and cold snaps, helping researchers understand climate variability.',
            'Water Color': 'Ocean color observations help scientists monitor water quality, harmful algal blooms, and marine ecosystem health.'
        };
        
        return values[category] || 'Your photography contributes to Earth observation science, helping researchers monitor and understand our changing planet.';
    },
    
    // Update mission display
    updateMissionDisplay: function() {
        const display = document.getElementById('mission-objective-display');
        if (!display || !this.currentMission) return;
        
        display.innerHTML = `
            <div class="mission-info">
                <h4>🎯 Active Mission</h4>
                <p class="mission-title">${this.currentMission.title}</p>
                <p class="mission-category">${this.currentMission.category}</p>
                <p class="mission-desc">${this.currentMission.description}</p>
                <div class="mission-status" id="mission-status">
                    <span class="status-icon">🔍</span>
                    <span class="status-text">Scanning for target...</span>
                </div>
            </div>
        `;
    },
    
    // Track ISS position for mission
    trackISSPosition: function() {
        // Use existing ISS tracker if available
        if (typeof issTracker !== 'undefined' && issTracker) {
            // Piggyback on existing ISS tracking
            setInterval(() => {
                this.checkMissionProximity();
            }, 5000);
        } else {
            // Create our own tracker
            const tracker = new ISSTracker();
            tracker.startTracking((position) => {
                if (position) {
                    this.issPosition = position;
                    this.checkMissionProximity();
                }
            }, 5000);
        }
    },
    
    // Check if ISS is near mission target
    checkMissionProximity: function() {
        if (!this.currentMission || !this.missionActive) return;
        
        // Get ISS position from existing tracker or our position
        let issLat, issLon;
        
        if (typeof issTracker !== 'undefined' && issTracker && issTracker.currentPosition) {
            issLat = issTracker.currentPosition.latitude;
            issLon = issTracker.currentPosition.longitude;
        } else if (this.issPosition) {
            issLat = this.issPosition.latitude;
            issLon = this.issPosition.longitude;
        } else {
            // No position available yet
            return;
        }
        
        // Calculate distance to target
        const distance = this.calculateDistance(
            issLat, issLon,
            this.currentMission.target.lat, this.currentMission.target.lon
        );
        
        const statusElement = document.getElementById('mission-status');
        const captureBtn = document.getElementById('capture-photo-btn');
        
        if (distance <= this.targetRange) {
            // Target in range!
            this.captureEnabled = true;
            
            if (captureBtn) {
                captureBtn.disabled = false;
                captureBtn.classList.add('active');
            }
            
            if (statusElement) {
                statusElement.innerHTML = `
                    <span class="status-icon">✅</span>
                    <span class="status-text">TARGET IN RANGE (${Math.round(distance)} km)</span>
                `;
                statusElement.classList.add('in-range');
            }
            
            console.log(`🎯 Target in range! Distance: ${Math.round(distance)} km`);
        } else {
            // Target not in range
            this.captureEnabled = false;
            
            if (captureBtn) {
                captureBtn.disabled = true;
                captureBtn.classList.remove('active');
            }
            
            if (statusElement) {
                statusElement.innerHTML = `
                    <span class="status-icon">🔍</span>
                    <span class="status-text">Distance to target: ${Math.round(distance)} km</span>
                `;
                statusElement.classList.remove('in-range');
            }
        }
    },
    
    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance;
    },
    
    // Convert degrees to radians
    toRad: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    // Capture photo when button is clicked
    capturePhoto: function() {
        if (!this.captureEnabled || !this.currentMission) return;
        
        console.log('📷 Photo captured!');
        
        // Show success animation on button
        const captureBtn = document.getElementById('capture-photo-btn');
        if (captureBtn) {
            captureBtn.textContent = '✓ Captured!';
            captureBtn.classList.add('captured');
            
            setTimeout(() => {
                captureBtn.textContent = '📷 Capture Image';
                captureBtn.classList.remove('captured');
            }, 2000);
        }
        
        // Show modal with astronaut photography
        this.showPhotoModal();
        
        // Start a new mission after a delay
        setTimeout(() => {
            this.startMission();
        }, 5000);
    },
    
    // Show photo modal with astronaut imagery
    showPhotoModal: function() {
        const modal = document.getElementById('photo-capture-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalImg = document.getElementById('modal-astronaut-photo');
        const modalDesc = document.getElementById('modal-description');
        const modalLink = document.getElementById('modal-learn-more');
        
        if (!modal || !this.currentMission) return;
        
        // Set modal content based on mission category
        const astronautPhotos = this.getAstronautPhoto(this.currentMission.category);
        
        if (modalTitle) {
            modalTitle.textContent = `Mission Success: ${this.currentMission.title}`;
        }
        
        if (modalImg) {
            modalImg.src = astronautPhotos.url;
            modalImg.alt = astronautPhotos.description;
        }
        
        if (modalDesc) {
            modalDesc.innerHTML = `
                <p class="modal-success">✓ Image successfully captured and transmitted to Earth!</p>
                <p class="modal-scientific-value">${this.currentMission.scientificValue}</p>
                <p class="modal-mission-type"><strong>Event Type:</strong> ${this.currentMission.category}</p>
            `;
        }
        
        if (modalLink) {
            modalLink.href = astronautPhotos.gatewayLink;
        }
        
        // Show modal
        modal.style.display = 'flex';
        
        // Disable capture button
        this.captureEnabled = false;
        const captureBtn = document.getElementById('capture-photo-btn');
        if (captureBtn) {
            captureBtn.disabled = true;
            captureBtn.classList.remove('active');
        }
    },
    
    // Close modal
    closeModal: function() {
        const modal = document.getElementById('photo-capture-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    // Get astronaut photo for category
    getAstronautPhoto: function(category) {
        const photos = {
            'Wildfires': {
                url: 'https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS067/ISS067-E-204254.JPG',
                description: 'Wildfire smoke plume photographed from ISS',
                gatewayLink: 'https://eol.jsc.nasa.gov/SearchPhotos/photo.pl?mission=ISS067&roll=E&frame=204254'
            },
            'Severe Storms': {
                url: 'https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS065/ISS065-E-190345.JPG',
                description: 'Hurricane photographed from ISS',
                gatewayLink: 'https://eol.jsc.nasa.gov/SearchPhotos/photo.pl?mission=ISS065&roll=E&frame=190345'
            },
            'Volcanoes': {
                url: 'https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS068/ISS068-E-52467.JPG',
                description: 'Volcanic eruption captured from orbit',
                gatewayLink: 'https://eol.jsc.nasa.gov/SearchPhotos/photo.pl?mission=ISS068&roll=E&frame=52467'
            },
            'Sea and Lake Ice': {
                url: 'https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS066/ISS066-E-148326.JPG',
                description: 'Arctic sea ice patterns from ISS',
                gatewayLink: 'https://eol.jsc.nasa.gov/SearchPhotos/photo.pl?mission=ISS066&roll=E&frame=148326'
            },
            'Default': {
                url: 'https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS069/ISS069-E-18879.JPG',
                description: 'Earth observation from International Space Station',
                gatewayLink: 'https://eol.jsc.nasa.gov/SearchPhotos/'
            }
        };
        
        return photos[category] || photos['Default'];
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for other scripts to initialize
        setTimeout(() => {
            missionManager.init();
        }, 1000);
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        missionManager.init();
    }, 1000);
}

console.log('✅ Cupola mission system loaded');
