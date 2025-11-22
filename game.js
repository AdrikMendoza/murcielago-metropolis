// Configuración del canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Tamaño del canvas - reducir resolución en móviles para mejor rendimiento
const baseWidth = isMobile ? 400 : 800;
const baseHeight = isMobile ? 300 : 600;
canvas.width = baseWidth;
canvas.height = baseHeight;

// Variables del juego
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let animationId;

// Variables del murciélago
const bat = {
    x: 150,
    y: canvas.height / 2,
    width: 50,
    height: 40,
    velocity: 0,
    gravity: 0.15,
    jump: -14,
    maxFallSpeed: 6,
    rotation: 0,
    wingAngle: 0,
    wingSpeed: 0.3
};

// Variables de obstáculos
let obstacles = [];
const obstacleGap = 250;
const obstacleWidth = 80;
let frameCount = 0;

// Variables de la ciudad
let buildings = [];
let stars = [];

// Colores futuristas neón
const cityColors = {
    building1: '#00F5FF', // Cian neón
    building2: '#FF00FF', // Magenta neón
    building3: '#00FF88', // Verde neón
    building4: '#FF0080', // Rosa neón
    building5: '#0080FF', // Azul neón
    window: '#00FFFF', // Cian brillante
    windowOff: '#001122', // Azul muy oscuro
    neon1: '#00F5FF',
    neon2: '#FF00FF',
    neon3: '#00FF88'
};

// Función helper para aplicar shadowBlur optimizado para móviles
function setShadowBlur(value) {
    if (!isMobile) {
        ctx.shadowBlur = value;
    } else {
        ctx.shadowBlur = value * 0.3; // Reducir significativamente en móviles
    }
}

// Inicializar el juego
function init() {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('bestScore').textContent = bestScore;
    
    // Controles
    canvas.addEventListener('click', jump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    });
    
    // Inicializar elementos del fondo
    initBackground();
    
    // Dibujar pantalla inicial
    drawBackground();
    drawBat();
}

// Inicializar fondo
function initBackground() {
    // Crear edificios futuristas del fondo - menos en móviles
    const buildingCount = isMobile ? 5 : 8;
    const buildingSpacing = isMobile ? 120 : 150;
    for (let i = 0; i < buildingCount; i++) {
        buildings.push({
            x: i * buildingSpacing,
            height: 100 + Math.random() * 150,
            width: 120 + Math.random() * 30,
            color: Object.values(cityColors).slice(0, 5)[Math.floor(Math.random() * 5)],
            neonColor: Object.values(cityColors).slice(5, 8)[Math.floor(Math.random() * 3)],
            glowIntensity: 0.5 + Math.random() * 0.5
        });
    }
    
    // Crear estrellas - menos en móviles para mejor rendimiento
    const starCount = isMobile ? 40 : 100;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - 100),
            size: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.8 + 0.2,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Iniciar el juego
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    gameState = 'playing';
    score = 0;
    obstacles = [];
    bat.y = canvas.height / 2;
    bat.velocity = -3;
    frameCount = 0;
    gameLoop();
}

// Reiniciar el juego
function restartGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    startGame();
}

// Saltar
function jump() {
    if (gameState === 'playing') {
        bat.velocity = bat.jump;
        // Efecto de sonido (opcional)
        playSound('jump');
    }
}

// Actualizar el juego
function update() {
    if (gameState !== 'playing') return;
    
    // Actualizar murciélago
    bat.velocity += bat.gravity;
    // Limitar velocidad máxima de caída
    if (bat.velocity > bat.maxFallSpeed) {
        bat.velocity = bat.maxFallSpeed;
    }
    bat.y += bat.velocity;
    bat.rotation = Math.min(Math.max(bat.velocity * 3, -30), 90);
    bat.wingAngle += bat.wingSpeed;
    
    // Límites del canvas
    if (bat.y + bat.height > canvas.height) {
        bat.y = canvas.height - bat.height;
        gameOver();
    }
    if (bat.y < 0) {
        bat.y = 0;
        bat.velocity = 0;
    }
    
    // Actualizar obstáculos
    frameCount++;
    if (frameCount % 150 === 0) {
        createObstacle();
    }
    
    // Mover y verificar obstáculos - más lento en móviles para mejor rendimiento
    const obstacleSpeed = isMobile ? 2 : 3;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        
        // Verificar colisión
        if (checkCollision(bat, obstacles[i])) {
            gameOver();
        }
        
        // Incrementar puntuación
        if (!obstacles[i].passed && obstacles[i].x + obstacleWidth < bat.x) {
            obstacles[i].passed = true;
            score++;
            document.getElementById('score').textContent = score;
            playSound('score');
        }
        
        // Eliminar obstáculos fuera de pantalla
        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    // Actualizar fondo
    updateBackground();
}

