import * as questionsService from "../../services/questionsService.js";
import * as topicService from "../../services/topicService.js";
import * as answersService from "../../services/answersService.js"
import { validasaur } from "../../deps.js";


  
const getQuestion = async ({ render,params}) => {

    //for specific question page
  render("question.eta", { topic: await topicService.findTopic(params.tId), 
    question: await questionsService.findQuestion(params.qId), answers: await answersService.listAnswers(params.qId)});
  
};



const validationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};


const getData = async (request) => {

    const body = request.body();
    const params = await body.value;
    let bool = false 
    if(params.get("is_correct")) bool = true
    return {
      text: params.get("option_text"),
      correct: bool,
      validationErrors: [],
    };
};


const addAnswer = async ({ request, response, render, state, params}) => {
  
  const data = await getData(request);

  const [passes, errors] = await validasaur.validate(data, validationRules);

  const auth = await state.session.get("authenticated")
  const topic_id = params.tId
  const question_id = params.qId

 /// multiple questions can be added to the topic
  if(auth){
    if (!passes) {
      //doesnt print the errors but shows the error in console
      console.log(errors);
      data.validationErrors = errors;
      data.topic = await topicService.findTopic(params.id);
      data.question = await questionsService.findQuestion(params.qId);
      data.answers = await answersService.listAnswers(params.qId);
      ///shoudlnt use render again just redirect 
      //need to create external data storage 
      
      render("question.eta", data);

    } else {
      // data was ok, could store it
      await answersService.addAnswer(question_id,data.text, data.correct)
      response.redirect(`/topics/${topic_id}/questions/${question_id}`);
    }
  }
  
    ////topics/:tId/questions/:qId
    
};

const deleteAnswer = async ({ params, response, state}) => {

  //delete id is in the url link

  const auth = await state.session.get("authenticated")
  if(auth){
    await answersService.deleteAnswer(params.oId)
  }
  

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`)

};



export {getQuestion, addAnswer, deleteAnswer};