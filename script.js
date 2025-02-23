// Menu System
const mainMenu = document.getElementById('mainMenu');
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu-item');
const mainMenuButtons = document.querySelectorAll('.main-menu-button');
const pages = document.querySelectorAll('.page');

mainMenuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetPage = button.getAttribute('data-page');
    mainMenu.classList.add('hidden');
    pages.forEach(page => {
      page.classList.remove('active');
      if (page.id === targetPage) {
        page.classList.add('active');
      }
    });
  });
});

menuButton.addEventListener('click', () => {
  menu.classList.toggle('active');
});

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetPage = item.getAttribute('data-page');
    pages.forEach(page => {
      page.classList.remove('active');
      if (page.id === targetPage) {
        page.classList.add('active');
      }
    });
    menu.classList.remove('active');
  });
});

// Game Settings
const soundToggle = document.getElementById('soundToggle');
const animationSpeed = document.getElementById('animationSpeed');

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('soundEnabled', soundToggle.checked);
  localStorage.setItem('animationSpeed', animationSpeed.value);
}

// Load settings from localStorage
function loadSettings() {
  soundToggle.checked = localStorage.getItem('soundEnabled') === 'true';
  animationSpeed.value = localStorage.getItem('animationSpeed') || 'normal';
}

soundToggle.addEventListener('change', saveSettings);
animationSpeed.addEventListener('change', saveSettings);

// Load settings when page loads
loadSettings();

let drops = 0;
let workers = 0;
let workerCost = 10;
let multiplier = 1;
let cursors = [];
let cursorUpgrades = 0;
let ascensionPoints = 0;
let ascensionCount = 0;
let clickMultiplier = 1;
let clickUpgradeCost = 10;
let autoMultiplier = 1;
let autoUpgradeCost = 10;

const dropsDisplay = document.getElementById('drops');
const dropsPerSecondDisplay = document.getElementById('dropsPerSecond');
const waterButton = document.getElementById('waterButton');
const buyWorkerButton = document.getElementById('buyWorker');
const workerCostDisplay = document.getElementById('workerCost');
const workerCountDisplay = document.getElementById('workerCount');
const ascendButton = document.getElementById('ascendButton');
const multiplierDisplay = document.getElementById('multiplier');
const ascensionPointsDisplay = document.getElementById('ascensionPoints'); // Added
const buyClickMultiplier = document.getElementById('buyClickMultiplier'); // Added
const buyAutoClickMultiplier = document.getElementById('buyAutoClickMultiplier'); // Added
const clickUpgradeCostDisplay = document.getElementById('clickUpgradeCost'); // Added
const autoUpgradeCostDisplay = document.getElementById('autoUpgradeCost'); // Added


let isWaterBottle = false;
let waterBottleTimer = null;

waterButton.addEventListener('click', () => {
  if (Math.random() < 0.1 && !isWaterBottle) { // 10% chance
    isWaterBottle = true;
    waterButton.textContent = '🧊';
    clearTimeout(waterBottleTimer);
    waterBottleTimer = setTimeout(() => {
      isWaterBottle = false;
      waterButton.textContent = '💧';
    }, 5000);
  }

  drops += (isWaterBottle ? 5 : 1) * clickMultiplier;
  updateDisplay();
});

buyWorkerButton.addEventListener('click', () => {
  if (drops >= workerCost) {
    drops -= workerCost;
    workers++;
    workerCost = Math.floor(workerCost * 1.15);
    updateDisplay();
  }
});

ascendButton.addEventListener('click', () => {
  if (drops >= 1000) {
    ascensionPoints += Math.floor(drops / 1000);
    ascensionCount++;
    drops = 0;
    workers = 0;
    workerCost = 10;
    updateDisplay();
  }
});

buyClickMultiplier.addEventListener('click', () => {
  if (ascensionPoints >= 1) {
    ascensionPoints--;
    clickMultiplier++;
    clickUpgradeCost *= 2;
    updateDisplay();
  }
});

document.getElementById('buyCursorUpgrade').addEventListener('click', () => {
  if (ascensionPoints >= 5) {
    ascensionPoints -= 5;
    cursorUpgrades++;
    if (cursors.length < cursorUpgrades) {
      cursors.push(addCursor());
    }
    document.getElementById('cursorCount').textContent = cursorUpgrades;
    document.getElementById('ascensionPoints').textContent = ascensionPoints;
  }
});

buyAutoClickMultiplier.addEventListener('click', () => {
  if (ascensionPoints >= 1) {
    ascensionPoints--;
    autoMultiplier++;
    autoUpgradeCost *= 2;
    updateDisplay();
  }
});

function updateDisplay() {
  dropsDisplay.textContent = Math.floor(drops);
  dropsPerSecondDisplay.textContent = workers * autoMultiplier;
  workerCostDisplay.textContent = workerCost;
  workerCountDisplay.textContent = workers;
  multiplierDisplay.textContent = multiplier;
  ascensionPointsDisplay.textContent = ascensionPoints;
  document.getElementById('ascensionCount').textContent = ascensionCount;
  clickUpgradeCostDisplay.textContent = clickUpgradeCost;
  autoUpgradeCostDisplay.textContent = autoUpgradeCost;
  document.getElementById('clickMultiplier').textContent = clickMultiplier;
  document.getElementById('autoMultiplier').textContent = autoMultiplier;
  buyWorkerButton.disabled = drops < workerCost;
  ascendButton.disabled = drops < 1000;
  buyClickMultiplier.disabled = ascensionPoints < 1;
  buyAutoClickMultiplier.disabled = ascensionPoints < 1;

}

function addCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.querySelector('.container').appendChild(cursor);
  return cursor;
}

function animateCursors() {
  cursors.forEach(cursor => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => {
      drops++;
      updateDisplay();
    }, 500);
  });
}

setInterval(() => {
  drops += workers * autoMultiplier;
  updateDisplay();
  animateCursors();
  
  // Show workers
  const workerElements = document.querySelectorAll('.worker');
  if (workerElements.length < workers) {
    for (let i = workerElements.length; i < workers; i++) {
      const worker = document.createElement('div');
      worker.className = 'worker';
      worker.textContent = '👷';
      document.querySelector('.container').appendChild(worker);
    }
  }
}, 1000);

const multiplayerToggle = document.getElementById('multiplayerToggle');
let socket = null;

multiplayerToggle.addEventListener('change', () => {
  const menuPlayersList = document.getElementById('menuPlayersList');
  if (multiplayerToggle.checked) {
    menuPlayersList.style.display = 'block';
    socket = io('http://0.0.0.0:3000');
    socket.on('playersUpdate', (players) => {
      const playersList = document.getElementById('playersList');
      const menuPlayers = document.getElementById('menuPlayers');
      const playerHtml = players
        .filter(([id]) => id !== socket.id)
        .map(([id, data]) => `<li>Player ${id.slice(0, 4)}: ${data.drops} drops${data.ascensionPoints ? ` (AP: ${data.ascensionPoints})` : ''}</li>`)
        .join('');
      playersList.innerHTML = playerHtml;
      menuPlayers.innerHTML = playerHtml;
    });
    socket.emit('join', {drops: drops});
    setInterval(() => {
      socket.emit('update', { drops: drops });
    }, 1000);
  } else if (socket) {
    menuPlayersList.style.display = 'none';
    socket.disconnect();
    socket = null;
    document.getElementById('playersList').innerHTML = '';
    document.getElementById('menuPlayers').innerHTML = '';
  }
});