// Actualizar fondo
function updateBackground() {
    // Mover edificios - más lento en móviles
    const backgroundSpeed = isMobile ? 0.3 : 0.5;
    for (let building of buildings) {
        building.x -= backgroundSpeed;
        if (building.x + building.width < 0) {
            building.x = canvas.width;
            building.height = 100 + Math.random() * 150;
            building.color = Object.values(cityColors).slice(0, 5)[Math.floor(Math.random() * 5)];
            building.neonColor = Object.values(cityColors).slice(5, 8)[Math.floor(Math.random() * 3)];
        }
    }
    
    // Animar estrellas (parpadeo)
    for (let star of stars) {
        star.twinkle += 0.05;
        star.brightness = 0.3 + Math.sin(star.twinkle) * 0.5;
    }
}

// Crear obstáculo (edificio)
function createObstacle() {
    const minHeight = 100;
    const maxHeight = canvas.height - obstacleGap - 100;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
    
    obstacles.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + obstacleGap,
        passed: false,
        color: Object.values(cityColors).slice(0, 5)[Math.floor(Math.random() * 5)],
        neonColor: Object.values(cityColors).slice(5, 8)[Math.floor(Math.random() * 3)],
        glowIntensity: 0.5 + Math.random() * 0.5
    });
}

// Verificar colisión
function checkCollision(bat, obstacle) {
    const batLeft = bat.x;
    const batRight = bat.x + bat.width;
    const batTop = bat.y;
    const batBottom = bat.y + bat.height;
    
    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + obstacleWidth;
    
    // Verificar si hay superposición horizontal
    if (batRight > obsLeft && batLeft < obsRight) {
        // Verificar colisión con edificio superior o inferior
        if (batTop < obstacle.topHeight || batBottom > obstacle.bottomY) {
            return true;
        }
    }
    
    return false;
}

// Dibujar
function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo
    drawBackground();
    
    // Dibujar obstáculos
    drawObstacles();
    
    // Dibujar murciélago
    drawBat();
}

// Dibujar fondo
function drawBackground() {
    // Cielo nocturno futurista
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2e'); // Azul muy oscuro arriba
    gradient.addColorStop(0.5, '#16213e'); // Azul oscuro medio
    gradient.addColorStop(1, '#1a1a3e'); // Púrpura oscuro abajo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Estrellas
    for (let star of stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Estrellas brillantes con efecto de cruz
        if (star.brightness > 0.6) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.brightness * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 2, star.y);
            ctx.lineTo(star.x + star.size * 2, star.y);
            ctx.moveTo(star.x, star.y - star.size * 2);
            ctx.lineTo(star.x, star.y + star.size * 2);
            ctx.stroke();
        }
    }
    
    // Edificios del fondo futuristas
    for (let building of buildings) {
        drawBackgroundBuilding(building);
    }
    
    // Suelo futurista con líneas neón
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Líneas neón en el suelo
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 30);
        ctx.lineTo(i, canvas.height - 5);
        ctx.stroke();
    }
    
    // Líneas horizontales neón
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 15);
    ctx.lineTo(canvas.width, canvas.height - 15);
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
}

// Función eliminada (ya no usamos nubes)

// Función para determinar si una ventana está encendida (basado en posición fija)
function isWindowOn(x, y, seed) {
    // Usar posición como semilla para estado fijo
    const hash = Math.floor(x * 1000 + y * 1000 + seed) % 100;
    return hash > 35; // 65% de ventanas encendidas
}

