import { sql } from "../database/database.js";

const addQuestion = async (user_id, topic_id, text) => {
    await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${user_id},${topic_id}, ${text})`;
  };
  const listAllQuestions = async () => {
    return await sql `SELECT * FROM questions`;
};



///find question specific to the topic
const listQuestions = async (topic_id) => {
    return await sql `SELECT * FROM questions WHERE topic_id = ${topic_id}`;
};


const findQuestion = async (id) =>{
  const rows = await sql `SELECT * FROM questions WHERE id =  ${id}`
  return rows[0];
}

const findRandom = async (topic_id) =>{
  const rows = await sql `SELECT * FROM questions WHERE topic_id =  ${topic_id} ORDER BY RANDOM()`
  return rows[0];
}

const randomApi = async () =>{
  const rows = await sql `SELECT * FROM questions ORDER BY RANDOM()`
  return rows[0];
}
const deleteQuestion = async (id) => {
  await sql`DELETE FROM question_answers WHERE question_id = ${id}`;
  await sql`DELETE FROM question_answer_options WHERE question_id = ${id}`;
  await sql `DELETE FROM questions WHERE id =  ${id}`
};


export{addQuestion, listQuestions, findQuestion, deleteQuestion, findRandom, randomApi, listAllQuestions};