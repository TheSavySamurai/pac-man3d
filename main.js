// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
light.castShadow = false; // Disable shadow casting
scene.add(light);

// Ambient light to reduce harsh shadows
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Original Pac-Man Level 1 Maze
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const walls = [];

for (let x = 0; x < maze.length; x++) {
    for (let z = 0; z < maze[x].length; z++) {
        if (maze[x][z] === 1) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.set(x - maze.length / 2, 0, z - maze[x].length / 2);
            walls.push(wall);
            scene.add(wall);
        }
    }
}

// Create Collectibles
const collectibles = [];
const collectibleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const collectibleMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

function createCollectible(x, z) {
    const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
    collectible.position.set(x, 0.2, z);
    collectibles.push(collectible);
    scene.add(collectible);
}

// Place collectibles in the maze
for (let x = 0; x < maze.length; x++) {
    for (let z = 0; z < maze[x].length; z++) {
        if (maze[x][z] === 0) {
            createCollectible(x - maze.length / 2, z - maze[x].length / 2);
        }
    }
}

// Create Pac-Man
const pacmanGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const pacmanMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
scene.add(pacman);

// Create Ghosts
const ghostGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const ghosts = [];
const ghostCount = 4;
const ghostMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

for (let i = 0; i < ghostCount; i++) {
    const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
    ghost.position.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);
    ghosts.push(ghost);
    scene.add(ghost);
}

// Third-Person Camera Setup
const cameraOffset = new THREE.Vector3(0, 5, -10); // Camera offset behind Pac-Man
camera.position.copy(pacman.position).add(cameraOffset);
camera.lookAt(pacman.position);

// Pac-Man Movement
const speed = 0.1;
let direction = new THREE.Vector3();
let gameOver = false;
let score = 0;
let gameOverDiv = null;

// Convert world position to grid coordinates
function toGridCoordinates(x, z) {
    const gridX = Math.round(x + maze.length / 2);
    const gridZ = Math.round(z + maze[0].length / 2);
    return { x: gridX, z: gridZ };
}

// Check if a position is valid (not a wall)
function isValidMove(x, z) {
    const grid = toGridCoordinates(x, z);
    if (grid.x < 0 || grid.x >= maze.length || grid.z < 0 || grid.z >= maze[0].length) {
        return false; // Out of bounds
    }
    return maze[grid.x][grid.z] === 0; // 0 is a valid path
}

// Handle Keydown to Set Direction
document.addEventListener('keydown', (event) => {
    if (gameOver) {
        if (event.key === 'r') {
            restartGame();
        }
        return;
    }

    switch (event.key) {
        case 'ArrowDown':
            direction.set(0, 0, -1);
            break;
        case 'ArrowUp':
            direction.set(0, 0, 1);
            break;
        case 'ArrowRight':
            direction.set(-1, 0, 0);
            break;
        case 'ArrowLeft':
            direction.set(1, 0, 0);
            break;
    }
    direction.normalize();
});

// Move Pac-Man
function movePacman() {
    if (direction.length() === 0) return;

    const newX = pacman.position.x + direction.x * speed;
    const newZ = pacman.position.z + direction.z * speed;

    if (isValidMove(newX, newZ)) {
        pacman.position.x = newX;
        pacman.position.z = newZ;
    }
}

// Ghost AI: Chase Pac-Man
function moveGhosts() {
    ghosts.forEach(ghost => {
        const directions = [
            { x: 0, z: -1 }, // Up
            { x: 0, z: 1 },  // Down
            { x: -1, z: 0 }, // Left
            { x: 1, z: 0 }   // Right
        ];

        // Find the direction that moves the ghost closer to Pac-Man
        let bestDirection = null;
        let minDistance = Infinity;

        directions.forEach(dir => {
            const newX = ghost.position.x + dir.x * speed;
            const newZ = ghost.position.z + dir.z * speed;

            if (isValidMove(newX, newZ)) {
                const distance = Math.hypot(pacman.position.x - newX, pacman.position.z - newZ);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = dir;
                }
            }
        });

        // Move the ghost in the best direction
        if (bestDirection) {
            ghost.position.x += bestDirection.x * speed;
            ghost.position.z += bestDirection.z * speed;
        }
    });
}

// Check for Collectibles and Ghost Collisions
function checkCollisions() {
    // Ghost Collision
    ghosts.forEach(ghost => {
        if (Math.abs(pacman.position.x - ghost.position.x) < 0.5 && Math.abs(pacman.position.z - ghost.position.z) < 0.5) {
            gameOver = true;
            showGameOver();
        }
    });

    // Collectibles
    collectibles.forEach((collectible, index) => {
        if (Math.abs(pacman.position.x - collectible.position.x) < 0.5 && Math.abs(pacman.position.z - collectible.position.z) < 0.5) {
            scene.remove(collectible);
            collectibles.splice(index, 1);
            score += 1;
        }
    });
}

// Show Game Over Message
function showGameOver() {
    gameOverDiv = document.createElement('div');
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.color = 'red';
    gameOverDiv.style.fontSize = '48px';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.borderRadius = '10px';
    gameOverDiv.innerHTML = `Game Over! Score: ${score}. Press "R" to Restart`;
    document.body.appendChild(gameOverDiv);
}

// Restart Game
function restartGame() {
    pacman.position.set(0, 0, 0);
    ghosts.forEach(ghost => {
        ghost.position.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);
    });
    score = 0;
    gameOver = false;
    if (gameOverDiv) {
        document.body.removeChild(gameOverDiv);
        gameOverDiv = null;
    }
}

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        movePacman();
        moveGhosts();
        checkCollisions();
    }

    // Update Camera Position
    camera.position.copy(pacman.position).add(cameraOffset);
    camera.lookAt(pacman.position);

    renderer.render(scene, camera);
}

animate();
