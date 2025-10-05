/**
 * API Integration Module
 * Handles all external API calls for real data
 */

// ISS Location Tracking
class ISSTracker {
    constructor() {
        this.updateInterval = null;
        this.currentPosition = null;
    }

    async getCurrentPosition() {
        try {
            const response = await fetch('http://api.open-notify.org/iss-now.json');
            const data = await response.json();
            
            if (data.message === 'success') {
                this.currentPosition = {
                    latitude: parseFloat(data.iss_position.latitude),
                    longitude: parseFloat(data.iss_position.longitude),
                    timestamp: data.timestamp
                };
                return this.currentPosition;
            }
        } catch (error) {
            console.error('Error fetching ISS position:', error);
            return null;
        }
    }

    async getPassTimes(lat, lon) {
        try {
            const response = await fetch(
                `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}&n=5`
            );
            const data = await response.json();
            return data.response || [];
        } catch (error) {
            console.error('Error fetching ISS pass times:', error);
            return [];
        }
    }

    startTracking(callback, interval = 5000) {
        // Initial fetch
        this.getCurrentPosition().then(callback);
        
        // Update every interval
        this.updateInterval = setInterval(() => {
            this.getCurrentPosition().then(callback);
        }, interval);
    }

    stopTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// NASA API Integration
class NASAApi {
    constructor(apiKey = 'DEMO_KEY') {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.nasa.gov';
    }

    async getAPOD(date = null) {
        try {
            const url = date 
                ? `${this.baseUrl}/planetary/apod?api_key=${this.apiKey}&date=${date}`
                : `${this.baseUrl}/planetary/apod?api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching APOD:', error);
            return null;
        }
    }

    async getEarthImagery(lat, lon, date = null) {
        try {
            const dateStr = date || new Date().toISOString().split('T')[0];
            const url = `${this.baseUrl}/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${dateStr}&api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            return response.url; // Returns image URL
        } catch (error) {
            console.error('Error fetching Earth imagery:', error);
            return null;
        }
    }

    async searchImages(query, mediaType = 'image') {
        try {
            const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaType}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.collection.items || [];
        } catch (error) {
            console.error('Error searching NASA images:', error);
            return [];
        }
    }

    async getEPIC() {
        try {
            // Get latest EPIC (Earth Polychromatic Imaging Camera) images
            const response = await fetch(`${this.baseUrl}/EPIC/api/natural?api_key=${this.apiKey}`);
            const data = await response.json();
            
            if (data.length > 0) {
                const latest = data[0];
                const date = latest.date.split(' ')[0].replace(/-/g, '/');
                const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/\//g, '/')}/png/${latest.image}.png`;
                return {
                    url: imageUrl,
                    caption: latest.caption,
                    date: latest.date
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching EPIC:', error);
            return null;
        }
    }
}

// Weather and Environmental Data
class WeatherAPI {
    async getWeatherData(lat, lon) {
        try {
            // Using Open-Meteo (completely free, no API key needed)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,windspeed_10m,weathercode&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();
            return data.current || null;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    async getFireData() {
        try {
            // NASA FIRMS (Fire Information for Resource Management System)
            // Using the public API endpoint
            const url = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/c6782cfc76e8b32936e75bf1191e1ef8/VIIRS_SNPP_NRT/world/1';
            const response = await fetch(url);
            const text = await response.text();
            
            // Parse CSV data (simplified)
            const lines = text.split('\n');
            const fires = [];
            for (let i = 1; i < Math.min(lines.length, 100); i++) {
                const parts = lines[i].split(',');
                if (parts.length > 2) {
                    fires.push({
                        lat: parseFloat(parts[0]),
                        lon: parseFloat(parts[1]),
                        brightness: parseFloat(parts[2])
                    });
                }
            }
            return fires;
        } catch (error) {
            console.error('Error fetching fire data:', error);
            return [];
        }
    }
}

// Earth Observatory Natural Event Tracker
class EONETApi {
    constructor() {
        this.baseUrl = 'https://eonet.gsfc.nasa.gov/api/v3';
    }

    async getEvents(category = null, limit = 10) {
        try {
            let url = `${this.baseUrl}/events?limit=${limit}&status=open`;
            if (category) {
                url += `&category=${category}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            return data.events || [];
        } catch (error) {
            console.error('Error fetching EONET events:', error);
            return [];
        }
    }

    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async getWildfires() {
        return this.getEvents('wildfires', 20);
    }

    async getSevereStorms() {
        return this.getEvents('severeStorms', 20);
    }
}

// Initialize API instances
const issTracker = new ISSTracker();
const nasaApi = new NASAApi(CONFIG.NASA_API_KEY);
const weatherApi = new WeatherAPI();
const eonetApi = new EONETApi();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ISSTracker, NASAApi, WeatherAPI, EONETApi };
}
