const STAR_COSTS = {
    1: 50,
    2: 100,
    3: 200,
    4: 300
};

const MAX_COST = 5;

let currentStar = 1;
let targetStar = 2;

function updateStarsDisplay() {
    const currentStarsDisplay = document.getElementById('currentStarsDisplay');
    currentStarsDisplay.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= currentStar ? 'star filled' : 'star empty';
        currentStarsDisplay.appendChild(star);
    }

    const targetStarsDisplay = document.getElementById('targetStarsDisplay');
    targetStarsDisplay.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        if (i < targetStar) {
            star.className = 'star filled';
        } else if (i === targetStar) {
            star.className = 'star target';
        } else {
            star.className = 'star empty';
        }
        targetStarsDisplay.appendChild(star);
    }

    document.getElementById('prevStar').disabled = targetStar <= currentStar + 1;
    document.getElementById('nextStar').disabled = targetStar >= 5;
}

function convertStatuesToStarPieces(currentStatues, currentCost, remainingAtCost) {
    let starPieces = 0;
    let remainingStatues = currentStatues;
    const STAR_PIECES_PER_TIER = 25;
    
    let currentTier = currentCost;
    let starPiecesRemainingInTier = remainingAtCost;
    
    if (starPiecesRemainingInTier > 0 && currentTier <= 4) {
        const starPiecesToBuy = Math.min(starPiecesRemainingInTier, STAR_PIECES_PER_TIER);
        const statuesNeededForTier = starPiecesToBuy * currentTier;
        
        if (remainingStatues >= statuesNeededForTier) {
            starPieces += starPiecesToBuy;
            remainingStatues -= statuesNeededForTier;
            currentTier++;
            starPiecesRemainingInTier = 0;
        } else {
            const starPiecesCanBuy = Math.floor(remainingStatues / currentTier);
            starPieces += starPiecesCanBuy;
            remainingStatues -= starPiecesCanBuy * currentTier;
            return { starPieces, remainingStatues };
        }
    } else if (currentTier === 5) {
        const starPiecesCanBuy = Math.floor(remainingStatues / 5);
        starPieces += starPiecesCanBuy;
        remainingStatues -= starPiecesCanBuy * 5;
        return { starPieces, remainingStatues };
    }
    
    while (remainingStatues > 0 && currentTier <= 4) {
        const statuesNeededForTier = STAR_PIECES_PER_TIER * currentTier;
        
        if (remainingStatues >= statuesNeededForTier) {
            starPieces += STAR_PIECES_PER_TIER;
            remainingStatues -= statuesNeededForTier;
            currentTier++;
        } else {
            const starPiecesCanBuy = Math.floor(remainingStatues / currentTier);
            starPieces += starPiecesCanBuy;
            remainingStatues -= starPiecesCanBuy * currentTier;
            break;
        }
    }
    
    if (remainingStatues > 0 && currentTier >= 5) {
        const starPiecesCanBuy = Math.floor(remainingStatues / 5);
        starPieces += starPiecesCanBuy;
        remainingStatues -= starPiecesCanBuy * 5;
    }
    
    return { starPieces, remainingStatues };
}

function calculateStatuesNeededForStarPieces(starPiecesNeeded, startCost, remainingAtCost) {
    let totalStatuesNeeded = 0;
    let remainingStarPieces = starPiecesNeeded;
    const STAR_PIECES_PER_TIER = 25;
    
    let currentTier = startCost;
    let starPiecesRemainingInTier = remainingAtCost;
    
    if (starPiecesRemainingInTier > 0 && currentTier <= 4) {
        const starPiecesCanUse = Math.min(starPiecesRemainingInTier, remainingStarPieces);
        const statuesNeeded = starPiecesCanUse * currentTier;
        totalStatuesNeeded += statuesNeeded;
        remainingStarPieces -= starPiecesCanUse;
        
        if (remainingStarPieces <= 0) {
            return totalStatuesNeeded;
        }
        
        if (starPiecesCanUse >= starPiecesRemainingInTier) {
            currentTier++;
        }
    } else if (currentTier === 5) {
        const statuesNeeded = remainingStarPieces * 5;
        totalStatuesNeeded += statuesNeeded;
        return totalStatuesNeeded;
    } else if (starPiecesRemainingInTier === 0 && currentTier <= 4) {
        currentTier++;
    }
    
    while (remainingStarPieces > 0 && currentTier <= 4) {
        const starPiecesInThisTier = Math.min(remainingStarPieces, STAR_PIECES_PER_TIER);
        const statuesNeededForTier = starPiecesInThisTier * currentTier;
        totalStatuesNeeded += statuesNeededForTier;
        remainingStarPieces -= starPiecesInThisTier;
        currentTier++;
    }
    
    if (remainingStarPieces > 0) {
        const statuesNeeded = remainingStarPieces * 5;
        totalStatuesNeeded += statuesNeeded;
    }
    
    return totalStatuesNeeded;
}

function updateProgressBar(currentStarPieces, needed) {
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    const errorMessage = document.getElementById('errorMessage');
    
    if (needed === 0) {
        progressText.textContent = `${currentStarPieces} / ${needed}`;
        progressFill.style.width = '100%';
        errorMessage.style.display = 'none';
        return;
    }

    const current = parseInt(currentStarPieces) || 0;
    const percentage = Math.min((current / needed) * 100, 100);
    
    progressText.textContent = `${current} / ${needed}`;
    progressFill.style.width = `${percentage}%`;
    
    if (current < needed) {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
}

function formatResult(statues) {
    if (statues === 0) {
        return "0";
    }
    return statues.toLocaleString('pt-BR');
}

function updateResults() {
    const currentStarPieces = parseInt(document.getElementById('currentStarPieces').value) || 0;
    const currentStatues = parseInt(document.getElementById('currentStatues').value) || 0;
    const currentCost = parseInt(document.getElementById('currentCost').value) || 1;
    const remainingAtCost = parseInt(document.getElementById('remainingAtCost').value) || 25;

    let starPiecesNeeded = 0;
    for (let star = currentStar; star < targetStar; star++) {
        starPiecesNeeded += STAR_COSTS[star] || 0;
    }

    const conversion = convertStatuesToStarPieces(currentStatues, currentCost, remainingAtCost);
    const totalStarPieces = currentStarPieces + conversion.starPieces;

    updateProgressBar(totalStarPieces, starPiecesNeeded);

    const missingStarPieces = Math.max(0, starPiecesNeeded - totalStarPieces);
    const statuesNeeded = missingStarPieces > 0 
        ? calculateStatuesNeededForStarPieces(missingStarPieces, currentCost, remainingAtCost)
        : 0;

    let starPiecesForMax = 0;
    for (let star = currentStar; star < 5; star++) {
        starPiecesForMax += STAR_COSTS[star] || 0;
    }
    const missingStarPiecesForMax = Math.max(0, starPiecesForMax - totalStarPieces);
    const statuesForMax = missingStarPiecesForMax > 0
        ? calculateStatuesNeededForStarPieces(missingStarPiecesForMax, currentCost, remainingAtCost)
        : 0;

    document.getElementById('nextStarResult').textContent = formatResult(statuesNeeded);
    document.getElementById('maxStarResult').textContent = formatResult(statuesForMax);
}

document.getElementById('prevStar').addEventListener('click', () => {
    if (targetStar > currentStar + 1) {
        targetStar--;
        updateStarsDisplay();
        updateResults();
    }
});

document.getElementById('nextStar').addEventListener('click', () => {
    if (targetStar < 5) {
        targetStar++;
        updateStarsDisplay();
        updateResults();
    }
});

document.getElementById('currentStarsDisplay').addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const stars = Array.from(e.target.parentElement.children);
        const index = stars.indexOf(e.target);
        if (index >= 0) {
            currentStar = index + 1;
            if (targetStar <= currentStar) {
                targetStar = currentStar + 1;
            }
            updateStarsDisplay();
            updateResults();
        }
    }
});

document.getElementById('currentStarPieces').addEventListener('input', updateResults);
document.getElementById('currentStatues').addEventListener('input', updateResults);
document.getElementById('currentCost').addEventListener('change', updateResults);
document.getElementById('remainingAtCost').addEventListener('input', function() {
    const value = parseInt(this.value) || 25;
    if (value < 1) this.value = 1;
    if (value > 25) this.value = 25;
    updateResults();
});

updateStarsDisplay();
updateResults();
