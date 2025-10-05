/**
 * NBL (Neutral Buoyancy Laboratory) Simulation Module
 * Handles enhanced NBL training tasks with realistic buoyancy controls
 */

// NBL Task System
const NBLTasks = {
    currentTaskIndex: 0,
    buoyancySetupComplete: false,
    weightCount: 0,
    
    tasks: [
        {
            id: 'repair',
            name: 'Repair Mission',
            description: 'Move to the repair panel and use your wrench to complete the repair',
            setupText: 'Astronauts and divers work together to achieve perfect neutral buoyancy for each individual.',
            completionFact: 'The Pistol Grip Tool is a self-contained, battery-powered tool used by astronauts on spacewalks.',
            targetElement: 'repair-panel',
            requiresNeutralBuoyancy: true,
            type: 'repair'
        },
        {
            id: 'pathfinder',
            name: 'Pathfinder Translation',
            description: 'Follow the highlighted handrails in sequence to practice station translation',
            setupText: 'EVA astronauts use handrails to move across the exterior of the ISS, maintaining three points of contact.',
            completionFact: 'During spacewalks, astronauts translate (move) using over 160 handrails installed on the ISS exterior.',
            targetElement: 'handrail-path',
            requiresNeutralBuoyancy: true,
            type: 'translation'
        },
        {
            id: 'lunar',
            name: 'Lunar Analog Mission',
            description: 'Descend to the pool floor and collect a rock sample',
            setupText: 'The NBL can simulate lunar gravity by adjusting buoyancy to be slightly negative.',
            completionFact: 'NASA uses the NBL to prepare astronauts for lunar missions, simulating reduced gravity environments.',
            targetElement: 'rock-sample',
            requiresNeutralBuoyancy: false,
            requiresNegativeBuoyancy: true,
            type: 'lunar'
        }
    ],

    getCurrentTask() {
        return this.tasks[this.currentTaskIndex];
    },

    nextTask() {
        this.currentTaskIndex = (this.currentTaskIndex + 1) % this.tasks.length;
        this.buoyancySetupComplete = false;
        return this.getCurrentTask();
    }
};

// Buoyancy Setup Modal Controller
class BuoyancySetupModal {
    constructor() {
        this.modal = null;
        this.balanceMeter = null;
        this.weightCount = 0;
        this.targetWeight = 5; // Target for neutral buoyancy
        this.isNeutral = false;
    }

    create() {
        // Create modal HTML
        const modalHTML = `
            <div id="buoyancy-setup" class="buoyancy-modal">
                <div class="buoyancy-modal-content">
                    <h3>Pre-Task Buoyancy Setup</h3>
                    <p class="setup-tip" id="setup-tip">Adjust weights to achieve neutral buoyancy</p>
                    
                    <div class="balance-meter-container">
                        <div class="balance-status" id="balance-status">Too Light ↑</div>
                        <div class="balance-meter">
                            <div class="balance-indicator" id="balance-indicator"></div>
                            <div class="neutral-zone-marker"></div>
                        </div>
                        <div class="weight-display">Weights: <span id="weight-count">0</span></div>
                    </div>
                    
                    <div class="weight-controls">
                        <button class="weight-btn" id="add-weight-btn">Add Weights ⬇</button>
                        <button class="weight-btn" id="remove-weight-btn">Remove Weights ⬆</button>
                    </div>
                    
                    <button class="begin-task-btn" id="begin-task-btn" disabled>Begin Task</button>
                </div>
            </div>
        `;

        // Insert modal into NBL section
        const nblSimulator = document.querySelector('.nbl-simulator');
        nblSimulator.insertAdjacentHTML('afterbegin', modalHTML);

        this.modal = document.getElementById('buoyancy-setup');
        this.balanceMeter = document.getElementById('balance-indicator');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-weight-btn').addEventListener('click', () => {
            this.addWeight();
        });

        document.getElementById('remove-weight-btn').addEventListener('click', () => {
            this.removeWeight();
        });

        document.getElementById('begin-task-btn').addEventListener('click', () => {
            this.close();
            NBLTasks.buoyancySetupComplete = true;
            startMainSimulation();
        });
    }

    addWeight() {
        if (this.weightCount < 10) {
            this.weightCount++;
            this.updateBalanceMeter();
        }
    }

    removeWeight() {
        if (this.weightCount > 0) {
            this.weightCount--;
            this.updateBalanceMeter();
        }
    }

    updateBalanceMeter() {
        const weightCountDisplay = document.getElementById('weight-count');
        const balanceStatus = document.getElementById('balance-status');
        const beginTaskBtn = document.getElementById('begin-task-btn');
        
        weightCountDisplay.textContent = this.weightCount;
        
        // Calculate balance position (0-100%)
        const balancePercent = (this.weightCount / 10) * 100;
        this.balanceMeter.style.left = `${balancePercent}%`;
        
        // Determine status
        if (this.weightCount < 4) {
            balanceStatus.textContent = 'Too Light ↑';
            balanceStatus.className = 'balance-status too-light';
            this.isNeutral = false;
            beginTaskBtn.disabled = true;
        } else if (this.weightCount > 6) {
            balanceStatus.textContent = 'Too Heavy ↓';
            balanceStatus.className = 'balance-status too-heavy';
            this.isNeutral = false;
            beginTaskBtn.disabled = true;
        } else {
            balanceStatus.textContent = 'Neutrally Buoyant ✓';
            balanceStatus.className = 'balance-status neutral';
            this.isNeutral = true;
            beginTaskBtn.disabled = false;
        }
    }

    show(task) {
        const setupTip = document.getElementById('setup-tip');
        setupTip.textContent = task.setupText;
        this.modal.classList.add('active');
        this.weightCount = 0;
        this.updateBalanceMeter();
    }

    close() {
        this.modal.classList.remove('active');
    }
}

