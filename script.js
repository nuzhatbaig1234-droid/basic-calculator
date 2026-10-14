
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForOperand = false;
let justCalculated = false;

// Update calculator display
function updateDisplay() {
    display.value = currentInput;
}

// Clear everything
function clearCalculator() {
    currentInput = "0";
    firstOperand = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = false;
    updateDisplay();
}

// Add a number
function inputNumber(number) {
    if (currentInput === "Error") {
        clearCalculator();
    }

    if (waitingForOperand || justCalculated) {
        currentInput = number;
        waitingForOperand = false;
        justCalculated = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

// Add decimal point
function inputDecimal() {
    if (currentInput === "Error") {
        clearCalculator();
    }

    if (waitingForOperand || justCalculated) {
        currentInput = "0.";
        waitingForOperand = false;
        justCalculated = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Perform arithmetic calculation
function calculate(a, b, op) {
    let result;

    switch (op) {
        case "+":
            result = a + b;
            break;

        case "-":
            result = a - b;
            break;

        case "*":
            result = a * b;
            break;

        case "/":
            if (b === 0) {
                return "Error";
            }
            result = a / b;
            break;

        default:
            return b;
    }

    if (!Number.isFinite(result)) {
        return "Error";
    }

    // Reduce floating-point precision problems
    return Number(result.toPrecision(12)).toString();
}

// Choose an operator
function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    const inputValue = Number(currentInput);

    if (operator && !waitingForOperand) {
        const result = calculate(
            firstOperand,
            inputValue,
            operator
        );

        if (result === "Error") {
            currentInput = "Error";
            firstOperand = null;
            operator = null;
            waitingForOperand = true;
            justCalculated = false;
            updateDisplay();
            return;
        }

        currentInput = result;
        firstOperand = Number(result);
    } else {
        firstOperand = inputValue;
    }

    operator = nextOperator;
    waitingForOperand = true;
    justCalculated = false;

    updateDisplay();
}

// Calculate final answer
function showResult() {
    if (
        operator === null ||
        waitingForOperand ||
        currentInput === "Error"
    ) {
        return;
    }

    const secondOperand = Number(currentInput);

    currentInput = calculate(
        firstOperand,
        secondOperand,
        operator
    );

    firstOperand = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = true;

    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput === "Error" || justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForOperand) return;

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";

    if (currentInput === "-") {
        currentInput = "0";
    }

    updateDisplay();
}

// Handle button clicks
buttons.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteLast();
                break;

            case "decimal":
                inputDecimal();
                break;

            case "equals":
                showResult();
                break;
        }
    }
});

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearCalculator();
    }
});

// Initial display
updateDisplay();
