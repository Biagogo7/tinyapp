const getUserByEmail = (emailToCheck, users) => {   
  for (let user in users) {
    if (users[user].email === emailToCheck) {
      //res.status(400).send({ error : 'status(400): Email already used!'})
      return user;
    }  
  } 
  //return false;
};

module.exports = getUserByEmail;

