// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".quiz-app .bullets");
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElem = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      console.log(questionsCount);

      // create bullets + set questions count
      createBullets(questionsCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], questionsCount);

      //Start Countdown
      countDown(20, questionsCount);

      // click on submit button
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, questionsCount);

        // Remove previous question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], questionsCount);

        // Handle bullets classes
        handleBullets();

        //Start Countdown
        clearInterval(countDownInterval);
        countDown(20, questionsCount);

        // Show results
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If it first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets to Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create H2 Question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj.title);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      // Add class to main div
      mainDiv.className = "answer";

      // Create radio input
      let radioInput = document.createElement("input");

      // Add type + name + id + data-attribute

      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make first option checked

      if (i === 1) {
        radioInput.checked = true;
      }

      // create label

      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlFor = `answer_${i}`;

      // create label text

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // add the text to label

      theLabel.appendChild(theLabelText);

      // add input + label to mainDiv

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // append all divs to answers area
      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Good");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad`;
    }
    results.innerHTML = theResults;
    results.style.padding = "20px";
    results.style.marginTop = "10px";
    results.style.backgroundColor = "white";
    results.style.textAlign = "center";
    results.style.fontSize = "24px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElem.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
