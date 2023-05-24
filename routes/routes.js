import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as authenticationController from "./controllers/authenticationController.js"
import * as topicController from "./controllers/topicController.js"
import * as questionsController from "./controllers/questionsController.js"
import * as answerController from "./controllers/answersControllers.js"
import * as quizController from "./controllers/quizController.js"
import * as questionsApi from "./apis/questionsApi.js"
const router = new Router();

router.get("/api/questions/random", questionsApi.randomQuestion);
router.post("/api/questions/answer", questionsApi.questionAnswer);

router.get("/topics", topicController.listTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
//need method post to delete topics

router.get("/topics/:id", questionsController.getTopic);
router.post("/topics/:id/questions", questionsController.addQuestion);
//for some reason id changed to tId
router.post("/topics/:tId/questions/:qId/delete", questionsController.deleteQuestion);

//rountes for particular topic
router.get("/topics/:tId/questions/:qId", answerController.getQuestion);
router.post("/topics/:tId/questions/:qId/options", answerController.addAnswer);
//adding answer to the specific topic
router.post("/topics/:tId/questions/:qId/options/:oId/delete", answerController.deleteAnswer)

//  QUIZ CONTROLLERS

router.get("/quiz", quizController.chooseTopic)
router.get("/quiz/:tId", quizController.redirectQuiz)

router.get("/quiz/:tId/questions/:qId", quizController.randomQuestion)
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.checkAnswer)

router.get("/quiz/:tId/questions/:qId/correct", quizController.correctAnswer)
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.incorrectAnswer)


// MAIN CONTROLLERS
router.get("/", mainController.showMain);

router.get("/auth/register", authenticationController.showRegistrationForm);
router.post("/auth/register", authenticationController.postRegistrationForm);

router.get("/auth/login", authenticationController.showLoginForm);
router.post("/auth/login", authenticationController.postLoginForm);

export { router };
