const nameInput = document.querySelector('.name');
const buttonSave = document.querySelector('.button_save_results');

const emojies = ['🐱', '🐯', '🦁', '🐸', '🦄', '🐼']
let startTime = 60;

function createfullEmojiess() {
    var fullEmojies = [].concat(emojies, emojies)
    fullEmojies.sort((a, b) => Math.random() - 0.5);
    return fullEmojies;
}

fullEmojies = createfullEmojiess();
nodeListCards = [];

function createCards() {
    fullEmojies.forEach((fullEmoji) => {
        createCard(fullEmoji);
    });
}

function reverseCard() {
    this.classList.toggle('reversed')
    nodeListCards.push(this);
    this.removeEventListener('click', reverseCard);
    var wrongCards = document.querySelectorAll('.red');
    wrongCards.forEach((wrongCard) => {
        wrongCard.classList.remove('red');
    });

    if (nodeListCards.length === 3) {
        nodeListCards[0].classList.remove('reversed');
        nodeListCards[1].classList.remove('reversed');
        nodeListCards[0].addEventListener('click', reverseCard);
        nodeListCards[1].addEventListener('click', reverseCard);
        backOne = nodeListCards[0].children[1];
        backTwo = nodeListCards[1].children[1];
        nodeListCards = [];
        nodeListCards.push(this);
    }
    if (nodeListCards.length === 2) {
        emojiOne = nodeListCards[0].children[1].children[0].textContent;
        emojiTwo = nodeListCards[1].children[1].children[0].textContent;
        backOne = nodeListCards[0].children[1];
        backTwo = nodeListCards[1].children[1];
        if (emojiOne === emojiTwo) {
            nodeListCards[0].removeEventListener('click', reverseCard);
            nodeListCards[1].removeEventListener('click', reverseCard);
            nodeListCards[0].classList.remove('reversed');
            nodeListCards[1].classList.remove('reversed');
            nodeListCards[0].classList.add('ok');
            nodeListCards[1].classList.add('ok');
            backOne.classList.add('green');
            backTwo.classList.add('green');
            nodeListCards.shift();
            nodeListCards.shift();
        }
        else {
            backOne.classList.add('red');
            backTwo.classList.add('red');
        }
    }
}

function createCard(content) {
    const cards = document.querySelector('.cards');
    const card = document.createElement('div');
    card.classList.add('card');
    const notfront = document.createElement('div');
    notfront.classList.add('back');
    const front = document.createElement('div');
    front.classList.add('front');
    const emoji = document.createElement('p');
    emoji.classList.add('emoji');
    emoji.textContent = content;
    front.appendChild(emoji);
    card.appendChild(notfront);
    card.appendChild(front);
    card.addEventListener('click', reverseCard)
    cards.appendChild(card);
}

function createResults() {
    fetch("http://194.31.175.153:8080/results")
        .then((response) => response.json())
        .then((result) => {
            const { data } = result;
            data.forEach((item) => {
                createResult(item.name, item.score);
            });
        })
};

function createResult(playerName, result) {
    const results = document.querySelector('.results');
    const leader = document.createElement('div');
    leader.classList.add('leader');
    const leaderName = document.createElement('p');
    leaderName.classList.add('leader_name');
    leaderName.textContent = playerName;
    const score = document.createElement('div');
    score.classList.add('score');
    score.textContent = result;
    leader.appendChild(leaderName);
    leader.appendChild(score);
    results.appendChild(leader);
}

function createTimer() {
    timer = document.querySelector('.timer');
    functionTimer = setInterval(function () {
        var cards = document.querySelectorAll('.ok');
        if (startTime === 60) {
            timer.textContent = '1:00';
        }
        else if (cards.length === 12) {
            clearInterval(functionTimer);
            createFinalTab();
        }
        else if (startTime >= 10) {
            timer.textContent = '0:' + startTime.toString();
        }
        else if (startTime >= 0) {
            timer.textContent = '0:0' + startTime.toString();
        }
        else {
            clearInterval(functionTimer);
            createFinalTab()
        }
        startTime--;
    }, 1000);
    startTime = 60;
}

function startNewGame() {
    buttonSave.disabled = false;
    nameInput.value = '';
    var finalTab = document.querySelector('.back_final');
    finalTab.style.display = 'none';
    oldCards = document.querySelectorAll('.card');
    var win = document.querySelector('.win');
    win.style.display = 'none';
    var lose = document.querySelector('.lose');
    lose.style.display = 'none';
    oldCards.forEach((oldCard) => {
        var parent = oldCard.parentNode;
        parent.removeChild(oldCard);
    });
    oldResults = document.querySelectorAll('.leader');
    oldResults.forEach((oldResult) => {
        var parent = oldResult.parentNode;
        parent.removeChild(oldResult);
    });
    fullEmojies = createfullEmojiess();
    createCards();
    createResults();
    createTimer();
}


function saveCheck() {
    var nameInputValue = nameInput.value;
    var nameInputCheck = (/^[A-Z|a-z]{1}[-|_|A-Z|a-z]{3,10}$/).test(nameInputValue);
    var score = startTime;
    if (nameInputCheck === true) {
        nameInput.classList.remove('error_name');
        saveResult(nameInputValue, score);
        buttonSave.disabled = true;
    }
    else {
        nameInput.classList.add('error_name');
    }

}

function saveResult(playerName, result) {

    const data = {
        name: playerName,
        score: result
    };
    fetch("http://194.31.175.153:8080/results", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

}

function createFinalTab() {
    var finalTab = document.querySelector('.back_final');
    var buttonTextAgain = document.querySelector('.again');
    var cards = document.querySelectorAll('.ok');
    if (cards.length === 12) {
        var win = document.querySelector('.win');
        win.style.display = 'inline-block';
        nameInput.style.display = 'inline-block';
        buttonSave.style.display = 'inline-block';
        buttonTextAgain.textContent = 'Play again';
    }
    else {
        var lose = document.querySelector('.lose');
        lose.style.display = 'inline-block';
        nameInput.style.display = 'none';
        buttonSave.style.display = 'none';
        buttonTextAgain.textContent = 'Try again';
    }
    finalTab.style.display = 'flex';
    button = document.querySelector('.button_again');
    button.addEventListener('click', startNewGame);
    buttonSave.addEventListener('click', saveCheck);
}


createCards();
createResults();
createTimer();

