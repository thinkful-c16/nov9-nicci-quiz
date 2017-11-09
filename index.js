'use strict';
/*global $ */
let SESSION_TOKEN = '';
let SESSION_CATEGORIES = [];

const STORE = 
{
  questions: [
    {
      quest: 'What fruit is traditionally used in an Eve\'s pudding?',
      correctAnswer: 'apples',
      answersArr: [ 'pears', 'apples', 'raisins', 'lemon'],
      //userAnswerCorrect: false
    },
        
    {
      quest: 'In which country did Tea originate?',
      correctAnswer: 'China',
      answersArr: [ 'China', 'Japan', 'Russia', 'Italy'],
      //userAnswerCorrect: false
    },

    {
      quest: 'What is the traditional Egyptian and Middle Eastern food which is a deep-fried ball or patty made from ground chickpeas, fava beans, or both?',
      correctAnswer: 'Falafel',
      answersArr: [ 'Hush puppies', 'Matzo balls', 'Kugel', 'Falafel']
      //userAnswerCorrect: false
    },

    {
      quest: 'Used in pudding, what is the starch extracted from the spongy center, or pith, of various tropical palm stems known as?',
      correctAnswer: 'Sago',
      answersArr: [ 'Tapioca', 'Potato starch', 'Sago', 'Gelatin']
      //userAnswerCorrect: false
    },

    {
      quest: 'If you were touring the vinyards of the Hunter Valley, in which country would you be?',
      correctAnswer: 'Australia',
      answersArr: [ 'Australia', 'Canada', 'United States', 'New Zealand']
      //userAnswerCorrect: false
    },

    {
      quest: 'Which pastry can be described as a laminated dough where butter is placed inside a pocket in the pastry which is then repeatedly folded and rolled?',
      correctAnswer: 'Puff pastry',
      answersArr: [ 'Croissant', 'Filo', 'Puff pastry', 'Biscuit']
      //userAnswerCorrect: false
    },

    {
      quest: 'Which of these is not a main ingredient of a Mocha?',
      correctAnswer: 'Cinnamon',
      answersArr: [ 'Chocolate', 'Cinnamon', 'Espresso', 'Hot milk']
      //userAnswerCorrect: false
    },

    {
      quest: 'A Scandinavian meal served buffet style with multiple hot and cold dishes of various foods is known as a what?',
      correctAnswer: 'Smorgasbord',
      answersArr: [ 'Smorgasbord', 'Tapas', 'Montage', 'Spread']
      //userAnswerCorrect: false
    },

    {
      quest: 'Beef jerky probably originated in South American, but what is Jerky?',
      correctAnswer: 'It is a form of meat preservation in which the meat is dried to prevent it from spoiling.',
      answersArr: [ 'It is a form of meat preservation in which the meat is salted to prevent it from spoiling.', 'It is a form of meat preservation in which the meat is steamed to prevent it from spoiling.', 'It is a form of meat preservation in which the meat is dried to prevent it from spoiling.', 'It is a form of meat preservation in which the meat is frozen to prevent it from spoiling.']
      //userAnswerCorrect: false
    },

    {
      quest: 'If you were having a cocktail of Guinness and Champagne what would it be called?',
      correctAnswer: 'Black Velvet',
      answersArr: [ 'Crown Royal', 'Black Velvet', 'Moscow Mule', 'Ginger beer']
      //userAnswerCorrect: false
    },   

  ],
  currentQuestion: 0,
  score: 0
};

function getToken(){
  $.getJSON('https://opentdb.com/api_token.php?command=request', saveToken);
}

function saveToken(response){   //saveToken(response, callback)
  //receives the response from getToken(), saves it as a global variable and then passes token to getCategories()
  if (response.response_code !== 0){
    $('.errorMessage').html('Sorry, quiz currently unavailable. Please try again later.');
  }else{
    SESSION_TOKEN = response.token;
  } 
}

function getCategories(){
  $.getJSON('https://opentdb.com/api_category.php', generateCategories);
}