// Task-specific UI elements
class TaskEnvironment {
    constructor() {
        this.poolEnvironment = document.querySelector('.pool-environment');
    }

    setupRepairTask() {
        // Add repair panel if not exists
        if (!document.getElementById('repair-panel')) {
            const repairPanel = document.createElement('div');
            repairPanel.id = 'repair-panel';
            repairPanel.className = 'repair-panel task-location';
            this.poolEnvironment.appendChild(repairPanel);
        }
        
        // Show repair panel, hide others
        this.hideAllTaskElements();
        document.getElementById('repair-panel').style.display = 'block';
        
        // Update task text
        document.getElementById('task-text').textContent = 'Task: Move to repair panel and use wrench';
    }

    setupPathfinderTask() {
        // Create handrails if not exist
        this.createHandrails();
        
        // Show handrails, hide others
        this.hideAllTaskElements();
        const handrails = document.querySelectorAll('.handrail');
        handrails.forEach(rail => rail.style.display = 'block');
        
        // Highlight first handrail
        if (handrails.length > 0) {
            handrails[0].classList.add('highlighted');
        }
        
        // Update task text
        document.getElementById('task-text').textContent = 'Task: Follow the highlighted handrails';
    }

    setupLunarTask() {
        // Add rock sample and change background
        if (!document.getElementById('rock-sample')) {
            const rockSample = document.createElement('div');
            rockSample.id = 'rock-sample';
            rockSample.className = 'rock-sample task-location';
            rockSample.textContent = '🪨';
            this.poolEnvironment.appendChild(rockSample);
        }
        
        // Show rock sample, hide others
        this.hideAllTaskElements();
        document.getElementById('rock-sample').style.display = 'block';
        
        // Change pool background to lunar surface
        this.poolEnvironment.classList.add('lunar-mode');
        
        // Update task text
        document.getElementById('task-text').textContent = 'Task: Descend and collect rock sample';
    }

    hideAllTaskElements() {
        // Hide repair panel
        const repairPanel = document.getElementById('repair-panel');
        if (repairPanel) repairPanel.style.display = 'none';
        
        // Hide handrails
        const handrails = document.querySelectorAll('.handrail');
        handrails.forEach(rail => {
            rail.style.display = 'none';
            rail.classList.remove('highlighted');
        });
        
        // Hide rock sample
        const rockSample = document.getElementById('rock-sample');
        if (rockSample) rockSample.style.display = 'none';
        
        // Remove lunar mode
        this.poolEnvironment.classList.remove('lunar-mode');
    }

    createHandrails() {
        // Check if handrails already exist
        if (document.querySelectorAll('.handrail').length > 0) return;
        
        // Create 5 handrails in a path
        const handrailPositions = [
            { top: '30%', left: '20%' },
            { top: '40%', left: '40%' },
            { top: '50%', left: '60%' },
            { top: '35%', left: '75%' },
            { top: '60%', left: '80%' }
        ];
        
        handrailPositions.forEach((pos, index) => {
            const handrail = document.createElement('div');
            handrail.className = 'handrail';
            handrail.dataset.index = index;
            handrail.style.top = pos.top;
            handrail.style.left = pos.left;
            handrail.style.display = 'none';
            this.poolEnvironment.appendChild(handrail);
        });
    }
}

// Initialize NBL system when document is ready
let buoyancySetup;
let taskEnvironment;
let currentHandrailIndex = 0;

function initializeNBL() {
    buoyancySetup = new BuoyancySetupModal();
    buoyancySetup.create();
    
    taskEnvironment = new TaskEnvironment();
    
    // Override the start task button behavior
    const startTaskBtn = document.getElementById('start-task-btn');
    if (startTaskBtn) {
        // Remove existing event listener by cloning
        const newStartTaskBtn = startTaskBtn.cloneNode(true);
        startTaskBtn.parentNode.replaceChild(newStartTaskBtn, startTaskBtn);
        
        newStartTaskBtn.addEventListener('click', () => {
            startNBLTask();
        });
    }
}

function startNBLTask() {
    const task = NBLTasks.getCurrentTask();
    
    // Show buoyancy setup modal
    buoyancySetup.show(task);
}

