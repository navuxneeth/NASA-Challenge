# Orbital Perspectives

An interactive educational website created for the NASA Space Apps Challenge, designed to help students and the public experience two of the most unique aspects of the International Space Station: the breathtaking views from the Cupola and weightlessness training in the Neutral Buoyancy Laboratory (NBL).

Access it at https://navuxneeth.github.io/NASA-Challenge/index.html

## IMPORTANT: Project Structure

This repository contains two versions of the project in separate folders:

### v2-final (RECOMMENDED - USE THIS VERSION)
**Access Original Repo**: https://github.com/navuxneeth/Orbital-Perspectives

**Location:** `/v2-final/`

This is the latest, fully-functional version with all features working correctly. This version includes:
- Real-time ISS tracking with working APIs
- Interactive world map with custom canvas implementation
- NASA API integration (fully functional)
- Live Earth events tracking
- NASA image gallery with search functionality
- Proper error handling and fallback mechanisms
- Complete documentation and setup guides

**To use this version:**
1. Navigate to the `v2-final` folder
2. Open `index.html` in your browser or deploy to a web server
3. Follow the instructions in `v2-final/README.md` for setup
4. (Optional) Configure API keys in `v2-final/config.js`

### v1-legacy (OLDER VERSION - FOR REFERENCE ONLY)
**Location:** `/v1-legacy/`

This is an older version of the project that has some known issues:
- API integration has errors and may not work correctly
- Some features may not function as expected
- Less stable than v2-final
- Kept for historical reference and comparison

**Note:** If you want to view, modify, or use the project, please use the `v2-final` folder. The v1-legacy version is provided only for reference purposes.

## Quick Start

To get started with the working version:

```bash
# Navigate to the recommended version
cd v2-final

# Open index.html in your browser
# Or use a local server for full API functionality:
python3 -m http.server 8080
# Then open http://localhost:8080
```

## Repository Structure

```
NASA-Challenge/
├── README.md           # This file - main documentation
├── v2-final/          # RECOMMENDED VERSION - Use this!
│   ├── index.html     # Main application file
│   ├── styles.css     # Styling
│   ├── script.js      # Application logic
│   ├── api.js         # API integration
│   ├── config.js      # API configuration (edit this for your keys)
│   ├── README.md      # Detailed documentation for v2
│   └── ...            # Additional support files
└── v1-legacy/         # Older version (has API errors)
    ├── index.html     # Legacy application
    └── ...            # Legacy files
```

## Features Overview

The v2-final version includes:

**Interactive Elements:**
- Real-time ISS position tracking
- Custom-built canvas world map
- Drag-and-drop interactions
- Interactive controls and animations

**NASA Integration:**
- Live ISS location data
- NASA image gallery with search
- Earth events tracking (wildfires, storms, etc.)
- Real NASA imagery

**Educational Content:**
- ISS Cupola viewing experience
- Neutral Buoyancy Laboratory simulation
- Earth benefits from space research
- Interactive fact carousel

**Technical Features:**
- Pure HTML, CSS, and JavaScript (no frameworks)
- Fully responsive design
- Works offline with fallback data
- Free APIs (no cost)
- Easy API key configuration

## Documentation

For detailed information, please refer to:
- **v2-final/README.md** - Complete feature documentation for the recommended version
- **v2-final/SETUP_GUIDE.md** - Step-by-step setup instructions
- **v2-final/API_NOTES.md** - API integration details
- **v2-final/USAGE.md** - User guide and tips

## Technologies Used

- HTML5 - Semantic structure with accessibility features
- CSS3 - Modern styling with Grid, Flexbox, animations
- Vanilla JavaScript - No external dependencies
- NASA APIs - Real space data integration
- Canvas API - Custom map visualization

## About the Challenge

This project was created for the NASA Space Apps Challenge with the goal of creating an interactive tool that:
- Helps people understand the Cupola's unique view of Earth
- Simulates the NBL training experience
- Demonstrates how these experiences benefit humanity

## License

This project is created for educational purposes as part of the NASA Space Apps Challenge. All NASA imagery and data are used in accordance with NASA's media usage guidelines.

## Acknowledgments

- NASA for providing incredible imagery, data, and inspiration
- ISS Astronauts for their photography and research
- Space Apps Challenge organizers for the opportunity
- The entire space exploration community

---

**Created for the NASA Space Apps Challenge 2025**

"From orbit to our lives - exploring how space benefits Earth"

## Authors

Made by [Navaneeth Sankar K P](https://www.linkedin.com/in/navaneeth-sankar-k-p/) and [Abhinav Sankar K P](https://www.linkedin.com/in/abhinav-sankar-k-p-4a870b33b/)
