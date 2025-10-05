/**
 * Interactive Games Module
 * Implements Docking Challenge and Earth Observer Quiz
 */

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

// Update score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('user-score');
    if (scoreElement) {
        scoreElement.textContent = userProfile.score;
    }
}

// Add badge to user profile
function addBadge(badgeName, icon) {
    if (!userProfile.badges.find(b => b.name === badgeName)) {
        userProfile.badges.push({ name: badgeName, icon: icon });
        updateBadgeDisplay();
        
        // Show badge notification
        showBadgeNotification(badgeName, icon);
    }
}

// Update badge display
function updateBadgeDisplay() {
    const badgesElement = document.getElementById('user-badges');
    if (badgesElement) {
        badgesElement.innerHTML = userProfile.badges
            .map(badge => `<span class="badge" title="${badge.name}">${badge.icon}</span>`)
            .join(' ');
    }
}

// Show badge notification
function showBadgeNotification(badgeName, icon) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-notification-content">
            <span class="badge-icon">${icon}</span>
            <span class="badge-text">Badge Earned: ${badgeName}!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add points to score
function addPoints(points) {
    userProfile.score += points;
    updateScoreDisplay();
}

// ===========================================
// DOCKING CHALLENGE GAME
// ===========================================

let dockingGame = {
    canvas: null,
    ctx: null,
    isRunning: false,
    spacecraft: {
        x: 200,
        y: 350,
        angle: -Math.PI / 2, // pointing up
        velocityX: 0,
        velocityY: 0,
        angularVelocity: 0
    },
    iss: {
        x: 200,
        y: 50,
        angle: 0,
        dockingPortAngle: Math.PI / 2, // bottom of ISS
        dockingPortRadius: 15
    },
    keys: {},
    lastTime: 0
};

function initDockingGame() {
    dockingGame.canvas = document.getElementById('docking-challenge-canvas');
    dockingGame.ctx = dockingGame.canvas.getContext('2d');
    
    // Reset spacecraft position
    dockingGame.spacecraft = {
        x: 200,
        y: 350,
        angle: -Math.PI / 2,
        velocityX: 0,
        velocityY: 0,
        angularVelocity: 0
    };
    
    // Start game loop
    dockingGame.isRunning = true;
    dockingGame.lastTime = performance.now();
    requestAnimationFrame(updateDockingGame);
    
    // Setup keyboard controls
    document.addEventListener('keydown', handleDockingKeyDown);
    document.addEventListener('keyup', handleDockingKeyUp);
}

function handleDockingKeyDown(e) {
    if (!dockingGame.isRunning) return;
    dockingGame.keys[e.key] = true;
}

function handleDockingKeyUp(e) {
    if (!dockingGame.isRunning) return;
    dockingGame.keys[e.key] = false;
}

function updateDockingGame(currentTime) {
    if (!dockingGame.isRunning) return;
    
    const deltaTime = (currentTime - dockingGame.lastTime) / 1000;
    dockingGame.lastTime = currentTime;
    
    const ship = dockingGame.spacecraft;
    
    // Apply controls
    const thrustPower = 50;
    const rotationSpeed = 2;
    
    if (dockingGame.keys['ArrowUp']) {
        ship.velocityX += Math.cos(ship.angle) * thrustPower * deltaTime;
        ship.velocityY += Math.sin(ship.angle) * thrustPower * deltaTime;
    }
    
    if (dockingGame.keys['ArrowLeft']) {
        ship.angularVelocity = -rotationSpeed;
    } else if (dockingGame.keys['ArrowRight']) {
        ship.angularVelocity = rotationSpeed;
    } else {
        ship.angularVelocity = 0;
    }
    
    // Update position and rotation
    ship.angle += ship.angularVelocity * deltaTime;
    ship.x += ship.velocityX * deltaTime;
    ship.y += ship.velocityY * deltaTime;
    
    // Apply drag
    ship.velocityX *= 0.99;
    ship.velocityY *= 0.99;
    
    // Keep in bounds
    ship.x = Math.max(20, Math.min(380, ship.x));
    ship.y = Math.max(20, Math.min(380, ship.y));
    
    // Check docking
    checkDocking();
    
    // Render
    renderDockingGame();
    
    requestAnimationFrame(updateDockingGame);
}

