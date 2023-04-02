const display = document.getElementById("low-display");
const highDisplay = document.getElementById("high-display");
const backspaceButton = document.getElementById("backspace");
const decimalButton = document.getElementById("decimal");
const reverseButton = document.getElementById("reverse");
const clearAllButton = document.getElementById("clear-all");
const clearButton = document.getElementById("clear");
const equalButton = document.getElementById("equal");
/** @type {NodeListOf<HTMLButtonElement>} */
const numbers = document.querySelectorAll("#number");
/** @type {NodeListOf<HTMLButtonElement>} */
const operators = document.querySelectorAll("#operator");

const mem = {
  highDisplay: "",
  lowDisplay: "0",
  oldNumber: "",
  operator: "",
}

function setLowDisplay(number) {
  display.innerText = mem.lowDisplay = number;
}

function setHighDisplay(number, operator) {
  mem.highDisplay = number;
  highDisplay.innerText = [number, operator].join(" ");
}

function addNumberToLowDisplay(number) {
  if (["0", "-0"].includes(mem.lowDisplay)) {
    setLowDisplay(mem.lowDisplay.replace(/0/, ""));
  }

  setLowDisplay(mem.lowDisplay + number);
  mem.oldNumber = mem.lowDisplay;

  setLowDisplayFontStyle(mem.lowDisplay.length);
}

function addOperator(operator) {
  if (mem.highDisplay) {
    const [num] = mem.highDisplay.split(" ")
    setHighDisplay(calculate(num, mem.operator, mem.lowDisplay), operator);
    return setLowDisplay("");
  }

  setHighDisplay(mem.lowDisplay, operator);

  setLowDisplay("")
}

function backspace() {
  if (mem.lowDisplay === "0") return;

  setLowDisplay(mem.lowDisplay.slice(0, -1));
  if (!mem.lowDisplay) setLowDisplay("0");
  setLowDisplayFontStyle(mem.lowDisplay.length);
}

function calculate(oldNumber, operator, newNumber) {
  oldNumber = Number(oldNumber);
  newNumber = Number(newNumber);

  switch (operator) {
    case "+":
      newNumber = `${oldNumber + newNumber}`;
      break;
    case "-":
      newNumber = `${oldNumber - newNumber}`;
      break;
    case "*":
      newNumber = `${oldNumber * newNumber}`;
      break;
    case "/":
      newNumber = `${oldNumber / newNumber}`;
      break;
    default:
      newNumber = `${newNumber}`;
      break;
  }

  return newNumber
}

function clear() {
  setLowDisplay("0");
  setLowDisplayFontStyle(mem.lowDisplay.length);
}

function clearAll() {
  clear();
  setHighDisplay("");
  mem.operator = "";
}

function decimal() {
  if (mem.lowDisplay.includes(".")) return;

  setLowDisplay(mem.lowDisplay + ".");
}

function equal() {
  if (!mem.highDisplay) {
    setLowDisplay(calculate(mem.lowDisplay, mem.operator, mem.oldNumber));
    return setLowDisplayFontStyle(mem.lowDisplay.length);
  }

  const [num] = mem.highDisplay.split(" ");
  setLowDisplay(calculate(num, mem.operator, mem.lowDisplay));
  setHighDisplay("");
  setLowDisplayFontStyle(mem.lowDisplay.length);
}

function reverse() {
  setLowDisplay(mem.lowDisplay.includes("-") ?
    mem.lowDisplay.slice(1) :
    `-${mem.lowDisplay}`);

  return setLowDisplayFontStyle(mem.lowDisplay.length);
}

function setLowDisplayFontStyle(number) {
  if (number < 10)
    return display.style.fontSize = "4rem";

  if (number < 13)
    return display.style.fontSize = "3rem";

  if (number < 19)
    return display.style.fontSize = "2rem";

  display.style.fontSize = "1rem";
}

function setOperator(operator) {
  mem.operator = operator;

  if (!mem.highDisplay)
    return addOperator(operator);

  if (!mem.lowDisplay) {
    const [num] = mem.highDisplay.split(" ");
    return setHighDisplay(num, operator);
  }

  addOperator(operator);
}

function toggleShowHighDisplay(force) {
  if (typeof force === "boolean")
    return highDisplay.style.color = force ?
      "inherit" :
      "transparent";

  switch (highDisplay.style.color) {
    case "transparent":
      highDisplay.style.color = "inherit";
      break;
    default:
      highDisplay.style.color = "transparent";
      break;
  }
}

for (const number of numbers) {
  number.onclick = function (event) {
    if (event.pointerId < 0) return;

    if (["Infinity", "NaN"].includes(mem.lowDisplay))
      setLowDisplay("")

    if (!isNaN(number.textContent))
      addNumberToLowDisplay(number.textContent);
  }
}

for (const operator of operators) {
  operator.onclick = function (event) {
    if (event.pointerId < 0) return;

    if (["Infinity", "NaN"].includes(mem.lowDisplay))
      setLowDisplay("")

    if (["/", "*", "-", "+"].includes(operator.textContent))
      setOperator(operator.textContent);
  }
}

backspaceButton.addEventListener("click", () => backspace());
clearButton.addEventListener("click", () => clear());
clearAllButton.addEventListener("click", () => clearAll());
decimalButton.addEventListener("click", () => decimal());
equalButton.addEventListener("click", () => equal());
reverseButton.addEventListener("click", () => reverse());

document.addEventListener("keydown", function (event) {
  if (["Infinity", "NaN"].includes(mem.lowDisplay))
    setLowDisplay("")

  if (!isNaN(event.key))
    return addNumberToLowDisplay(event.key)

  if (["/", "*", "+", "-"].includes(event.key))
    return setOperator(event.key);

  if ([".", ","].includes(event.key))
    return decimal();

  switch (event.key) {
    case "Enter":
      equal();
      break;
    case "Escape":
      clearAll();
      break;
    case "Delete":
      clear();
      break;
    case "Backspace":
      backspace()
      break;
    case "-": {
      if (["0", "-0"].includes(mem.lowDisplay))
        return reverse();
      setOperator(event.key)
      break;
    }
    default:
      break;
  }
})