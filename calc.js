const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentInput = '0';
let isResultDisplayed = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function handleInput(value) {
    if (isResultDisplayed && !['+', '-', '*', '/'].includes(value)) {
        currentInput = value;
        isResultDisplayed = false;
    } else {
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    updateDisplay();
}

function handleAction(action) {
    if (action === 'clear') {
        currentInput = '0';
    } else if (action === 'delete') {
        if (currentInput === 'Error') {
            currentInput = '0';
        } else if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
    } else if (action === 'calculate') {
        try {
            let sanitizedInput = currentInput.replace(/[^0-9+\-*/.]/g, '');
            if (sanitizedInput) {
                let result = new Function('return ' + sanitizedInput)();
                if (result % 1 !== 0) {
                    result = parseFloat(result.toFixed(6));
                }
                currentInput = String(result);
            }
            isResultDisplayed = true;
        } catch (error) {
            currentInput = 'Error';
            isResultDisplayed = true;
        }
    } else {
        try {
            let sanitizedInput = currentInput.replace(/[^0-9+\-*/.]/g, '');
            let currentNum = sanitizedInput ? new Function('return ' + sanitizedInput)() : 0;
            let result = 0;

            if (action === 'sin') result = Math.sin(currentNum);
            else if (action === 'cos') result = Math.cos(currentNum);
            else if (action === 'square') result = Math.pow(currentNum, 2);
            else if (action === 'cube') result = Math.pow(currentNum, 3);
            else if (action === 'sqrt') result = Math.sqrt(currentNum);
            else if (action === 'inverse') result = 1 / currentNum;
            else if (action === 'percent') result = currentNum / 100;
            else if (action === 'factorial') {
                if (currentNum < 0 || !Number.isInteger(currentNum)) {
                    throw new Error("Invalid");
                }
                result = 1;
                for (let i = 2; i <= currentNum; i++) result *= i;
            }

            if (result % 1 !== 0) {
                result = parseFloat(result.toFixed(6));
            }
            currentInput = String(result);
            isResultDisplayed = true;
        } catch (error) {
            currentInput = 'Error';
            isResultDisplayed = true;
        }
    }
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value) {
            handleInput(value);
        } else if (action) {
            handleAction(action);
        }
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/'];
    
    if (validKeys.includes(key)) {
        handleInput(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleAction('calculate');
    } else if (key === 'Backspace') {
        handleAction('delete');
    } else if (key === 'Escape') {
        handleAction('clear');
    }
});