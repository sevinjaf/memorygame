const emojis = [
    "🍧" , "🍱", "🥐", "🍕",
    "🍓" ,"🌺" ,"🍍" ,"🐵"
];
const gameBoard = document.getElementById("game-board");
const matchesDisplay = document.getElementById("matches");
const movesDisplay = document.getElementById("moves");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let cardElements= Array.from(
    gameBoard.querySelectorAll(".card")    
);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let mismatchTimer = null;  

function setupCards() {
    const shuffledEmojis = [...emojis, ...emojis];

    shuffledEmojis.sort(() => Math.random() - 0.5);

    cardElements.forEach((card, index) => {
        card.textContent = "?";
        card.dataset.emoji = shuffledEmojis[index];
        card.classList.remove("matched");
        card.disabled = false;
        card.setAttribute("aria-label", "Hidden card");

        const newCard = card.cloneNode(true);
        card.replaceWith(newCard);
        cardElements[index] = newCard;

        newCard.addEventListener("click", function () {
            flipCard(newCard);
        });
    });
}
function flipCard(card) {
    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.textContent = card.dataset.emoji;
    card.setAttribute("aria-label", card.dataset.emoji);

    if (firstCard === null) {
        firstCard = card;
        message.textContent = "Choose the second card!";
        return;
    }

    secondCard = card;
    moves++;

    movesDisplay.textContent = moves;

    checkMatch();
}
function checkMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        matches++;
        matchesDisplay.textContent = matches;

        message.textContent = "MATCH! Well done!";

        resetTurn();

        if (matches === emojis.length) {
            message.textContent = "You won! All pairs matched!";
        }
    } else {
        
        lockBoard = true;
        message.textContent = "Not a match! Try again.";

        mismatchTimer = setTimeout(function () {
            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard.setAttribute("aria-label", "Hidden card");
            secondCard.setAttribute("aria-label", "Hidden card");

            mismatchTimer = null;

            resetTurn();
            message.textContent = "Choose two cards!";
        }, 1000);
    }
}
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}


function restartGame() {
    if (mismatchTimer !== null) {
        clearTimeout(mismatchTimer);
        mismatchTimer = null;
    }

    matches = 0;
    moves = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    matchesDisplay.textContent = "0";
    movesDisplay.textContent = "0";
    message.textContent = "Choose two cards to start!";

    setupCards();
}


restartButton.addEventListener("click", restartGame);


setupCards();