function renderDockingGame() {
    const ctx = dockingGame.ctx;
    const ship = dockingGame.spacecraft;
    const iss = dockingGame.iss;
    
    // Clear canvas
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % 400;
        const y = (i * 97) % 400;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw ISS
    ctx.save();
    ctx.translate(iss.x, iss.y);
    ctx.rotate(iss.angle);
    
    // ISS body
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(-40, -20, 80, 40);
    
    // Solar panels
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(-70, -15, 25, 30);
    ctx.fillRect(45, -15, 25, 30);
    
    // Docking port (bottom)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, 20 + iss.dockingPortRadius, iss.dockingPortRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Draw spacecraft
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Spacecraft body (triangle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-10, 10);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    
    // Thruster indicator
    if (dockingGame.keys['ArrowUp']) {
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.moveTo(-5, 10);
        ctx.lineTo(0, 20);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
    
    // Draw velocity indicator
    const speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    ctx.fillStyle = 'white';
    ctx.font = '14px VT323, monospace';
    ctx.fillText(`Speed: ${speed.toFixed(1)}`, 10, 20);
}

function checkDocking() {
    const ship = dockingGame.spacecraft;
    const iss = dockingGame.iss;
    
    // Calculate docking port position (world coordinates)
    const portX = iss.x;
    const portY = iss.y + 20 + iss.dockingPortRadius;
    
    // Distance to docking port
    const dx = ship.x - portX;
    const dy = ship.y - portY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate speed
    const speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    
    // Check alignment (ship should be pointing up)
    const targetAngle = -Math.PI / 2;
    const angleDiff = Math.abs(ship.angle - targetAngle);
    
    const statusElement = document.getElementById('docking-status');
    
    if (distance < 30) {
        if (speed < 10 && angleDiff < 0.3) {
            // Successful docking!
            dockingGame.isRunning = false;
            statusElement.textContent = '✓ Docking Successful!';
            statusElement.style.color = '#4ade80';
            
            // Award points and badge
            if (!userProfile.completedTasks.docking) {
                addPoints(100);
                addBadge('Docking Specialist', '🎯');
                userProfile.completedTasks.docking = true;
            } else {
                addPoints(50);
            }
            
            setTimeout(() => {
                resetDockingGame();
            }, 2000);
        } else if (speed >= 10) {
            // Too fast!
            dockingGame.isRunning = false;
            statusElement.textContent = '✗ Collision! Approach slower.';
            statusElement.style.color = '#ef4444';
            
            setTimeout(() => {
                resetDockingGame();
            }, 2000);
        }
    } else {
        statusElement.textContent = '';
    }
}

function resetDockingGame() {
    const statusElement = document.getElementById('docking-status');
    statusElement.textContent = '';
    
    const canvas = document.getElementById('docking-challenge-canvas');
    canvas.style.display = 'none';
    
    const instructions = document.getElementById('docking-instructions');
    instructions.style.display = 'none';
    
    const startBtn = document.getElementById('start-docking-btn');
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Play Again';
    
    // Remove event listeners
    document.removeEventListener('keydown', handleDockingKeyDown);
    document.removeEventListener('keyup', handleDockingKeyUp);
}

// ===========================================
// EARTH OBSERVER QUIZ GAME
// ===========================================

let earthObserverGame = {
    currentQuestion: null,
    questions: [
        {
            image: 'https://images-assets.nasa.gov/image/iss065e092111/iss065e092111~medium.jpg',
            question: 'What natural phenomenon is shown in this image?',
            options: ['Hurricane', 'Tornado', 'Aurora Borealis', 'Volcano'],
            correct: 2,
            fact: 'The Aurora Borealis (Northern Lights) is caused by solar particles interacting with Earth\'s magnetic field, creating stunning light displays visible from the ISS!'
        },
        {
            image: 'https://images-assets.nasa.gov/image/iss063e041862/iss063e041862~medium.jpg',
            question: 'Which geographical feature is visible in this image?',
            options: ['Amazon Rainforest', 'Sahara Desert', 'Great Barrier Reef', 'Himalayan Mountains'],
            correct: 1,
            fact: 'The Sahara Desert is the largest hot desert in the world, covering much of North Africa. From space, its distinctive golden color is easily recognizable!'
        },
        {
            image: 'https://images-assets.nasa.gov/image/iss059e119250/iss059e119250~medium.jpg',
            question: 'What do you see in this image taken from the ISS?',
            options: ['City Lights', 'Ocean', 'Forest Fire', 'Coral Reef'],
            correct: 0,
            fact: 'City lights from space reveal human activity patterns. Bright clusters show major metropolitan areas, and the grid patterns help astronauts identify cities!'
        },
        {
            image: 'https://images-assets.nasa.gov/image/iss063e006024/iss063e006024~medium.jpg',
            question: 'This image shows which type of weather system?',
            options: ['Snowstorm', 'Tropical Cyclone', 'Thunderstorm', 'Dust Storm'],
            correct: 1,
            fact: 'Tropical cyclones (hurricanes/typhoons) are massive rotating storm systems. From space, astronauts can clearly see the eye at the center of these powerful storms!'
        },
        {
            image: 'https://images-assets.nasa.gov/image/iss064e006661/iss064e006661~medium.jpg',
            question: 'What is this distinctive geological formation?',
            options: ['Grand Canyon', 'Mount Everest', 'Great Rift Valley', 'Nile Delta'],
            correct: 3,
            fact: 'The Nile Delta is where the Nile River spreads out and drains into the Mediterranean Sea. Its fan-like shape is clearly visible from space!'
        }
    ],
    isActive: false
};

function startEarthObserver() {
    earthObserverGame.isActive = true;
    loadQuestion();
}

function loadQuestion() {
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * earthObserverGame.questions.length);
    earthObserverGame.currentQuestion = earthObserverGame.questions[randomIndex];
    
    const imageElement = document.getElementById('observer-image');
    const questionElement = document.getElementById('observer-question');
    const optionsElement = document.getElementById('observer-options');
    const feedbackElement = document.getElementById('observer-feedback');
    
    // Load image
    imageElement.src = earthObserverGame.currentQuestion.image;
    imageElement.alt = 'Earth observation from ISS';
    
    // Display question
    questionElement.textContent = earthObserverGame.currentQuestion.question;
    
    // Display options
    optionsElement.innerHTML = '';
    earthObserverGame.currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'observer-option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });
    
    // Clear feedback
    feedbackElement.innerHTML = '';
}

