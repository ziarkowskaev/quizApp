import { sql } from "../database/database.js";

const addTopic = async (user_id, name) => {
    await sql`INSERT INTO topics (user_id, name) VALUES (${user_id}, ${name})`;
  };

const deleteTopic = async (id) => {
  //need to delete topic's questions and answers
    
    await sql`DELETE FROM topics WHERE id =  ${id}`;
  };

const listTopics = async () => {
    return await sql `SELECT * FROM topics ORDER BY name`;
};

const findTopic = async (id) =>{
  const rows = await sql `SELECT * FROM topics WHERE id =  ${id}`
  return rows[0];
}




export{addTopic,listTopics,deleteTopic,findTopic};




