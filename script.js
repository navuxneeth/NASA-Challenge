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

// Console welcome message
console.log('%c🚀 Orbital Perspectives 🌍', 'font-size: 24px; font-weight: bold; color: #0b3d91;');
console.log('%cWelcome to your journey to the International Space Station!', 'font-size: 14px; color: #333;');
console.log('%cThis interactive experience showcases the ISS Cupola and NBL Training.', 'font-size: 12px; color: #666;');

// Performance monitoring (optional)
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}
