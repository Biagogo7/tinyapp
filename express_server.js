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






app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};   //note
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
  
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
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
 console.log('username: === ', req.body.username) 
 const templateVars = {username: req.cookies["username"]};
 //res.render("urls_show", templateVars);
 res.render("urls_new", {username: null});
});


app.post("/login", (req, res) => {
  const nameValue = req.body.username;
  res.cookie('username', nameValue);
  
  res.redirect("/urls");
});

//register
app.post("/register", (req, res) => {
  // const nameValue = req.body.username;
  // res.cookie('username', nameValue)
  let user = generateRandomString();
  console.log("user3 ===== ", user );
  console.log("useremail ===== ", req.body.email );
  console.log("userpw ===== ", req.body.password );
  console.log(users);

  users[user]['id'] = user;
  users[user]["email"] = req.body.email;
  users[user]["password"] = req.body.password;
  res.cookie(user);
  
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  console.log('name: === ', req.body.name) 
  console.log('email: === ', req.body.email)
  res.render("register");
});


app.post("/logout", (req, res) => {
  //const nameValue = req.body.username;
  res.clearCookie('username');  
  res.redirect("/urls");
});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});