import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as userService from "../../services/usersService.js";
import { renderFile, validasaur } from "../../deps.js";

const showRegistrationForm = ({ render }) => {
  render("register.eta");
};

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getData = async (request) => {

  const body = request.body();
  const params = await body.value;

  return {
    email : params.get("email"),
    password : params.get("password"),
    verification: params.get("verification")
  };
};

const postRegistrationForm = async ({ request, response, render }) => {
  const data = await getData(request)
   const [passes, errors] = await validasaur.validate(data, validationRules);

   if(passes){


  if (data.password !== data.verification) {
    response.body = "The entered passwords did not match";
    return;
  }

  const existingUsers = await userService.findUsersWithEmail(data.email);
  if (existingUsers.length > 0) {
    response.body = "The email is already reserved.";
    return;
  }

  //password should be at least 4 characters and email should be valid 

  const hash = await bcrypt.hash(data.password);
  await userService.addUser(data.email, hash);
  response.redirect("/auth/login");
}else{
  console.log(errors);
  data.validationErrors = errors;
  render("register.eta",data)
}
};

const postLoginForm = async ({ request, response, state }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  const existingUsers = await userService.findUsersWithEmail(email);

  if (existingUsers.length === 0) {
    response.status = 401;
    return;
  }

  // take the first row from the results
  const userObj = existingUsers[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  
  if (!passwordCorrect) {
    response.status = 401;
    return;
  }

  await state.session.set("authenticated", true);

  await state.session.set("user", {
    id: userObj.id,
    email: userObj.email,
    admin: userObj.admin
  });

  response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export {
  postLoginForm,
  postRegistrationForm,
  showLoginForm,
  showRegistrationForm,
};