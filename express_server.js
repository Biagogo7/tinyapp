const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set("view engine", "ejs");






const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = { 
  "ab12cd": {
    id: "u1", 
    email: "u1@abc.com", 
    password: "p1"
  },
 "ab34cd": {
    id: "u2", 
    email: "u2@abc.com", 
    password: "p2"
  }
};


const emailValidator = (emailToCheck) => {   
  for (let user in users) {
    if (users[user].email === emailToCheck) {
      //res.status(400).send({ error : 'status(400): Email already used!'})
      return true;
    }  
  } 
  //return false;
};

let id = generateRandomString();



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];

  const templateVars = { urls: urlDatabase, user};
  //console.log('templateVars',  templateVars);
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = {user}; 

  
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];
  //const templateVars = {user}; 

  const longURL = urlDatabase[req.params.shortURL]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user};
  
  res.render("urls_show", templateVars);
  
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;  
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;  
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortUrl = req.params.shortURL;
  delete urlDatabase[shortUrl];  
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls`);
});


//redirect link to longURL
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  longURL = urlDatabase[req.body]
  res.redirect(longURL);
});

//cookies

app.get("/login", (req, res) => {

  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = {user}; 

 

 res.render("login", templateVars);

});


app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  let user = id;
  
 
  if (!emailValidator(email)) {
    res.status(403).send({ error : 'status(403): The email does not exist. Click Register!'});
  }
 
  if (users[user].password !== req.body.password) {
    res.status(403).send({ error : 'status(403): The password does not exist. Click Register!'});
  }
  res.cookie('user_id', id); 
  res.redirect("/urls");

  //console.log('id+++++', id);
    
  console.log('users+++++', users);
   
});



//register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //let id = generateRandomString();  

  if (!email || !password) {
    res.status(400).send({ error : 'status(400): The email or password field cannot be empty!'})
  };

  
  if (emailValidator(req.body.email)) {
     res.status(400).send({ error : 'status(400): Email already used!'});
  }

  
  let newUser = {  id, email, password };
  users[id] = newUser;   

  res.cookie("user_id", id);  
  res.redirect("/urls");
  
});



//REGISTER
app.get("/register", (req, res) => {

  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = {user}; 

  res.render("register", {user: null});
 
});




app.post("/logout", (req, res) => {
  
  res.clearCookie('user_id');  
 
  res.redirect("/urls");
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});