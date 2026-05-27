const quizData = [
{
  question: "Approximately how long can an armadillo get?",
  image: "content/quiz_images/dillo_11.jpg",
  options: ["15cm", "150cm", "200cm", "80cm"],
  correct: 1
},

{
  question: "What covers an armadillo's body?",
  image: "content/quiz_images/dillo_7.jpg",
  options: ["Feathers", "Fur", "Armor", "Scales"],
  correct: 2
},

{
  question: "What do armadillos use their claws for?",
  image: "content/quiz_images/dillo_9.jpg",
  options: ["Digging", "Flying", "Swimming", "Jumping"],
  correct: 0
},

{
  question: "What sense do armadillos use the most?",
  image: "content/quiz_images/dillo_10.jpg",
  options: ["Smell", "Sight", "Taste", "Touch"],
  correct: 0
},

{
  question: "What do armadillos like to eat?",
  image: "content/quiz_images/dillo_2.jpg",
  options: ["Pizza", "Insects", "Ice cream", "Leaves"],
  correct: 1
},

{
  question: "What helps armadillos stay safe from predators?",
  image: "content/quiz_images/dillo_7.jpg",
  options: ["Their shell", "Their wings", "Their speed", "Their fur"],
  correct: 0
},

{
  question: "What is the armadillo's top speed?",
  image: "content/quiz_images/dillo_3.gif",
  options: ["15km/h", "25km/h", "35km/h", "45km/h"],
  correct: 3
},

{
  question: "What do armadillos build underground?",
  image: "content/quiz_images/dillo_1.jpeg",
  options: ["Nests", "Burrows", "Castles", "Webs"],
  correct: 1
},

{
  question: "What body part helps armadillos smell insects underground?",
  image: "content/quiz_images/dillo_1.jpeg",
  options: ["Snout", "Tail", "Ear", "Shell"],
  correct: 0
},

{
  question: "Are armadillos good at seeing?",
  image: "content/quiz_images/dillo_12.jpg",
  options: ["Yes", "No", "Only underwater", "Only at night"],
  correct: 1
}
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let gameOver = false;

const userAnswers = [];

const questionCounter = document.getElementById("question-counter");
const win_threshold = 0.7
const quizUI = document.getElementById("quiz-ui");
const questionEl = document.getElementById("question");
const imageEl = document.getElementById("question-img");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.querySelector(".progress-bar");

const loseScreen = document.getElementById("lose-screen");
const winScreen = document.getElementById("win-screen");
const reviewScreen = document.getElementById("review-screen");

const questionContainer = document.getElementById("question-container");
const footer = document.querySelector(".quiz-footer");

function loadQuestion() {
  const q = quizData[currentQuestion];

  questionEl.textContent = q.question;
  imageEl.src = q.image;

  questionCounter.textContent =
  `Question: ${currentQuestion + 1} of ${quizData.length}`;

  optionsEl.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.textContent = option;
    button.classList.add("option");

    button.onclick = () => selectOption(button, index);

    optionsEl.appendChild(button);
  });

  nextBtn.style.display = "none";

  timeLeft = 30;
  clearInterval(timer);
  startTimer();

  updateProgress();
}

function selectOption(button, index) {

  // remove selected state from all buttons
  optionsEl.querySelectorAll(".option").forEach(btn => {
    btn.classList.remove("selected");

    // dim all buttons
    btn.style.opacity = "0.4";
  });

  // highlight clicked button
  button.classList.add("selected");

  // restore opacity for selected button
  button.style.opacity = "1";

  nextBtn.style.display = "block";
}

function startTimer() {
  timer = setInterval(() => {
    if (gameOver) return;

    timeLeft--;

    timerEl.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame("Time ran out!");
    }

  }, 1000);
}
function checkAnswer() {
  const selected = document.querySelector(".option.selected");

  if (!selected) return false;

  const selectedIndex = [...optionsEl.children].indexOf(selected);

  const correctIndex = quizData[currentQuestion].correct;

  userAnswers.push({
    question: quizData[currentQuestion].question,
    selected: quizData[currentQuestion].options[selectedIndex],
    correct: quizData[currentQuestion].options[correctIndex]
  });

  if (selectedIndex === correctIndex) {
    score++;
  }

  return true;
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function loseGame(message) {
  gameOver = true;

  clearInterval(timer);

  quizUI.classList.add("hidden");

  loseScreen.classList.remove("hidden");

  document.getElementById("lose-message").textContent =
    `${message} Your score was ${score}/${quizData.length}.`;
}

function showResults() {
  gameOver = true;

  clearInterval(timer);

  quizUI.classList.add("hidden");

  if (score >= quizData.length * win_threshold) {
    winScreen.classList.remove("hidden");

    document.getElementById("final-score").textContent =
      `You scored ${score}/${quizData.length}`;

  } else {

    loseGame("You did not answer enough questions correctly!");
  }
}

function buildReviewScreen() {
  const container = document.getElementById("review-content");

  container.innerHTML = "";

  userAnswers.forEach(answer => {
    const card = document.createElement("div");

    card.classList.add("review-card");

    card.innerHTML = `
      <h3>${answer.question}</h3>

      <p class="wrong-answer">
        Your answer: ${answer.selected}
      </p>

      <p class="correct-answer">
        Correct answer: ${answer.correct}
      </p>
    `;

    container.appendChild(card);
  });
}

nextBtn.onclick = () => {
  if (gameOver) return;

  const answered = checkAnswer();

  if (!answered) return;

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
};
function resetGame() {
  currentQuestion = 0;
  score = 0;
  gameOver = false;

  userAnswers.length = 0;

  clearInterval(timer);

  loseScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  reviewScreen.classList.add("hidden");

  quizUI.classList.remove("hidden");

  progressBar.style.width = "0%";

  loadQuestion();
}

function openReview() {
  loseScreen.classList.add("hidden");
  winScreen.classList.add("hidden");

  reviewScreen.classList.remove("hidden");

  buildReviewScreen();
}

function closeReview() {
  reviewScreen.classList.add("hidden");

  if (score >= quizData.length * win_threshold) {
    winScreen.classList.remove("hidden");
  } else {
    loseScreen.classList.remove("hidden");
  }
}

// REVIEW BUTTONS

document.getElementById("review-btn").onclick = openReview;
document.getElementById("review-btn-win").onclick = openReview;

document.getElementById("back-btn").onclick = closeReview;

// RESTART BUTTONS

document.getElementById("restart-btn").onclick = resetGame;
document.getElementById("restart-btn-win").onclick = resetGame;

// BACK TO MAIN MENU BUTTONS

document.getElementById("menu-btn").onclick = () => {
  window.location.href = "../quiz_intro_page/index.html";
};

document.getElementById("menu-btn-win").onclick = () => {
  window.location.href = "../quiz_intro_page/index.html";
};

loadQuestion();