// Dibujar edificio futurista del fondo
function drawBackgroundBuilding(building) {
    const x = building.x;
    const y = canvas.height - 30 - building.height;
    const width = building.width;
    const height = building.height;
    const seed = Math.floor(x / 10); // Semilla basada en posición X
    
    // Efecto de brillo neón detrás del edificio
    const glowGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, 0,
        x + width / 2, y + height / 2, width * 1.5
    );
    glowGradient.addColorStop(0, building.neonColor + '40');
    glowGradient.addColorStop(1, building.neonColor + '00');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - width * 0.5, y - height * 0.5, width * 2, height * 2);
    
    // Edificio principal (oscuro con brillo)
    const buildingGradient = ctx.createLinearGradient(x, y, x + width, y);
    buildingGradient.addColorStop(0, '#001122');
    buildingGradient.addColorStop(0.5, building.color + '30');
    buildingGradient.addColorStop(1, '#001122');
    ctx.fillStyle = buildingGradient;
    ctx.fillRect(x, y, width, height);
    
    // Bordes neón
    ctx.strokeStyle = building.neonColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(x, y, width, height);
    
    // Líneas verticales neón
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (width / 4) * i, y);
        ctx.lineTo(x + (width / 4) * i, y + height);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
    
    // Ventanas futuristas (estado fijo basado en posición)
    const windowSize = 6;
    const windowGap = 12;
    for (let wy = y + 15; wy < y + height - 10; wy += windowGap) {
        for (let wx = x + 8; wx < x + width - 8; wx += windowGap) {
            const isOn = isWindowOn(wx, wy, seed);
            if (isOn) {
                // Ventana encendida con brillo
                ctx.fillStyle = building.neonColor;
                ctx.fillRect(wx, wy, windowSize, windowSize);
                
                // Brillo alrededor
                setShadowBlur(5);
                ctx.shadowColor = building.neonColor;
                ctx.fillRect(wx, wy, windowSize, windowSize);
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = cityColors.windowOff;
                ctx.fillRect(wx, wy, windowSize, windowSize);
            }
        }
    }
    
    // Antena futurista en el techo
    if (height > 80) {
        const antennaX = x + width / 2;
        ctx.strokeStyle = building.neonColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(antennaX, y);
        ctx.lineTo(antennaX, y - 20);
        ctx.stroke();
        
        // Luz parpadeante en la antena (más lento)
        const blink = Math.sin(Date.now() / 1500) * 0.3 + 0.7; // Más lento y menos variación
        ctx.fillStyle = building.neonColor;
        ctx.globalAlpha = blink;
        setShadowBlur(10);
        ctx.shadowColor = building.neonColor;
        ctx.beginPath();
        ctx.arc(antennaX, y - 20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }
}

// Dibujar obstáculos
function drawObstacles() {
    for (let obstacle of obstacles) {
        // Edificio superior futurista
        drawBuilding(obstacle.x, 0, obstacleWidth, obstacle.topHeight, obstacle.color, obstacle.neonColor, obstacle.glowIntensity, true);
        
        // Edificio inferior futurista
        const bottomHeight = canvas.height - 30 - obstacle.bottomY;
        drawBuilding(obstacle.x, obstacle.bottomY, obstacleWidth, bottomHeight, obstacle.color, obstacle.neonColor, obstacle.glowIntensity, false);
    }
}

