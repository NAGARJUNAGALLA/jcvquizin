let USERS = {};
let QUIZ = [];
let current = 0;
let score = 0;

async function loadData() {
  USERS = await fetch("users.json").then(r => r.json());
  QUIZ = await fetch("quiz.json").then(r => r.json());
}
loadData();

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login() {
  let u = document.getElementById("username").value.trim();
  let p = document.getElementById("password").value.trim();
  let error = document.getElementById("loginError");

  if (!USERS[u]) {
    error.textContent = "Invalid username or password!";
    return;
  }

  let hash = await sha256(p);

  if (hash === USERS[u]) {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
    loadQuestion();
  } else {
    error.textContent = "Invalid username or password!";
  }
}

function loadQuestion() {
  let q = QUIZ[current];
  document.getElementById("questionBox").innerHTML = `
     <h3>${q.q}</h3>
     ${q.options.map((op,i)=>
      `<label><input type="radio" name="opt" value="${i}"> ${op}</label><br>`
     ).join("")}
  `;
}

function nextQuestion() {
  let selected = document.querySelector("input[name='opt']:checked");
  if (!selected) return alert("Select an answer!");

  if (parseInt(selected.value) === QUIZ[current].answer) {
    score++;
  }

  current++;
  if (current >= QUIZ.length) return showResult();

  loadQuestion();
}

function showResult() {
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("resultBox").innerHTML =
    `<h3>Your Score: ${score} / ${QUIZ.length}</h3>`;
}
