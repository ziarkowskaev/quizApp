# Project 2

Quizz Application created by Ewelina Ziarkowsk.

Application allows users to create questions and their answers for the provided by admin user topics.
Users may take quizzes from questions that them or other users created. 

To run application locally use command:

docker-compose up

Application was deployed using Render: Cloud Application Hosting for Developers.
Application is available under this link.

https://quizapp-qque.onrender.com/


Application has in total 10 tests, from which 6 were created with superOak and 4 using Playwright.

Command for running superOak tests.
docker-compose run --rm  drill-and-practice deno test --allow-all ./tests/quizTests.js

Command for running Playwright tests.
docker-compose run --entrypoint=npx e2e-playwright playwright test

'