function generateCategories(responseCategories){
  const categoryArr = responseCategories.trivia_categories.map(function(category){
    let obj = {
      id: category.id,
      name: category.name
    };
    return obj;
  });
  SESSION_CATEGORIES = categoryArr;
  //console.log(SESSION_CATEGORIES);
  populateSelectWithCategories(SESSION_CATEGORIES); //callback();
}

function populateSelectWithCategories(categories){
  let selectHTML = categories.map(function(category){
    return `
     <option value="${category.id}">${category.name}</option>
     `;
  });
  selectHTML = selectHTML.join('');
  $('.js-questCategory').append(selectHTML);
}


function handleStartPage(){
  const html = generateStartPage();
  renderHTML(html);
}


function generateStartPage(){
  return `
    <p>Think you're a pretty smart cookie, huh? Well, step right up and test your knowledge.</p>
    <p>Choose from 'General Knowledge' or a myriad of other categories. Select the number of questions you'd like to answer and just click the 'Start Quiz' button. By the way, you need a score of 70% or more to pass...just fyi!</p>
    
    <div class="questNumber-wrapper">
      <label for="questNumber">How many questions would you like?</label>
      <input type="text" name="questNumber" id="questNumber" class="js-questNumber" placeholder="10">
    </div>
    <div class="questCategory-wrapper">
      <label for="questCategory">Which category would you like?</label>
      <select name="questCategory" id="questCategory" class="js-questCategory">
        <option value="Select One...">Select One</option>
      </select>
    </div>
    <button class="btnStartQuiz">Start Quiz</button>
    `;
}


function generateQuestions(currQuestionArr, questionIndex){

  const currentQuestionObj = currQuestionArr[questionIndex];
  //console.log(currentQuestionObj);
  return `
    <div class="placeAndScore hidden">
        <div id="placeInQuiz">Question ${questionIndex + 1} out of ${currQuestionArr.length}</div>
        <div id="scoreInQuiz">You've answered ${STORE.score} questions correctly.</div>
    </div>
    <div class="questionsAndAnswers">
        <span>${currentQuestionObj.quest}</span>
    </div>
    <div class="questionsAndAnswers">  
        <input type="radio" name="multipleChoice" id="multipleChoice1" value="${currentQuestionObj.answersArr[0]}" required>
        <label for="multipleChoice1">${currentQuestionObj.answersArr[0]}</label>
    </div>
    <div class="questionsAndAnswers">
        <input type="radio" name="multipleChoice" id="multipleChoice2" value="${currentQuestionObj.answersArr[1]}" required>
        <label for="multipleChoice2">${currentQuestionObj.answersArr[1]}</label>
    </div>
    <div class="questionsAndAnswers">
        <input type="radio" name="multipleChoice" id="multipleChoice3" value="${currentQuestionObj.answersArr[2]}" required>
        <label for="multipleChoice3">${currentQuestionObj.answersArr[2]}</label>
    </div>
    <div class="questionsAndAnswers">
        <input type="radio" name="multipleChoice" id="multipleChoice4" value="${currentQuestionObj.answersArr[3]}" required>
        <label for="multipleChoice4">${currentQuestionObj.answersArr[3]}</label>
    </div>
    <div>
        <button id="submitAnswerButton">Submit Answer</button>
    </div>`;
}

function generateRightFeedback(currQuestionArr, questionIndex){

  return `
        <div class="feedBack">
            <div id="placeInQuiz">Question ${questionIndex + 1} out of ${currQuestionArr.length}</div>
            <div id="scoreInQuiz">You've answered ${STORE.score} questions correctly.</div>
            <p>That is correct! You rock!</p>
            <button class="btnNextQuestion">Go to the next Question</button>
        </div>
    `;
}

function generateWrongFeedback(currQuestionArr, questionIndex){
  
  return `
    <div class="feedBack">
        <div id="placeInQuiz">Question ${questionIndex + 1} out of ${currQuestionArr.length}</div>
        <div id="scoreInQuiz">You've answered ${STORE.score} correctly.</div>
        <p>Sorry, that's not it :( The correct answer was ${STORE.questions[questionIndex].correctAnswer}.</p>
        <button class="btnNextQuestion">Go to the next Question</button>
    </div>
    `;
}

