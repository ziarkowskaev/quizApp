import * as questionsService from "../../services/questionsService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const getTopic = async ({ render,params}) => {

    render("topic.eta", { 
        topic: await topicService.findTopic(params.id), 
        questions: await questionsService.listQuestions(params.id)
      });
   
        console.log(await topicService.findTopic(params.id))
   
  };


const validationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};


const getData = async (request) => {

    const body = request.body();
    const params = await body.value;

    return {
      text: params.get("question_text"),
    };
};


const addQuestion = async ({ request, response, render, state, params}) => {
  
  const data = await getData(request);

  const [passes, errors] = await validasaur.validate(data, validationRules);

  const user = await state.session.get("user")
  const auth = await state.session.get("authenticated")
  const topic_id = params.id

 /// multiple questions can be added to the topic
 if(auth){
    if (!passes) {
      //doesnt print the errors but shows the error in console
      console.log(errors);
      data.validationErrors = errors;
      data.topic = await topicService.findTopic(topic_id)
      data.questions = await questionsService.listQuestions(topic_id)
      render("topic.eta", data);
    } else {
      // data was ok, could store it
      await questionsService.addQuestion(user.id, topic_id, data.text)
      //redirect to topics/:id
      response.redirect(`/topics/${topic_id}`);
    }
  }
  

};

const deleteQuestion = async ({ params, response, state}) => {
  
  //delete id is in the url link
 
  const auth = await state.session.get("authenticated")

  if(auth){
    await questionsService.deleteQuestion(params.qId)
  }

    response.redirect(`/topics/${params.tId}`);

};


export {getTopic, addQuestion,deleteQuestion};