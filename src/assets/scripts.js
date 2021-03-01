const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`);
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`);
root.style.setProperty('--game-size', `${GAME_SIZE}px`);

// Button reload game 
const reset = document.getElementById('reload');
document.addEventListener('click' , () => {
    location.reload();
});

let initialCounter = 0;
let counterSteps = initialCounter;
const counter = document.getElementById('steps');
counter.innerHTML = `Passos: ${initialCounter}`;

// regressive counter game 
const time = document.getElementById('time');

function minuteCounter(){
    time.innerHTML = 30;

    setInterval(() => {
        const newTime = Number(time.innerHTML) - 1;
        time.innerHTML = newTime;

        if(newTime <= 0) {
            clearInterval(time);
            location.reload();
            alert('Time is up... let is try again?');
        }

    }, 1000);

}
minuteCounter();


function createBoard() {
    const boardElement = document.getElementById('board');
    const elements = [];

    function createElement(options) {
        let { item, top, left } = options;

        const currentElement = { item, currentPosition: {top, left} };
        elements.push(currentElement);

        const htmlElement = document.createElement('div');
        htmlElement.className = item;
        htmlElement.style.top = `${top}px`;
        htmlElement.style.left = `${left}px`;

        boardElement.appendChild(htmlElement);

        function getNewDirection(buttonPressed , position) {
            switch (buttonPressed) {
                case 'ArrowUp':
                    return { top: position.top - TILE_SIZE, left: position.left };
                case 'ArrowRight':
                    return { top: position.top, left: position.left + TILE_SIZE };
                case 'ArrowDown': 
                    return { top: position.top  + TILE_SIZE, left: position.left};
                case 'ArrowLeft': 
                    return { top: position.top, left: position.left - TILE_SIZE};
                default:
                    return position;
                }
        }

        function validateMoviment(position, conflictItem) {
            return (
                position.left >= 48 && 
                position.left <= 864 &&
                position.top >= 96 && 
                position.top <= 816 &&
                conflictItem?.item !== 'forniture'
            )
        }  
        
        function getMovimentConflict(position, els) {
            const conflictItem = els.find((currentElement) => {
                return (
                    currentElement.currentPosition.top === position.top &&
                    currentElement.currentPosition.left === position.left
                );
            });

            return conflictItem;
        }

        function validateConflicts(currentEl, conflictItem) {
            function finishGame(message) {
                setTimeout(() => {
                    alert(message);
                    location.reload();
                }, 100);
            }

            if (!conflictItem) {
                return ;
            }
            
            if (currentEl.item === 'hero') {
                if (
                    conflictItem.item === 'mini-demon' ||
                    conflictItem.item === 'trap'
                ) {
                    finishGame('você morreu');
                }

                if (conflictItem.item === 'chest') {
                    finishGame('você ganhou');
                }
            }

            if (currentEl.Item === 'mini-demon' && conflictItem.item === 'hero' ){
                finishGame('você morreu');
            }
        }

        function move(buttonPressed) {
            const newDirection = getNewDirection(buttonPressed, currentElement.currentPosition);
            const conflictItem = getMovimentConflict(newDirection, elements);
            const isValidateMoviment = validateMoviment(newDirection, conflictItem);

            if (isValidateMoviment) {
                currentElement.currentPosition = newDirection;
                htmlElement.style.top = `${newDirection.top}px`;
                htmlElement.style.left = `${newDirection.left}px`;
             
                if (currentElement.item === 'hero'){

                    if (
                        buttonPressed === 'ArrowUp' ||
                        buttonPressed === 'ArrowLeft' ||
                        buttonPressed === 'ArrowRight' ||
                        buttonPressed === 'ArrowDown'
                    ) {

                        counterSteps++;
                        counter.innerHTML = `Passos: ${counterSteps}`;

                    }

                }

                validateConflicts(currentElement, conflictItem);
            }
        }

        return {
            move: move
        }
    }

    function createItem(options) {
        createElement(options);
    }

    function createHero(options) {
        const hero = createElement({
            item: 'hero',
            top: options.top,
            left: options.left
        });
    
        document.addEventListener('keydown', (event) => {
            hero.move(event.key);
        });
    }

    function createEnemy(options){
        const enemy = createElement({
            item: 'mini-demon',
            top: options.top,
            left: options.left
        });

        setInterval(() => {
            const direction = [ 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
            const randomIndex = Math.floor(Math.random() * direction.length);
            const randomDirection = direction[randomIndex];

            enemy.move(randomDirection);
        }, 1000)
    }

    return {
        createItem: createItem,
        createHero: createHero,
        createEnemy: createEnemy
    }

}

const board = createBoard();
// item -> mini-demon | chest | hero | trap
// top -> number
// left -> number

const createDemons = 8;
    for (i = 0; i< createDemons; i++) {
        board.createEnemy({ top: TILE_SIZE * 8, left: TILE_SIZE * 14});
        board.createEnemy({ top: TILE_SIZE * 7, left: TILE_SIZE * 5});
    }

const createTrap = 1;

    setInterval (() => {
        for(i = 0; i< createTrap; i++){
            const topTrap = Math.floor(Math.random() * 10 + 8);
            const leftTrap = Math.floor(Math.random() * 10 + 8);
            board.createItem({ item: "trap", top: TILE_SIZE * topTrap, left: TILE_SIZE * leftTrap });
        }
    }, 1000);


board.createItem({ item: "chest", top: TILE_SIZE * 3, left: TILE_SIZE * 17});

board.createItem({ item: 'forniture', top: TILE_SIZE * 17, left: TILE_SIZE * 2 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 8 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 16 });
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 3 });


board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });