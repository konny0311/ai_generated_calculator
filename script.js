let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple operators in a row
    if (isOperator(value) && isOperator(currentInput.slice(-1))) {
        return;
    }
    
    // Prevent multiple decimal points in a number
    if (value === '.') {
        const lastNumber = getLastNumber();
        if (lastNumber.includes('.')) {
            return;
        }
    }
    
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculate() {
    try {
        if (currentInput === '') return;
        
        // Replace × with * for calculation
        let expression = currentInput.replace(/×/g, '*');
        
        // Validate expression
        if (!isValidExpression(expression)) {
            throw new Error('Invalid expression');
        }
        
        let result = eval(expression);
        
        // Handle division by zero
        if (!isFinite(result)) {
            throw new Error('Division by zero');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/', '×'].includes(char);
}

function getLastNumber() {
    const operators = ['+', '-', '*', '/', '×'];
    let lastOperatorIndex = -1;
    
    for (let i = currentInput.length - 1; i >= 0; i--) {
        if (operators.includes(currentInput[i])) {
            lastOperatorIndex = i;
            break;
        }
    }
    
    return currentInput.substring(lastOperatorIndex + 1);
}

function isValidExpression(expression) {
    // Check for empty expression
    if (expression === '') return false;
    
    // Check if expression starts or ends with an operator (except -)
    if (/^[+*/×]/.test(expression) || /[+\-*/×]$/.test(expression)) {
        return false;
    }
    
    // Check for consecutive operators
    if (/[+\-*/×]{2,}/.test(expression)) {
        return false;
    }
    
    return true;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});