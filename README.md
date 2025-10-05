# Orbital Perspectives

An interactive educational website created for the NASA Space Apps Challenge, designed to help students and the public experience two of the most unique aspects of the International Space Station: the breathtaking views from the Cupola and weightlessness training in the Neutral Buoyancy Laboratory (NBL).

## 🌟 Features

### 1. Home/Hero Section
- Immersive full-screen entry with animated star field
- Real-time ISS position widget showing latitude and longitude
- Clear mission statement and call-to-action
- Smooth scroll indicator

### 2. Interactive World Map
- **Custom-built Canvas Map** - No external dependencies required
- **Real-time ISS Tracking** - Watch the space station orbit Earth live
- **Interactive Controls:**
  - 📍 Center on ISS - Follow the ISS as it moves
  - 🛰️ Toggle Orbital Path - Show/hide the ISS trajectory
  - 🗺️ Toggle Grid - Show/hide latitude/longitude lines
  - ➕➖ Zoom Controls - Zoom in and out
  - 🖱️ Pan & Drag - Click and drag to explore the map
- **Hover Tooltips** - Mouse over the ISS for detailed position info
- **Live Position Updates** - Updates every 5 seconds with real or simulated data
- **Works Offline** - Includes simulated orbital motion when APIs are unavailable

### 3. The Cupola - "The Window to the World"
- Interactive Earth viewing experience
- Points of Interest (POI) highlighting real-world ISS observations
- Detailed information panels about:
  - Wildfire monitoring
  - Hurricane tracking
  - Deforestation monitoring
- Simulated orbital sunrise/sunset timer

### 4. The NBL - "Training for Zero-G"
- Interactive buoyancy simulation
- Draggable astronaut avatar
- Adjustable buoyancy control slider
- Task-based training mini-game
- Real NBL statistics and facts

### 5. Earth Benefits
- Tabbed interface showcasing four key areas:
  - Healthcare innovations
  - Disaster relief and monitoring
  - Environmental science
  - Technology transfer
- "Did You Know?" rotating fact carousel

### 6. About Section
- Project information
- NASA resources and data sources
- Acknowledgments
- Contact form

## 🚀 Technologies Used

- **HTML5** - Semantic structure with accessibility features
- **CSS3** - Modern styling with:
  - CSS Grid and Flexbox for responsive layouts
  - CSS animations and transitions
  - Custom properties (CSS variables)
  - Gradient backgrounds
- **Vanilla JavaScript** - Interactive functionality including:
  - Smooth scroll navigation
  - Drag-and-drop simulation
  - Tab switching
  - Dynamic content updates
  - Touch support for mobile devices

## 📱 Responsive Design

The website is fully responsive and works seamlessly across:
- Desktop computers (1920px+)
- Laptops (1024px+)
- Tablets (768px+)
- Mobile phones (320px+)

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast text
- Focus indicators
- Touch-friendly interface for mobile users

## 🎯 Educational Goals

This tool aims to:
1. **Educate** students and the public about ISS research and operations
2. **Inspire** interest in space exploration and STEM fields
3. **Demonstrate** how space exploration benefits life on Earth
4. **Engage** users through interactive, hands-on experiences

## 📚 NASA Resources Used

