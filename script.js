let teacher = document.getElementById('teacher');
let gameArea = document.getElementById('gameArea');
let scoreDisplay = document.getElementById('score');
let highScoresList = document.getElementById('highScores');

let teacherPositionX = 50; // Opettajan lähtöpaikka vaakasuunnassa
let teacherPositionY = 280; // Korjattu opettajan lähtöpaikka pystysuunnassa
let teacherJumping = false;
let teacherVelocityY = 0;
let gravity = 0.5;
let jumpStrength = -15; // Lisää hyppyvoimaa

let score = 0;
let gameSpeed = 60; // Pelinopeus (fps)
let enemySpeed = 3; // Vihollisten nopeus
let enemies = [];

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && teacherPositionX > 0) {
        teacherPositionX -= 10;
    } else if (event.key === 'ArrowRight' && teacherPositionX < 330) { // Päivitetty oikean reunan raja
        teacherPositionX += 10;
    } else if (event.key === ' ' && !teacherJumping) { // Välilyönti hypyn aloittamiseksi
        teacherJumping = true;
        teacherVelocityY = jumpStrength;
    }
    teacher.style.left = teacherPositionX + 'px';
});

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = '400px'; // Vihollinen alkaa pelialueen oikealta laidalta
    enemy.style.bottom = '0px'; // Vihollinen asetettu maan tasolle
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let enemyLeft = parseInt(enemy.style.left);
        enemyLeft -= enemySpeed; // Vihollinen liikkuu vasemmalle

        if (enemyLeft < -50) { // Jos vihollinen menee pelialueen ulkopuolelle
            gameArea.removeChild(enemy);
            enemies.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
            if (score % 5 === 0) {
                enemySpeed++; // Lisää vihollisten nopeutta joka viides piste
            }
        } else {
            enemy.style.left = enemyLeft + 'px'; // Päivitetään vihollisen sijainti
        }
    });
}

function updateTeacher() {
    if (teacherJumping) {
        teacherVelocityY += gravity; // Sovelletaan painovoimaa hyppäävään opettajaan
        teacherPositionY += teacherVelocityY;
        if (teacherPositionY >= 280) { // Tarkistetaan, onko opettaja maan tasalla
            teacherPositionY = 280;
            teacherJumping = false;
            teacherVelocityY = 0;
        }
        teacher.style.top = teacherPositionY + 'px';
    }
}

function checkCollision() {
    enemies.forEach(enemy => {
        let enemyRect = enemy.getBoundingClientRect();
        let teacherRect = teacher.getBoundingClientRect();
        if (!(teacherRect.right < enemyRect.left || 
              teacherRect.left > enemyRect.right || 
              teacherRect.bottom < enemyRect.top || 
              teacherRect.top > enemyRect.bottom)) {
            gameOver();
        }
    });
}

function gameOver() {
    let playerName = prompt('Peli päättyi! Pisteesi: ' + score + '. Anna nimesi:');
    saveHighScore(score, playerName);
    displayHighScores();
    window.location.reload();
}

function saveHighScore(score, name) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const newScore = { score: score, name: name || 'Nimetön' };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score); // Järjestä pisteet laskevasti
    highScores.splice(5); // Pidä vain 5 parasta tulosta
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScoresList.innerHTML = highScores
        .map(scoreEntry => `<li>${scoreEntry.name} - ${scoreEntry.score}</li>`)
        .join('');
}

function gameLoop() {
    moveEnemies();
    updateTeacher();
    checkCollision();
    setTimeout(gameLoop, 1000 / gameSpeed);
}

setInterval(createEnemy, 1500); // Luo uusi vihollinen joka 1,5 sekunti
gameLoop();
displayHighScores(); // Alusta pistetaulukko
