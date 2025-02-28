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
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// Spawn room coordinates (center of the maze)
const spawnRoom = {
    x: Math.floor(maze.length / 2),
    z: Math.floor(maze[0].length / 2)
};

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

// Score Display
const scoreDiv = document.createElement('div');
scoreDiv.style.position = 'absolute';
scoreDiv.style.top = '10px';
scoreDiv.style.left = '10px';
scoreDiv.style.color = 'white';
scoreDiv.style.fontSize = '24px';
document.body.appendChild(scoreDiv);

function updateScoreDisplay() {
    scoreDiv.innerHTML = `Score: ${score}`;
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

// Create Power Pellets
const powerPelletGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const powerPelletMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });

function createPowerPellet(x, z) {
    const powerPellet = new THREE.Mesh(powerPelletGeometry, powerPelletMaterial);
    powerPellet.position.set(x, 0.2, z);
    collectibles.push(powerPellet);
    scene.add(powerPellet);
}
// Place power pellets in random valid locations
for (let i = 0; i < 2; i++) { // Place 2 power pellets
    const { x, z } = getValidPosition();
    createPowerPellet(x - maze.length / 2, z - maze[0].length / 2);
}

// Create Pac-Man
const pacmanGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const pacmanMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
pacman.direction = new THREE.Vector3(1, 0, 0); // Default direction (right)
scene.add(pacman);

// Create Ghosts
const ghostGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const ghosts = [];
const ghostCount = 4;
const ghostMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

// Create Ghosts
for (let i = 0; i < ghostCount; i++) {
    const { x, z } = getValidPosition();
    const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
    ghost.position.set(x - maze.length / 2, 0, z - maze[0].length / 2);
    ghosts.push(ghost);
    scene.add(ghost);
}

// Third-Person Camera Setup
const cameraOffsets = {
    up: new THREE.Vector3(0, 5, 10),    // Camera behind Pac-Man when facing up
    down: new THREE.Vector3(0, 5, -10), // Camera behind Pac-Man when facing down
    left: new THREE.Vector3(-10, 5, 0),  // Camera behind Pac-Man when facing left
    right: new THREE.Vector3(10, 5, 0)   // Camera behind Pac-Man when facing right
};
const cameraSmoothness = 0.1; // Adjust this value for faster/slower transitions
let targetCameraPosition = new THREE.Vector3();
let targetCameraQuaternion = new THREE.Quaternion();
// Function to update camera position and rotation based on Pac-Man's direction
function updateCamera() {
    let offset;
    if (pacman.direction.z === 1) {
        offset = cameraOffsets.up; // Pac-Man is facing up
    } else if (pacman.direction.z === -1) {
        offset = cameraOffsets.down; // Pac-Man is facing down
    } else if (pacman.direction.x === 1) {
        offset = cameraOffsets.right; // Pac-Man is facing right
    } else if (pacman.direction.x === -1) {
        offset = cameraOffsets.left; // Pac-Man is facing left
    } else {
        offset = cameraOffsets.right; // Default to right if no direction
    }

    // Calculate target camera position
    targetCameraPosition.copy(pacman.position).add(offset);

    // Smoothly interpolate camera position
    camera.position.lerp(targetCameraPosition, cameraSmoothness);

    // Calculate target camera rotation (look at Pac-Man)
    const targetLookAt = pacman.position.clone();
    const cameraToPacMan = targetLookAt.sub(camera.position).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward
        cameraToPacMan
    );

    // Smoothly interpolate camera rotation
    camera.quaternion.slerp(targetQuaternion, cameraSmoothness);
}


// Pac-Man Movement
const speed = 0.1;
let gameOver = false;
let score = 0;
pacman.direction = new THREE.Vector3(1, 0, 0); // Default direction (right)
let gameOverDiv = null;
let frightenedMode = false;

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

document.addEventListener('keydown', (event) => {
    if (gameOver) {
        if (event.key === 'r') {
            restartGame();
        }
        return;
    }

    switch (event.key) {
        case 'ArrowDown':
            pacman.direction.set(0, 0, -1); // Down
            break;
        case 'ArrowUp':
            pacman.direction.set(0, 0, 1); // Up
            break;
        case 'ArrowLeft':
            pacman.direction.set(-1, 0, 0); // Left
            break;
        case 'ArrowRight':
            pacman.direction.set(1, 0, 0); // Right
            break;
    }
    pacman.direction.normalize(); // Ensure the direction vector has a length of 1
});
function snapToGrid() {
    // Calculate grid coordinates based on Pac-Man's position and maze center
    const gridX = Math.round(pacman.position.x + maze.length / 2);
    const gridZ = Math.round(pacman.position.z + maze[0].length / 2);

    // Adjust Pac-Man's position to the center of the grid cell
    pacman.position.x = gridX - maze.length / 2;
    pacman.position.z = gridZ - maze[0].length / 2;
}
let lastDirection = new THREE.Vector3(0, 0, 0); // Track the last direction

function movePacman() {
    if (pacman.direction.length() === 0) return; // No movement if direction is zero

    // Snap to grid if direction changes
    if (!pacman.direction.equals(lastDirection)) {
        snapToGrid();
        lastDirection.copy(pacman.direction);
    }

    const newX = pacman.position.x + pacman.direction.x * speed;
    const newZ = pacman.position.z + pacman.direction.z * speed;

    if (isValidMove(newX, newZ)) {
        pacman.position.x = newX;
        pacman.position.z = newZ;
    } else {
        // Stop movement if the next move is invalid
        pacman.direction.set(0, 0, 0);
    }

    // Rotate Pac-Man based on direction
    if (pacman.direction.x === 1) pacman.rotation.y = Math.PI / 2; // Right
    else if (pacman.direction.x === -1) pacman.rotation.y = -Math.PI / 2; // Left
    else if (pacman.direction.z === 1) pacman.rotation.y = Math.PI; // Down
    else if (pacman.direction.z === -1) pacman.rotation.y = 0; // Up
}
// Pac-Man Mouth Animation
let mouthOpen = true;
function animatePacman() {
    if (mouthOpen) {
        pacman.scale.x = 0.8; // Close mouth
    } else {
        pacman.scale.x = 1; // Open mouth
    }
    mouthOpen = !mouthOpen;
}

