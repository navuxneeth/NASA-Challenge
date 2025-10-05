/**
 * API Configuration File
 * 
 * Instructions:
 * 1. This file contains API keys and configuration for various free services
 * 2. Replace the placeholder values with your actual API keys
 * 3. All APIs listed here are FREE and easy to get
 * 4. See README.md for detailed instructions on how to get each API key
 */

const CONFIG = {
    // NASA API Key (FREE) - Get yours at: https://api.nasa.gov/
    // This key works for: APOD, Mars Rover Photos, Earth Imagery, and more
    // Default rate limit: 1000 requests per hour
    NASA_API_KEY: 'DEMO_KEY', // Replace with your key from api.nasa.gov

    // Open-Meteo API (FREE, NO API KEY REQUIRED)
    // Weather and climate data - completely free, no registration needed
    // https://open-meteo.com/
    OPEN_METEO_ENABLED: true,

    // Where The ISS At API (FREE, NO API KEY REQUIRED)
    // Real-time ISS location tracking - completely free
    // http://api.open-notify.org/
    ISS_LOCATION_ENABLED: true,

    // NASA Image and Video Library (FREE, NO API KEY REQUIRED)
    // Search NASA's media library - completely free
    // https://images.nasa.gov/
    NASA_IMAGES_ENABLED: true,

    // Placeholder Image Settings
    // You can add your own images in an 'images' folder
    CUSTOM_IMAGES: {
        earth: 'images/earth.jpg',  // Add your Earth image here
        iss: 'images/iss.jpg',      // Add your ISS image here
        cupola: 'images/cupola.jpg', // Add your Cupola image here
        nbl: 'images/nbl.jpg'        // Add your NBL image here
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