- [Gateway to Astronaut Photography of Earth](https://eol.jsc.nasa.gov/)
- [International Space Station](https://www.nasa.gov/mission_pages/station/main/index.html)
- [Neutral Buoyancy Laboratory](https://www.nasa.gov/content/neutral-buoyancy-laboratory)
- [NASA Image and Video Library](https://images.nasa.gov/)
- [NASA Earth Observatory](https://earthobservatory.nasa.gov/)

## 🔧 Technical Implementation

### File Structure
```
NASA-Challenge/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with new API sections
├── script.js           # Interactive functionality + API integrations
├── config.js           # API keys configuration (EDIT THIS!)
├── api.js              # API integration module
├── challenge.txt       # Original challenge description
├── README.md           # Project documentation
└── images/             # (Optional) Your custom images folder
    ├── earth.jpg
    ├── iss.jpg
    ├── cupola.jpg
    └── nbl.jpg
```

### Key Features
- **Single Page Application (SPA)** design with smooth section transitions
- **Real API Integration** - Live data from NASA and other free sources
- **No external dependencies** - pure HTML, CSS, and JavaScript
- **Optimized performance** with efficient animations
- **Cross-browser compatible** (Chrome, Firefox, Safari, Edge)

### APIs Used (All FREE!)
1. **NASA API** - Images, APOD, Earth imagery
   - Sign up: [api.nasa.gov](https://api.nasa.gov/)
   - Free tier: 1,000 requests/hour
   
2. **Open Notify (ISS Location)** - Real-time ISS tracking
   - No API key needed!
   - Endpoint: [open-notify.org](http://api.open-notify.org/)
   
3. **NASA EONET** - Earth Observatory Natural Event Tracker
   - No API key needed!
   - Tracks wildfires, storms, volcanoes, etc.
   
4. **NASA Images API** - Search entire NASA media library
   - No API key needed!
   - 100,000+ images available
   
5. **Open-Meteo** - Weather data
   - No API key needed!
   - Completely free weather API

## 🎨 Design Principles

- **NASA Brand Colors**: Official NASA blue (#0b3d91) and red (#fc3d21)
- **Space Theme**: Dark backgrounds with star fields and cosmic gradients
- **Clean Typography**: Clear, readable fonts with proper hierarchy
- **Visual Hierarchy**: Important information emphasized through size and color
- **Smooth Animations**: Subtle transitions that enhance UX without distraction

## 📊 ISS Facts Highlighted

- The ISS orbits Earth at 17,900 mph
- Astronauts experience 16 sunrises and sunsets per day
- The ISS passes over 90% of Earth's population
- 7 hours of NBL training for every 1 hour of spacewalk
- The NBL contains 6.2 million gallons of water

## 🌍 Real-World Applications

The website demonstrates how ISS research benefits Earth in:
- Advanced medical treatments and drug development
- Natural disaster monitoring and response
- Climate change tracking and environmental protection
- Technology innovations that improve daily life

## ✅ Recently Added Features

- ✅ **Interactive World Map** - Custom-built canvas map with real-time ISS tracking
- ✅ **Zoom & Pan Controls** - Explore the map with interactive controls
- ✅ **Orbital Path Visualization** - See the ISS trajectory across Earth
- ✅ **Hover Tooltips** - Get detailed ISS info on mouse hover
- ✅ **Simulated Orbit** - Fallback orbital simulation when APIs are blocked
- ✅ Real-time ISS position tracking using NASA APIs
- ✅ Actual NASA imagery integration with searchable gallery
- ✅ Live Earth events (wildfires, storms, etc.)
- ✅ Easy API key configuration system

## 🚀 Future Enhancements

Potential additions could include:
- Enhanced 3D globe visualization with WebGL
- Additional map layers (population density, climate zones, etc.)
- ISS pass predictions for specific locations
- Virtual reality (VR) support for immersive experiences
- Multi-language support for global accessibility
- Educational quiz modules
- Social sharing features
- More interactive data visualizations

## 👨‍🚀 About the Challenge

This project was created for the **NASA Space Apps Challenge** with the goal of creating an interactive tool that:
- Helps people understand the Cupola's unique view of Earth
- Simulates the NBL training experience
- Demonstrates how these experiences benefit humanity

## 📝 License

This project is created for educational purposes as part of the NASA Space Apps Challenge. All NASA imagery and data are used in accordance with NASA's media usage guidelines.

## 🙏 Acknowledgments

- **NASA** for providing incredible imagery, data, and inspiration
- **ISS Astronauts** for their photography and research
- **Space Apps Challenge** organizers for the opportunity
- The entire space exploration community

---

**Created for the NASA Space Apps Challenge 2025**

*"From orbit to our lives - exploring how space benefits Earth"*

## Authors

Made by [Navaneeth Sankar K P](https://www.linkedin.com/in/navaneeth-sankar-k-p/) and [Abhinav Sankar K P](https://www.linkedin.com/in/abhinav-sankar-k-p-4a870b33b/)