function startMainSimulation() {
    const task = NBLTasks.getCurrentTask();
    const taskIndicator = document.getElementById('task-indicator');
    const taskFeedback = document.getElementById('task-feedback');
    const startTaskBtn = document.getElementById('start-task-btn');
    
    // Setup task environment
    if (task.type === 'repair') {
        taskEnvironment.setupRepairTask();
        setupRepairTaskLogic();
    } else if (task.type === 'translation') {
        taskEnvironment.setupPathfinderTask();
        setupPathfinderTaskLogic();
    } else if (task.type === 'lunar') {
        taskEnvironment.setupLunarTask();
        setupLunarTaskLogic();
    }
    
    // Show task indicator
    taskIndicator.classList.add('active');
    taskFeedback.textContent = task.description;
    taskFeedback.className = 'task-feedback';
    startTaskBtn.disabled = true;
    
    window.nblTaskActive = true;
}

function setupRepairTaskLogic() {
    const repairPanel = document.getElementById('repair-panel');
    const astronaut = document.getElementById('astronaut');
    
    // Make repair panel clickable when astronaut is close
    const checkRepairProximity = setInterval(() => {
        if (!window.nblTaskActive) {
            clearInterval(checkRepairProximity);
            return;
        }
        
        const astronautRect = astronaut.getBoundingClientRect();
        const repairRect = repairPanel.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(astronautRect.left - repairRect.left, 2) +
            Math.pow(astronautRect.top - repairRect.top, 2)
        );
        
        if (distance < 80) {
            repairPanel.classList.add('interactive');
            repairPanel.onclick = () => {
                completeNBLTask('repair');
                clearInterval(checkRepairProximity);
            };
        } else {
            repairPanel.classList.remove('interactive');
            repairPanel.onclick = null;
        }
    }, 100);
}

function setupPathfinderTaskLogic() {
    const astronaut = document.getElementById('astronaut');
    const handrails = document.querySelectorAll('.handrail');
    currentHandrailIndex = 0;
    
    // Check proximity to highlighted handrail
    const checkHandrailProximity = setInterval(() => {
        if (!window.nblTaskActive) {
            clearInterval(checkHandrailProximity);
            return;
        }
        
        const currentHandrail = handrails[currentHandrailIndex];
        if (!currentHandrail) return;
        
        const astronautRect = astronaut.getBoundingClientRect();
        const handrailRect = currentHandrail.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(astronautRect.left - handrailRect.left, 2) +
            Math.pow(astronautRect.top - handrailRect.top, 2)
        );
        
        if (distance < 60) {
            currentHandrail.classList.remove('highlighted');
            currentHandrail.classList.add('completed');
            currentHandrailIndex++;
            
            if (currentHandrailIndex < handrails.length) {
                handrails[currentHandrailIndex].classList.add('highlighted');
            } else {
                completeNBLTask('pathfinder');
                clearInterval(checkHandrailProximity);
            }
        }
    }, 100);
}

function setupLunarTaskLogic() {
    const rockSample = document.getElementById('rock-sample');
    const astronaut = document.getElementById('astronaut');
    
    // Make rock clickable when astronaut is close
    const checkRockProximity = setInterval(() => {
        if (!window.nblTaskActive) {
            clearInterval(checkRockProximity);
            return;
        }
        
        const astronautRect = astronaut.getBoundingClientRect();
        const rockRect = rockSample.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(astronautRect.left - rockRect.left, 2) +
            Math.pow(astronautRect.top - rockRect.top, 2)
        );
        
        if (distance < 70) {
            rockSample.classList.add('interactive');
            rockSample.onclick = () => {
                completeNBLTask('lunar');
                clearInterval(checkRockProximity);
            };
        } else {
            rockSample.classList.remove('interactive');
            rockSample.onclick = null;
        }
    }, 100);
}

function completeNBLTask(taskType) {
    if (!window.nblTaskActive) return;
    
    window.nblTaskActive = false;
    const task = NBLTasks.getCurrentTask();
    const taskIndicator = document.getElementById('task-indicator');
    const taskFeedback = document.getElementById('task-feedback');
    const startTaskBtn = document.getElementById('start-task-btn');
    
    taskIndicator.classList.remove('active');
    taskFeedback.textContent = `✓ Task Complete! ${task.completionFact}`;
    taskFeedback.className = 'task-feedback success fact-display';
    
    // Award points and badge
    if (window.gameRewards) {
        const taskKey = `nbl_${taskType}`;
        if (!window.gameRewards.userProfile.completedTasks[taskKey]) {
            window.gameRewards.addPoints(100);
            window.gameRewards.addBadge(`${task.name} Specialist`, '🔩');
            window.gameRewards.userProfile.completedTasks[taskKey] = true;
        } else {
            window.gameRewards.addPoints(50);
        }
    }
    
    // Move to next task
    NBLTasks.nextTask();
    
    setTimeout(() => {
        startTaskBtn.disabled = false;
        const nextTask = NBLTasks.getCurrentTask();
        startTaskBtn.textContent = `Start ${nextTask.name}`;
        taskFeedback.textContent = '';
        taskFeedback.className = 'task-feedback';
        taskEnvironment.hideAllTaskElements();
    }, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNBL);
} else {
    initializeNBL();
}
