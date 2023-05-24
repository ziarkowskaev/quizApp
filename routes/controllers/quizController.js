import * as questionsService from "../../services/questionsService.js";
import * as topicService from "../../services/topicService.js";
import * as answersService from "../../services/answersService.js"

  
const chooseTopic = async ({ render,params}) => {

    //for specific question page
  render("quiz.eta", { topics: await topicService.listTopics()});
  
};

const data = {
    id: 0,
  };

const redirectQuiz = async({params, response}) =>{
  if((await questionsService.listQuestions(params.tId)).length >0){
    data.id = (await questionsService.findRandom(params.tId)).id
    response.redirect(`/quiz/${params.tId}/questions/${data.id}`)
  }else{
    response.body = "No questions for this topic"
  }
}

const randomQuestion = async ({ render,params}) => {

    //for specific question page
    //url is /quiz/:tId/questions/:qId

  render("quiz_question.eta", { question: await questionsService.findQuestion(data.id), 
    answers: await answersService.listAnswers(params.qId), topic: await topicService.findTopic(params.tId)});
  
};

const checkAnswer = async({response, params, state}) =>{
// params has the id of the answer that was chosen 
  const user = (await state.session.get("user")).id
    await answersService.addAnswerUser(user,params.qId, params.oId);
  

  const checkAnswer = await answersService.checkAnswer(params.oId)
  console.log(checkAnswer)
  if(checkAnswer.length > 0){
    ///quiz/:tId/questions/:qId/correct
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`)
  }else{

    //answer was incorrect 
    
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`)
  }
}

const correctAnswer = async({render,params}) => {
    const ids = {
        idT: params.tId,
      };
    render("correct.eta", ids)
}

const incorrectAnswer = async({render, params}) => {

  //error in case there was no correct answer
  const correct = (await answersService.correctAnswer(params.qId))
  const ids = {
    idT: params.tId,
  };

  if(correct){
      ids.correct =  correct.option_text
    render("incorrect.eta", ids)
  }else{
    ids.correct = "none"
    render("incorrect.eta", ids)
    }
}





export {chooseTopic, redirectQuiz, randomQuestion, checkAnswer, correctAnswer, incorrectAnswer};