import { sql } from "../database/database.js";

const addAnswer = async (question_id, text, correct) => {
    await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${question_id},${text}, ${correct})`;
  };

const addAnswerUser = async (user_id, question_id, question_answer_option_id) => {
    await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${user_id},${question_id}, ${question_answer_option_id})`;
};

const listAnswersUser = async () => {
  return await sql`SELECT * FROM question_answers`;
};



///find question specific to the topic
const listAnswers = async (question_id) => {
    return await sql `SELECT * FROM question_answer_options WHERE question_id = ${question_id}`;
};

const deleteAnswer = async (id) => {
    await sql`DELETE FROM question_answer_options WHERE id =  ${id}`;
};

const checkAnswer = async(id) => {
    const rows = await sql `SELECT * FROM question_answer_options WHERE id =  ${id} AND is_correct = TRUE`
    return rows;
  }

  const correctAnswer = async(question_id) => {
    const rows = await sql `SELECT * FROM question_answer_options WHERE question_id =  ${question_id} AND is_correct = TRUE`
    return rows[0];
  }



export{addAnswer, listAnswers, deleteAnswer, correctAnswer,checkAnswer, addAnswerUser, listAnswersUser};