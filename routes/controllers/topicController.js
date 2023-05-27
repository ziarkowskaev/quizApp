import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";
import * as questionsService from "../../services/questionsService.js";

const listTopics = async ({ render,state }) => {

  const user = await state.session.get("user")

  if(!user.admin){
  render("topics.eta", { topics: await topicService.listTopics()});
  }else{
  render("topics_admin.eta", { topics: await topicService.listTopics()});
  }
};



const validationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};


const getData = async (request) => {

    const body = request.body();
    const params = await body.value;

    return {
      name: params.get("name"),
    };
};


const addTopic = async ({ request, response, render, state }) => {
  
  const data = await getData(request);

  const [passes, errors] = await validasaur.validate(data, validationRules);

  const user = await state.session.get("user")

  if(user.admin){
    if (!passes) {
  
      console.log(errors);
      data.validationErrors = errors;
      data.topics = await topicService.listTopics()
      render("topics_admin.eta", data);
    } else {
      // data was ok, could store it
      await topicService.addTopic(user.id, data.name)
      response.redirect("/topics");
    }
  }

};

const deleteTopic = async ({ params, response, state }) => {
  
  const user = await state.session.get("user")

  //Array indexes of questions that need to be removed 
  const indexes = (await questionsService.listQuestions(params.id)).map(_ => _.id);
  console.log(indexes)
  //delete id is in the url link should also delete questions and questions answers?
  if(user.admin){
    
      for (let i = 0; i < indexes.length; i++) {
        await questionsService.deleteQuestion(indexes[i])
      }
    
    await topicService.deleteTopic(params.id)
  }

  response.redirect("/topics");

};




export {addTopic,listTopics,deleteTopic};