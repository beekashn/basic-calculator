"use strict";

const display = document.querySelector("#display");
const answer = document.querySelector("#answer");
const buttons = document.querySelectorAll("button");

let cursorPosition = 0;

// Adding Event Listener to the Buttons of the Calculator
buttons.forEach((button) => button.addEventListener("click", handleClick));

function handleClick(e) {
  // Change the opacity of the Text in display and result area
  answer.style.color = answer.value !== "" ? "#0000ff33" : "#0000ff";

  const btnValue = e.target.innerText;

  try {
    if (btnValue === "AC") handleAC();
    else if (btnValue === "DEL") handleDelete();
    else if (btnValue === "=") handleEquals();
    else if (btnValue === "◁" || btnValue === "▷") handleArrow(btnValue);
    else handleDefault(btnValue);
  } catch (error) {
    answer.value = "Syntax Error";
    answer.style.color = "red";
  }
}

function handleAC() {
  // Reset the display and result values
  display.value = "";
  answer.value = "";
  cursorPosition = 0;
}

function handleDelete() {
  // Delete Last Character and update cursor position
  if (cursorPosition > 0) {
    display.value =
      display.value.slice(0, cursorPosition - 1) +
      display.value.slice(cursorPosition);
    cursorPosition--;
  }
}

function handleArrow(arrowType) {
  // Handle left and right arrow movements
  if (arrowType === "◁" && cursorPosition > 0) {
    cursorPosition--;
  } else if (arrowType === "▷" && cursorPosition < display.value.length) {
    cursorPosition++;
  }
}

function handleReplacements(expression) {
  const replacedExpression = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\^/g, "**")
    .replace(/\b0*(\d+)\b/g, "$1") // for leading zeros i.e., to handle unwanted Octal interpretation
    .replace(/√(\d+)/g, (_, num) => `Math.sqrt(${num})`) // to find square root
    .replace(/%/g, (match, offset, displayValue) => {
      const prevChar = displayValue.charAt(offset - match.length);
      const nextChar = displayValue.charAt(offset + match.length);
      if (prevChar === "/") return "error";
      else {
        return nextChar === "*" ? "/100" : "/100*";
      }
    });

  return replacedExpression;
}

function handleEquals() {
  const expression = handleReplacements(display.value);
  answer.value = eval(expression) || "";
  answer.style.color = "#0000ff";
}

function handleDefault(value) {
  // Check for Consecutive Operators. HERE {2,} ==> means 2 or more
  if (/[\−\+\×\÷\^\%]{2,}/.test(display.value)) handleDelete();

  // Insert the value at the current cursor position
  display.value =
    display.value.slice(0, cursorPosition) +
    value +
    display.value.slice(cursorPosition);
  cursorPosition++;
}

window.addEventListener("keydown", function (e) {
  // When "Enter" key is pressed-down it calls the handleEquals function
  if (e.key === "Enter") {
    e.preventDefault();
    handleEquals();
  }
});
