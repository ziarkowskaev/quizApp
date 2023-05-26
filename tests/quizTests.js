import { superoak } from "../deps.js";
import { app } from "../app.js";
 

Deno.test({
  name:'Unauthorized can access to login, registration and main pages', 
  async fn() {
    const testClient1 = await superoak(app);
    await testClient1.get('/auth/login').expect(200);
    const testClient2 = await superoak(app);
    await testClient2.get('/auth/register').expect(200);
    const testClient3 = await superoak(app);
    await testClient3.get('/').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,             
  });

Deno.test(
  'Non authorized users making requests to /topics or /quiz are redirected to /auth/login.', 
  async () => {
    const testClient = await superoak(app);
    await testClient.get('/topics').expect(302).expect('Location', '/auth/login');;
                   
  });


  Deno.test({
    name:'After authorization user is redirected to /topics', 
    async fn() {
    const testClient = await superoak(app);
    await testClient.post('/auth/login')
                    .send("email=admin@admin.com&password=123456")
                    .expect(302)
                    .expect('Location', '/topics')
                   
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

  Deno.test({
    name:'Registration of a new user is successful', 
    async fn() {
    const testClient = await superoak(app);
    await testClient.post('/auth/register')
                    .send("email=test@test.com&password=123456&verification=123456")
                    .expect(200)
                    
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:"It should return JSON with status code 200", 
  async fn() {
  const request = await superoak(app);
  await request.get("/api/questions/random")
    .expect(200)
    .expect("Content-Type", /json/)
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


  Deno.test({
    name:'After failed login response status is 401', 
    async fn() {
    const testClient = await superoak(app);
    await testClient.post('/auth/login')
                    .send("email=invalid@example.com&password=wrongpassword")
                    .expect(401)
                   
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
