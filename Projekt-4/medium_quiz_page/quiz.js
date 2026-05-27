const quizData = [
{
  question: "What are the bony plates on an armadillo's shell called?",
  image: "content/quiz_images/dillo_11.jpg",
  options: ["Scales", "Scutes", "Spikes", "Plates"],
  correct: 1
},

{
  question: "What material covers an armadillo's shell?",
  image: "content/quiz_images/dillo_1.jpg",
  options: ["Bone", "Fur", "Keratin", "Leather"],
  correct: 2
},

{
  question: "Why do armadillos have flexible bands on their torso?",
  image: "content/quiz_images/dillo_18.jpg",
  options: [
    "To help them swim",
    "To help them move and curl",
    "To help them fly",
    "To scare predators"
  ],
  correct: 1
},

{
  question: "What are an armadillo's claws mainly adapted for?",
  image: "content/quiz_images/dillo_7.jpg",
  options: ["Swimming", "Climbing", "Digging", "Running"],
  correct: 2
},

{
  question: "What do armadillos often dig into to find food?",
  image: "content/quiz_images/dillo_12.jpg",
  options: [
    "Tree trunks",
    "Bird nests",
    "Termite mounds",
    "Rivers"
  ],
  correct: 2
},

{
  question: "Why do armadillos build underground burrows?",
  image: "content/quiz_images/dillo_6.jpg",
  options: [
    "To store food",
    "To sleep and hide from predators",
    "To raise fish",
    "To trap insects"
  ],
  correct: 1
},

{
  question: "What helps an armadillo keep balance while walking or digging?",
  image: "content/quiz_images/dillo_14.jpg",
  options: ["Its ears", "Its shell", "Its tail", "Its nose"],
  correct: 2
},

{
  question: "What is special about an armadillo's hearing?",
  image: "content/quiz_images/dillo_9.jpg",
  options: [
    "It is very weak",
    "It helps detect predators underground",
    "It only works underwater",
    "It can hear colors"
  ],
  correct: 1
},

{
  question: "Why do armadillos rely less on eyesight?",
  image: "content/quiz_images/dillo_4.jpg",
  options: [
    "Their eyesight is poor",
    "Their eyes stay closed",
    "They live underwater",
    "They only move at night"
  ],
  correct: 0
},

{
  question: "Which sense is strongest in an armadillo?",
  image: "content/quiz_images/dillo_19.jpg",
  options: ["Taste", "Sight", "Smell", "Touch"],
  correct: 2
},

{
  question: "What does an armadillo mainly use its snout for?",
  image: "content/quiz_images/dillo_13.jpg",
  options: [
    "Swimming",
    "Detecting insects underground",
    "Breaking rocks",
    "Climbing trees"
  ],
  correct: 1
},

{
  question: "What type of tongue helps armadillos catch insects?",
  image: "content/quiz_images/dillo_17.jpg",
  options: [
    "Sharp tongue",
    "Sticky tongue",
    "Forked tongue",
    "Short tongue"
  ],
  correct: 1
},

{
  question: "Why are an armadillo's ears useful in warm climates?",
  image: "content/quiz_images/dillo_16.jpg",
  options: [
    "They store water",
    "They release body heat",
    "They attract insects",
    "They help swimming"
  ],
  correct: 1
},

{
  question: "What shape is an armadillo's head?",
  image: "content/quiz_images/dillo_20.jpeg",
  options: [
    "Wide and flat",
    "Round and large",
    "Small and narrow",
    "Square-shaped"
  ],
  correct: 2
},

{
  question: "Why is an armadillo's head shape useful?",
  image: "content/quiz_images/dillo_3.jpg",
  options: [
    "It helps push through soil",
    "It helps them fly",
    "It scares predators",
    "It stores food"
  ],
  correct: 0
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