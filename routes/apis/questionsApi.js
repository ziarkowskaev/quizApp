// GET requests made to the path /api/questions/random return a randomly selected 
// question as an JSON document. The document has attributes questionId, questionText, 
// and answerOptions. The attribute answerOptions is a list that contains answer options. 
// Each answer option has attributes optionId and optionText. As an example, a document 
// received as a response could look as follows:
import * as questionsService from "../../services/questionsService.js";
import * as answerService from "../../services/answersService.js"

const randomQuestion = async ({ response }) => {
    const check = await questionsService.listAllQuestions();
    const question = await questionsService.randomApi();
    if(check.length>0){
    
    const answers = await answerService.listAnswers(question.id)

    delete question.user_id
    delete question.topic_id

    question.questionId = question.id
    delete question.id

    question.questionText = question.question_text
    delete question.question_text

    for (let i = 0; i < answers.length; i++) {
        answers[i].optionId = answers[i].id
        delete answers[i].id
        answers[i].optionText = answers[i].option_text
        delete answers[i].option_text

        delete answers[i].question_id;
        delete answers[i].is_correct;
     }
    question.answerOptions = answers
  
    response.body = question}
    else{
        response.body = question
    }
  };

  //POST requests made to the path /api/questions/answer
  const questionAnswer = async({request, response}) => {
  const body = request.body({ type: "json" });
  const params = await body.value;

  const checking = await answerService.checkAnswer(params.optionId)

    if(checking.length >0){
        response.body = {correct: true}
    }else{
        response.body = {correct: false}
    }

}
  
  export { randomQuestion, questionAnswer};