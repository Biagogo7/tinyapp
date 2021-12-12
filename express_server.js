const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const emailValidator = require('./helper');

app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser())

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  //maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


//DATABASES
//old database
// const urlDatabase = {                            
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
  },
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//FUNCTIONS
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}


let id = generateRandomString();
//const shortUrl = generateRandomString();

function urlsForUser(id) {
  let userUrls = {};
  for (const shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
       
  };
  return userUrls;
};

/*
// Looking up users by email
const emailValidator = (emailToCheck, users) => {   
  for (let user in users) {
    if (users[user].email === emailToCheck) {
      //res.status(400).send({ error : 'status(400): Email already used!'})
      return true;
    }  
  } 
      //return false;
};
*/



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  //const id = req.cookies.user_id;
  const id = req.session.user_id;
  const user = users[id];
  //let longURL = req.body.longURL;
  
  let longurls = {};
  for (const shortURL in urlDatabase) {
    const longURL = urlDatabase[shortURL].longURL;
    longurls[shortURL] = longURL;    
  };

  console.log('longurls_____ ', longurls);
  const userUrls = urlsForUser(id);
  //const templateVars = { shortURL: urlD, user};
 // const templateVars = { urls: longurls, user};
  const templateVars = { urls: userUrls, user};

  
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  const longURL = req.body.longURL;
  //const id = req.cookies.user_id;
  const id = req.session.user_id;
  const user = users[id];
  const templateVars = {user}; 


  if (id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect(`/login`);
  }
    
});


app.get("/urls/:shortURL", (req, res) => {
  //const id = req.cookies.user_id;
  const id = req.session.user_id;
  const user = users[id];
  //const templateVars = {user}; 


  const shortUrl = req.params.shortURL;
  const longURL = urlDatabase[shortUrl].longURL

  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortUrl].longURL, user};

  //const longURL = urlDatabase[req.params.shortURL]
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user};
  
  res.render("urls_show", templateVars);
  
});



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //user_id = id;
  //let userID = id;
  //const userID = req.cookies.user_id;
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortUrl = generateRandomString();    
  //urlDatabase[shortUrl] = req.body.longURL;    xx

  //urls display no url unless user logs in
  if (!userID) {
    res.status(403).send({ error : 'status(403): You need to Log in or Register!'});
  };


  if (!userID) {
    res.redirect(`/login`);
  }
  
  let newUrlObj = { longURL, userID };
  urlDatabase[shortUrl] = newUrlObj;   

  console.log("urldbs********", urlDatabase)  

  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortUrl}`);
});


app.post("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;              

  //const shortURL = req.params.shortURL;
  let shortUrl = req.params.shortURL;
  //const userID = req.cookies.user_id;
  const userID = req.session.user_id;
  const longURL = req.body.longURL;                
  //const longURL = urlDatabase[shortUrl].longURL
  let newUrlObj = { longURL, userID };

  if (urlDatabase[shortUrl].userID === userID) {
    
    urlDatabase[shortUrl] = newUrlObj;  
    res.redirect(`/urls`);
  } else {
    res.status(403).send({ error : 'status(403): You do not have permission to edit!'});
  }
  
  
  
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
 
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortUrl = req.params.shortURL;
  //const userID = req.cookies.user_id;
  const userID = req.session.user_id;

  if (urlDatabase[shortUrl].userID === userID) {
    delete urlDatabase[shortUrl];  
    res.redirect(`/urls`);
  } else {
    res.status(403).send({ error : 'status(403): You do not have permission to delete!'});
  }


  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  // res.redirect(`/urls`);
});


//redirect link to longURL
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...

  let shortUrl = req.params.shortURL;
  let shortUrlDB = Object.keys(urlDatabase);

  if (!shortUrlDB.includes(shortUrl)) {
    res.status(403).send({ error : 'status(403): shortUrl does not exist!'});
  }

   const longURL = urlDatabase[shortUrl].longURL;
  //longURL = urlDatabase[req.body]
  res.redirect(longURL);
});

//cookies

app.get("/login", (req, res) => {

  //const id = req.cookies.user_id;
  const id = req.session.user_id;
  const user = users[id];
  const templateVars = {user}; 

 res.render("login", templateVars);

});


app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = bcrypt.hashSync(password, 10);
  bcrypt.compareSync(password, hashedPassword);
  let user = id;

  // if (users[shortUrl].userID === "u1" === "u1" || users[shortUrl].userID === "u2") {
  //   password = users[shortUrl].password;
  //   hashedPassword = bcrypt.hashSync(password, 10);
  //   bcrypt.compareSync(password, hashedPassword);
  // };
 
  if (!emailValidator(email, users)) {
    res.status(403).send({ error : 'status(403): Not Registered yet!. Click Register!'});
  }

  if (!bcrypt.compareSync(password, hashedPassword)) {
    res.status(403).send({ error : 'status(403): ***Invalid Credentials!.*** Try again!'});
  }
 
  if (users[user].password !== req.body.password) {
    res.status(403).send({ error : 'status(403): Invalid Credentials!. Try again!'});
  }
  //res.cookie('user_id', id); 
  req.session.user_id = id; 
  res.redirect("/urls");

  //console.log('id+++++', id);
    
  console.log('users+++++', users);
   
});



//register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  //let id = generateRandomString();  

  console.log('PASSWORD =====', password);
  console.log('PASSWORD HASHED=====', hashedPassword);

  if (!email || !password) {
    res.status(400).send({ error : 'status(400): The email or password field cannot be empty!'})
  };

  
  if (emailValidator(req.body.email)) {
     res.status(400).send({ error : 'status(400): Email already used!'});
  }

  
  let newUser = {  id, email, password };
  users[id] = newUser;   

  //res.cookie("user_id", id);
  req.session.user_id = id;  
  res.redirect("/urls");
  
});



//REGISTER
app.get("/register", (req, res) => {

  //const id = req.cookies.user_id;
  const id = req.session.user_id;
  const user = users[id];
  const templateVars = {user}; 

  res.render("register", {user: null});
 
});




app.post("/logout", (req, res) => {
  
  //res.clearCookie('user_id');
  req.session = null
 
  res.redirect("/urls");
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});