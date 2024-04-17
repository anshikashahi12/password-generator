// Selecting DOM elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()*+-./<>?='; // Symbols available for password generation

// Initial variables
let password = "";
let passwordLength = 10; // Default password length
let checkCount = 0;

// Initialize slider and length display
handleSlider();
setIndicator("#ccc");
// Function to update slider and display password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

// Function to set strength indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Function to generate a random integer within a range
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Functions to generate random characters
function generateRndNum(){
    return getRndInteger(0, 9);
}

function generateLowerCase(){
    return  String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

// Function to calculate password strength
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // Check if checkboxes are checked
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    // Determine password strength based on criteria
    if(hasUpper && hasLower && (hasNum || hasSym ) && passwordLength >= 8){
        setIndicator("#0f0"); // Strong password
    } else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // Medium password
    } else {
        setIndicator("#f00"); // Weak password
    }
}

// Function to copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (err) {
        copyMsg.innerText = "failed to copy";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Function to shuffle password characters
function shufflePassword(array){
    // Fisher-Yates shuffle algorithm
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = '';
    array.forEach((el) => {str += el});
    return str;
}

// Function to handle checkbox change event
function handleCheckBoxChange(){
    checkCount = 0;
    // Count the number of checked checkboxes
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    // Adjust password length if necessary
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event listeners for checkbox change and slider input
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event listener for copy button click
copyBtn.addEventListener("click", (e) => {
    if(passwordDisplay.value) {
        copyContent();
    }
});

// Event listener for generate button click
generateBtn.addEventListener("click", () => {
    if(checkCount == 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    let funArray = [];
    let requiredLength = passwordLength;
    // Add selected character types to funArray and decrement requiredLength
    if(uppercaseCheck.checked){
        funArray.push(generateUpperCase);
        requiredLength--;
    }
    if(lowercaseCheck.checked){
        funArray.push(generateLowerCase);
        requiredLength--;
    }
    if(numbersCheck.checked){
        funArray.push(generateRndNum);
        requiredLength--;
    }
    if(symbolsCheck.checked){
        funArray.push(generateSymbol);
        requiredLength--;
    }
    // Generate at least one character of each selected type
    for(let i = 0; i < funArray.length; i++){
        password += funArray[i]();
    }
    // Generate remaining characters to meet the required length
    for(let i = 0; i < requiredLength; i++){
        let randomIndex = getRndInteger(0, funArray.length);
        password += funArray[randomIndex]();
    }
    // Shuffle the password characters
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
    
});