// Dibujar edificio futurista (obstáculo)
function drawBuilding(x, y, width, height, color, neonColor, glowIntensity, isTop) {
    // Efecto de brillo neón alrededor del edificio
    const glowGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, 0,
        x + width / 2, y + height / 2, width * 2
    );
    glowGradient.addColorStop(0, neonColor + Math.floor(glowIntensity * 80).toString(16).padStart(2, '0'));
    glowGradient.addColorStop(0.5, neonColor + '40');
    glowGradient.addColorStop(1, neonColor + '00');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(x - width, y - height, width * 3, height * 3);
    
    // Edificio principal con gradiente oscuro
    const buildingGradient = ctx.createLinearGradient(x, y, x + width, y);
    buildingGradient.addColorStop(0, '#000811');
    buildingGradient.addColorStop(0.3, color + '40');
    buildingGradient.addColorStop(0.7, color + '40');
    buildingGradient.addColorStop(1, '#000811');
    ctx.fillStyle = buildingGradient;
    ctx.fillRect(x, y, width, height);
    
    // Bordes neón brillantes
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.9;
    ctx.strokeRect(x, y, width, height);
    
    // Líneas verticales neón
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (width / 5) * i, y);
        ctx.lineTo(x + (width / 5) * i, y + height);
        ctx.stroke();
    }
    
    // Líneas horizontales neón
    for (let i = 1; i < 8; i++) {
        if (y + (height / 8) * i < y + height - 5) {
            ctx.beginPath();
            ctx.moveTo(x, y + (height / 8) * i);
            ctx.lineTo(x + width, y + (height / 8) * i);
            ctx.stroke();
        }
    }
    
    ctx.globalAlpha = 1.0;
    
    // Ventanas futuristas brillantes (estado fijo)
    const windowSize = 7;
    const windowGap = 14;
    const startY = isTop ? Math.max(y, 15) : y + 8;
    const endY = isTop ? y + height - 8 : y + height - 15;
    const seed = Math.floor(x / 10); // Semilla basada en posición X
    
    for (let wy = startY; wy < endY; wy += windowGap) {
        for (let wx = x + 8; wx < x + width - 8; wx += windowGap) {
            const isOn = isWindowOn(wx, wy, seed);
            if (isOn) {
                // Ventana encendida con efecto neón
                ctx.fillStyle = neonColor;
                setShadowBlur(8);
                ctx.shadowColor = neonColor;
                ctx.fillRect(wx, wy, windowSize, windowSize);
                ctx.shadowBlur = 0;
                
                // Brillo interno
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(wx + 1, wy + 1, windowSize - 2, windowSize - 2);
            } else {
                ctx.fillStyle = cityColors.windowOff;
                ctx.fillRect(wx, wy, windowSize, windowSize);
            }
        }
    }
    
    // Antena futurista con luz parpadeante (más lento)
    if (isTop && height > 60) {
        const antennaX = x + width / 2;
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 2;
        setShadowBlur(5);
        ctx.shadowColor = neonColor;
        ctx.beginPath();
        ctx.moveTo(antennaX, y + height);
        ctx.lineTo(antennaX, y + height - 25);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Luz parpadeante en la punta (más lento y suave)
        const blink = Math.sin(Date.now() / 1500) * 0.3 + 0.7; // Más lento y menos variación
        ctx.fillStyle = neonColor;
        ctx.globalAlpha = blink;
        setShadowBlur(15);
        ctx.shadowColor = neonColor;
        ctx.beginPath();
        ctx.arc(antennaX, y + height - 25, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }
    
    // Efectos de partículas neón (opcional, para edificios altos)
    if (height > 100) {
        ctx.fillStyle = neonColor;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 3; i++) {
            const px = x + Math.random() * width;
            const py = y + Math.random() * height;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }
}

// Dibujar murciélago
function drawBat() {
    ctx.save();
    ctx.translate(bat.x + bat.width / 2, bat.y + bat.height / 2);
    ctx.rotate((bat.rotation * Math.PI) / 180);
    
    // Cuerpo del murciélago
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeza
    ctx.fillStyle = '#6a1b9a';
    ctx.beginPath();
    ctx.arc(-8, -5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Orejas
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.moveTo(-12, -12);
    ctx.lineTo(-8, -20);
    ctx.lineTo(-5, -12);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-3, -12);
    ctx.lineTo(0, -18);
    ctx.lineTo(3, -12);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = '#FFE66D';
    ctx.beginPath();
    ctx.arc(-12, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-4, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-12, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-4, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Alas
    const wingFlap = Math.sin(bat.wingAngle) * 15;
    
    // Ala izquierda
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-25, wingFlap - 20, -35, wingFlap - 10);
    ctx.quadraticCurveTo(-30, wingFlap + 5, -15, 10);
    ctx.fill();
    
    // Ala derecha
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(25, wingFlap - 20, 35, wingFlap - 10);
    ctx.quadraticCurveTo(30, wingFlap + 5, 15, 10);
    ctx.fill();
    
    // Detalles de las alas
    ctx.strokeStyle = '#4a148c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-15, 5);
    ctx.lineTo(-20, wingFlap - 15);
    ctx.moveTo(-10, 8);
    ctx.lineTo(-25, wingFlap - 5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(15, 5);
    ctx.lineTo(20, wingFlap - 15);
    ctx.moveTo(10, 8);
    ctx.lineTo(25, wingFlap - 5);
    ctx.stroke();
    
    ctx.restore();
}

// Game Over
function gameOver() {
    gameState = 'gameover';
    
    // Actualizar mejor puntuación
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    
    playSound('gameover');
}

// Loop del juego
function gameLoop() {
    update();
    draw();
    
    if (gameState === 'playing') {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Efectos de sonido simples con Web Audio API
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'jump') {
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'score') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'gameover') {
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Hacer responsive el canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(baseWidth, container.clientWidth - 40);
    const scale = maxWidth / baseWidth;
    
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = (baseHeight * scale) + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Inicializar el juego cuando se carga la página
init();