function checkAnswer(selectedIndex) {
    const question = earthObserverGame.currentQuestion;
    const feedbackElement = document.getElementById('observer-feedback');
    const optionsElement = document.getElementById('observer-options');
    
    // Disable all buttons
    const buttons = optionsElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === question.correct) {
        // Correct answer
        feedbackElement.innerHTML = `
            <div style="color: #4ade80;">✓ Correct!</div>
            <div style="margin-top: 0.5rem; font-size: 0.95rem; font-weight: normal;">${question.fact}</div>
        `;
        
        // Award points
        if (!userProfile.completedTasks.earthObserver) {
            addPoints(50);
            addBadge('Earth Observer', '🌍');
            userProfile.completedTasks.earthObserver = true;
        } else {
            addPoints(25);
        }
        
        // Highlight correct button
        buttons[selectedIndex].style.backgroundColor = '#4ade80';
    } else {
        // Incorrect answer
        feedbackElement.innerHTML = `
            <div style="color: #ef4444;">✗ Incorrect</div>
            <div style="margin-top: 0.5rem; font-size: 0.95rem; font-weight: normal;">The correct answer is: ${question.options[question.correct]}</div>
            <div style="margin-top: 0.5rem; font-size: 0.95rem; font-weight: normal;">${question.fact}</div>
        `;
        
        // Highlight incorrect and correct buttons
        buttons[selectedIndex].style.backgroundColor = '#ef4444';
        buttons[question.correct].style.backgroundColor = '#4ade80';
    }
    
    // Load next question after delay
    setTimeout(() => {
        // Reset button styles
        buttons.forEach(btn => {
            btn.style.backgroundColor = '';
            btn.disabled = false;
        });
        loadQuestion();
    }, 5000);
}

// ===========================================
// EVENT LISTENERS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize score display
    updateScoreDisplay();
    updateBadgeDisplay();
    
    // Docking Challenge button
    const startDockingBtn = document.getElementById('start-docking-btn');
    if (startDockingBtn) {
        startDockingBtn.addEventListener('click', () => {
            startDockingBtn.style.display = 'none';
            document.getElementById('docking-challenge-canvas').style.display = 'block';
            document.getElementById('docking-instructions').style.display = 'block';
            initDockingGame();
        });
    }
    
    // Earth Observer button
    const startObserverBtn = document.getElementById('start-observer-btn');
    if (startObserverBtn) {
        startObserverBtn.addEventListener('click', () => {
            startObserverBtn.style.display = 'none';
            document.getElementById('earth-observer-game').style.display = 'block';
            startEarthObserver();
        });
    }
});

// Export functions for integration with existing tasks
window.gameRewards = {
    addPoints: addPoints,
    addBadge: addBadge,
    userProfile: userProfile
};