function generatePassResultPage(){
  return `
  <h2>Congratulations! You are a Whiz Kid, kid!</h2>
  <p>Your Score was ${STORE.score/STORE.questions.length*100}%.</p>     
  <button class="startNewQuiz">Start New Quiz</button>
  `;
}

function generateFailResultPage(){
  return `
  <h2>Sorry, you need a score of 70% or more to pass! Try again!</h2>
  <p>Your score was ${STORE.score/STORE.questions.length*100}%.</p>     
  <button class="startNewQuiz">Start New Quiz</button>
  `;
}

function renderHTML(strQuestion){
  $('#quizContent').html(strQuestion);
}

function getQuestions(noOfQuestions, categoryId){
  $.getJSON(`https://opentdb.com/api.php?amount=${noOfQuestions}&category=${categoryId}&type=multiple`, addQuestionsToStore);  
}

function addQuestionsToStore(QuestionsArr){
  const saveToStore = QuestionsArr.results.map(function(eachQuestion){
    //console.log(eachQuestion.question);
    //console.log(eachQuestion.correct_answer);
    //console.log(eachQuestion.incorrect_answers);
    let obj = {
      quest: eachQuestion.question,
      correctAnswer: eachQuestion.correct_answer,
      answersArr: [...eachQuestion.incorrect_answers, eachQuestion.correct_answer]
    };
    //console.log(obj);
    return obj;
  });
  //console.log(saveToStore);
  STORE.questions = saveToStore;
  handleQuestions(STORE);
}

function handleQuestions(storeData){
  //console.log(storeData);
  const html = generateQuestions(storeData.questions, storeData.currentQuestion);
  return renderHTML(html);
}

function handleWrongFeedback(storeData){
  const wrongHTML = generateWrongFeedback(storeData.questions, storeData.currentQuestion);
  renderHTML(wrongHTML);
}

function handleRightFeedback(storeData){
  const rightHTML = generateRightFeedback(storeData.questions, storeData.currentQuestion);
  renderHTML(rightHTML);
}

function handlePassResultPage(storeData){
  const passHTML = generatePassResultPage();
  renderHTML(passHTML);
}

function handleFailResultPage(storedata){
  const failHTML = generateFailResultPage();
  renderHTML(failHTML);
}

function handleSubmitAnswer(){
  $('form').on('click', '#submitAnswerButton', function(event){
    event.preventDefault();
    const submittedAnswer = $('input[type=radio][name=multipleChoice]:checked').val();
    let errorMessage= '';

    if(submittedAnswer !== undefined){
      if(STORE.questions[STORE.currentQuestion].correctAnswer === submittedAnswer){
        STORE.score++;
        handleRightFeedback(STORE);
        //STORE.currentQuestion++;  
      } else {
        handleWrongFeedback(STORE);
        //STORE.currentQuestion++;  
      }
      STORE.currentQuestion++;
      $('.errorMessage').html(errorMessage);
    }else{
      errorMessage= '<p class="errMessage">You must fill in an answer.</p>';
      $('.errorMessage').html(errorMessage);
      //handleQuestions(STORE);
    }
  });
}

function handleStartQuizBtn(){
  $('form').on('click', '.btnStartQuiz', function(event){
    event.preventDefault();
    let noOfQuestions  = 0;
    let categoryId = 0;

    $('.js-questNumber').val() !== '' ? noOfQuestions = $('.js-questNumber').val() : noOfQuestions = 10;
    $('.js-questCategory').val() !== 'Select One...' ? categoryId = $('.js-questCategory').val() : categoryId = 9;
    
    getQuestions(noOfQuestions, categoryId);
  });
}

function handleNextQuestionBtn(){
  $('form').on('click', '.btnNextQuestion', function(event){
    event.preventDefault();
    if(STORE.currentQuestion < STORE.questions.length){
      //console.log(STORE.currentQuestion);  
      handleQuestions(STORE);
    } else {
      if(STORE.score >= 7){
        handlePassResultPage(STORE);
      } else if(STORE.score < 7){
        handleFailResultPage(STORE);
      }
    }
  });
}

function quizApp(){
  getToken();
  getCategories();
  handleStartPage();
  handleStartQuizBtn();
  handleSubmitAnswer();
  handleNextQuestionBtn();
}

$(quizApp);