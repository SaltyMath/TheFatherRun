const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

// Paramètres du joueur
const playerHeight = 40;
const playerWidth = 40;
let playerY, playerVelocity, isJumping;

// Charger l'image du joueur
const playerImage = new Image();
playerImage.src = 'images/TheFather.png';

// Charger les images des obstacles
const obstacleImages = [
    new Image(),
    new Image()
];
obstacleImages[0].src = 'images/arbre.png';
obstacleImages[1].src = 'images/arbre.png';

// Paramètres des obstacles et du jeu
let score, obstacles, gameSpeed, isGameOver, obstacleTimer;
const maxObstacleHeight = 30;
const maxObstacleWidth = 24;
const obstacleInterval = 150;

// Événements de saut et de chute rapide
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && !isJumping) {
        isJumping = true;
        playerVelocity = -9;
    }
    if (event.key === 'ArrowDown') {
        playerVelocity += 5;
    }
});

// Fonction pour initialiser ou réinitialiser le jeu
function resetGame() {
    playerY = canvas.height - playerHeight;
    playerVelocity = 0;
    isJumping = false;

    score = 0;
    obstacles = [];
    gameSpeed = 1.5;
    isGameOver = false;
    obstacleTimer = 0;

    // Redémarrer la boucle de jeu
    window.requestAnimationFrame(updateGame);
}

// Fonction pour mettre à jour le joueur
function updatePlayer() {
    if (isJumping) {
        playerY += playerVelocity;
        playerVelocity += 0.3;
        if (playerY > canvas.height - playerHeight) {
            playerY = canvas.height - playerHeight;
            isJumping = false;
        }
    }
    ctx.drawImage(playerImage, 10, playerY, playerWidth, playerHeight);
}

// Fonction pour ajouter des obstacles
function addObstacle() {
    let randomIndex = Math.floor(Math.random() * obstacleImages.length);
    let originalImage = obstacleImages[randomIndex];

    let aspectRatio = originalImage.width / originalImage.height;
    let width = Math.min(maxObstacleWidth, originalImage.width);
    let height = width / aspectRatio;

    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: width,
        height: height,
        image: originalImage
    });
}

// Fonction pour mettre à jour les obstacles
function updateObstacles() {
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        addObstacle();
        obstacleTimer = 0;
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Fonction pour mettre à jour le score
function updateScore() {
    score++;
    ctx.fillStyle = 'blue';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Fonction principale du jeu
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateObstacles();
    checkCollision();
    updateScore();

    window.requestAnimationFrame(updateGame);
}

// Fonction pour vérifier les collisions
function checkCollision() {
    obstacles.forEach(obstacle => {
        if (10 < obstacle.x + obstacle.width && 
            10 + playerWidth > obstacle.x &&
            playerY < obstacle.y + obstacle.height &&
            playerY + playerHeight > obstacle.y) {
            gameOver();
        }
    });
}

// Fonction pour gérer la fin de partie
function gameOver() {
    isGameOver = true;
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
}

// Ajouter un événement au bouton Reset
resetButton.addEventListener('click', resetGame);

// Démarrer le jeu
resetGame();
