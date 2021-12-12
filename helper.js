const getUserByEmail = (emailToCheck, users) => {   
  for (let user in users) {
    if (users[user].email === emailToCheck) {
      
      return user;
    }  
  } 
  //return false;
};

module.exports = getUserByEmail;

