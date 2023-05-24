import * as questionsService from "../../services/questionsService.js";
import * as topicService from "../../services/topicService.js";
import * as answersService from "../../services/answersService.js"

const showMain = async ({ render }) => {
  const data = {
    topics: (await topicService.listTopics()).length,
    questions: (await questionsService.listAllQuestions()).length,
    answers: (await answersService.listAnswersUser()).length
  }
  render("main.eta", data);
};

export { showMain };
