const studyMode = document.querySelector('#study-mode');
const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWords = document.querySelector('#shuffle-words');
const examMode = document.querySelector('#exam-mode');
const examProgress = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');
const studyCards = document.querySelector('.study-cards');
const slider = document.querySelector('.slider');
const flipCard = document.querySelector('.flip-card');
const titleFront = document.querySelector('.title-front');
const titleBack = document.querySelector('.title-back');
const example = document.querySelector('.example-back');
const back = document.querySelector('#back');
const exam = document.querySelector('#exam');
const next = document.querySelector('#next');
const examCards = document.querySelector('#exam-cards');
const time = document.querySelector('#time');

class Items {
    constructor(title, translation, example) {
        this.title = title;
        this.translation = translation;
        this.example = example;
    }
}

const item1 = new Items('cat', 'кот', 'домашнее животное с повадками хищника из семейства кошачьих');
const item2 = new Items('dog', 'собака', 'домашнее животное сем. псовых, родственное волку');
const item3 = new Items('banana', 'банан', 'удлиненный съедобный плод, с ботанической точки зрения являющийся ягодой ');
const item4 = new Items('house', 'дом', 'архитектурное сооружение, предназначенное для жилья');
const item5 = new Items('fish', 'рыба', 'водное челюстноротое позвоночное животное');
const item6 = new Items('car', 'автомобиль', 'моторное безрельсовое дорожное и/или внедорожное, чаще всего автономное, транспортное средство');

const arr = [item1, item2, item3, item4, item5, item6];

slider.addEventListener('click', function() {
    if (flipCard.classList.contains('active')) {
        flipCard.classList.remove('active');
    } else {
        flipCard.classList.add('active');
    }
})

let currentIndex = 0;

function showCard(content) {
    currentWord.textContent = currentIndex + 1;
    titleFront.textContent = content.title;
    titleBack.textContent = content.translation;
    example.textContent = content.example;
    wordsProgress.value = (currentIndex + 1) / arr.length * 100;
}

showCard(arr[currentIndex]);


next.addEventListener('click', function() {
    currentIndex++;
    showCard(arr[currentIndex]);
    back.disabled = false;
    if (currentIndex == arr.length - 1) {
        next.disabled = true;
    }
})

back.addEventListener('click', function() {
    currentIndex--;
    showCard(arr[currentIndex]);
    next.disabled = false;
    if (currentIndex == 0) {
        back.disabled = true;
    }
})

totalWord.textContent = arr.length;

shuffleWords.addEventListener('click', function() {
    arr.sort(() => Math.random() - 0.5);
    showCard(arr[currentIndex]);

})

function createTestcard(obj) {
    const divElement = document.createElement('div');
    divElement.classList.add('card');
    const pElement = document.createElement('p');
    pElement.textContent = obj;
    divElement.append(pElement);
    divElement.onclick = function() {
        wordTranslation(divElement);
    }
    return divElement;
}

function addCard() {
    const fragment = new DocumentFragment();
    const newArray = [];
    arr.forEach((array) => {
        newArray.push(createTestcard(array.translation));
        newArray.push(createTestcard(array.title));
    })
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examCards.innerHTML = '';
    examCards.append(fragment);
}
let timerId;
let seconds = 0;
let minutes = 0;
let isRunning = false;


function format(val) {
    if (val < 10) {
        return `0${val}`;
    }
    return val;
}

function countTimer() {
    time.innerHTML = `${format(minutes)}:${format(seconds)}`;
    if (seconds < 59) {
        seconds++;
    } else {
        minutes++;
        seconds = 0;
    }
}

exam.addEventListener('click', function() {
    studyCards.classList.add('hidden');
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
    if (!isRunning) {
        timerId = setInterval(countTimer, 1000);
        isRunning = !isRunning;
    }
    addCard();
})

let selectedCard;
currentIndex = 0;

function wordTranslation(currentCard) {
    if (!selectedCard) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('correct');
            card.classList.remove('wrong');
        })
        currentCard.classList.add('correct');
        selectedCard = currentCard;
    } else {
        const wordObject = arr.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);
        if (wordObject.translation === currentCard.textContent || wordObject.title === currentCard.textContent) {
            currentIndex++;
            correctPercent.textContent = Math.round(100 * currentIndex / arr.length) + '%';
            examProgress.value = (currentIndex) / arr.length * 100;
            currentCard.classList.add('correct');
            currentCard.classList.add('fade-out');
            selectedCard.classList.add('fade-out');
            const cards = document.querySelectorAll('.card');
            let disappeared = true;
            cards.forEach(card => {
                if (!card.classList.contains('fade-out')) {
                    disappeared = false;
                }
            });
            if (disappeared) {
                setTimeout(() => {
                    alert(`Проверка знаний успешно завершена!`);
                    clearInterval(timerId);
                    isRunning = false;
                    statistics();
                }, 1000);
            }
        } else {
            selectedCard.classList.add('correct');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.classList.remove('correct');
                    card.classList.remove('wrong');
                });
            }, 500);
        }
        selectedCard = null;
    }
}

const resultsModal = document.querySelector('.results-modal');
const timer = document.querySelector('#timer');

const cardTemplate = document.querySelector('#word-stats');

function statistics() {
    resultsModal.classList.remove('hidden');
    timer.textContent = `${time.textContent}`;
}