// Call this function in the animate loop
setInterval(animatePacman, 200);
const ghostBehaviors = ['chase', 'ambush', 'random', 'patrol'];

function moveGhosts() {
    ghosts.forEach((ghost, index) => {
        const behavior = ghostBehaviors[index % ghostBehaviors.length]; // Assign behavior
        const directions = [
            { x: 0, z: -1 }, // Up
            { x: 0, z: 1 },  // Down
            { x: -1, z: 0 }, // Left
            { x: 1, z: 0 }   // Right
        ];

        const validDirections = directions.filter(dir => {
            const newX = ghost.position.x + dir.x * speed;
            const newZ = ghost.position.z + dir.z * speed;
            return isValidMove(newX, newZ);
        });

        let bestDirection;
        if (frightenedMode) {
            bestDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            switch (behavior) {
                case 'chase':
                    bestDirection = chasePacMan(ghost, validDirections);
                    break;
                case 'ambush':
                    bestDirection = ambushPacMan(ghost, validDirections);
                    break;
                case 'random':
                    bestDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
                    break;
                case 'patrol':
                    bestDirection = patrol(ghost, validDirections);
                    break;
            }
        }

        if (bestDirection) {
            ghost.position.x += bestDirection.x * speed;
            ghost.position.z += bestDirection.z * speed;
        }
    });
}

function chasePacMan(ghost, validDirections) {
    let minDistance = Infinity;
    let bestDirection;
    validDirections.forEach(dir => {
        const newX = ghost.position.x + dir.x * speed;
        const newZ = ghost.position.z + dir.z * speed;
        const distance = Math.hypot(pacman.position.x - newX, pacman.position.z - newZ);
        if (distance < minDistance) {
            minDistance = distance;
            bestDirection = dir;
        }
    });
    return bestDirection;
}

function ambushPacMan(ghost, validDirections) {
    if (!pacman.direction) {
        console.error("Pac-Man direction is undefined!");
        return validDirections[0]; // Return a default direction
    }

    // Predict Pac-Man's future position
    const targetX = pacman.position.x + pacman.direction.x * 2;
    const targetZ = pacman.position.z + pacman.direction.z * 2;

    let minDistance = Infinity;
    let bestDirection;

    validDirections.forEach(dir => {
        const newX = ghost.position.x + dir.x * speed;
        const newZ = ghost.position.z + dir.z * speed;
        const distance = Math.hypot(targetX - newX, targetZ - newZ);

        if (distance < minDistance) {
            minDistance = distance;
            bestDirection = dir;
        }
    });

    return bestDirection;
}

function patrol(ghost, validDirections) {
    // Simple patrol logic (e.g., move in a fixed pattern)
    return validDirections[Math.floor(Math.random() * validDirections.length)];
}
function getValidPosition() {
    let x, z;
    do {
        x = Math.floor(Math.random() * maze.length);
        z = Math.floor(Math.random() * maze[0].length);
    } while (maze[x][z] !== 0); // Keep searching until a valid position is found
    return { x, z };
}
// Frightened Mode for Ghosts
function setFrightenedMode() {
    frightenedMode = true;
    ghosts.forEach(ghost => {
        ghost.material.color.set(0x0000ff); // Change color to blue
    });
    setTimeout(() => {
        frightenedMode = false;
        ghosts.forEach(ghost => {
            ghost.material.color.set(0xff0000); // Revert to red
        });
    }, 5000); // Frightened mode lasts 5 seconds
}

// Check for Collectibles and Ghost Collisions
function checkCollisions() {
    // Ghost Collision
    ghosts.forEach(ghost => {
        if (Math.abs(pacman.position.x - ghost.position.x) < 0.5 && Math.abs(pacman.position.z - ghost.position.z) < 0.5) {
            if (frightenedMode) {
                // Pac-Man eats the ghost
                ghost.position.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);
                score += 10;
            } else {
                gameOver = true;
                showGameOver();
            }
        }
    });

    // Collectibles
    collectibles.forEach((collectible, index) => {
        if (Math.abs(pacman.position.x - collectible.position.x) < 0.5 && Math.abs(pacman.position.z - collectible.position.z) < 0.5) {
            scene.remove(collectible);
            collectibles.splice(index, 1);
            score += 1;
            if (collectible.material.color.getHex() === 0xff00ff) {
                setFrightenedMode(); // Activate frightened mode if it's a power pellet
            }
        }
    });

    // Win Condition
    if (collectibles.length === 0) {
        gameOver = true;
        showWinMessage();
    }
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

// Show Win Message
function showWinMessage() {
    gameOverDiv = document.createElement('div');
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.color = 'green';
    gameOverDiv.style.fontSize = '48px';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.borderRadius = '10px';
    gameOverDiv.innerHTML = `You Win! Score: ${score}. Press "R" to Restart`;
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

function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        movePacman();
        moveGhosts(); // Update ghost positions
        checkCollisions();
        updateScoreDisplay();
    }

    // Update camera position and rotation
    updateCamera();

    renderer.render(scene, camera);
}

animate();