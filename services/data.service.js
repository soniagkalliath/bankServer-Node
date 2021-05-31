const db = require('./db');
//let currentUser;
let accountDetails= {
    1000: { acno: 1000, username: "userone", password: "userone", balance: 50000 },
    1001: { acno: 1001, username: "usertwo", password: "usertwo", balance: 5000 },
    1002: { acno: 1002, username: "userthree", password: "userthree", balance: 10000 },
    1003: { acno: 1003, username: "userfour", password: "userfour", balance: 6000 }
}

const register = (uname,acno,pswd)=>{

return db.User.findOne({acno})
.then(user=>{
 // console.log(user);
  if(user){
    return {
      statusCode:422,
        status:  false,
        message: "User Exist please Login"
      }
  }
  else{
    const newUser = new db.User({
      acno,
      username:uname,
      password:pswd,
      balance:0
    })
    newUser.save();
    return {
      statusCode:200,
      status:  true,
      message: "Succesfully registerd"
    }
  }
})
  }


  const login = (req,accno,password) =>{
  
    var acno = parseInt(accno);
   
    return db.User.findOne({acno,password})
    .then(user=>{
    
      if(user){
        req.session.currentUser = user;
        return {
          statusCode:200,
          status:  true,
          message: "Succesfully log in"
        }
      }
      else{
        return {
          statusCode:422,
            status:  false,
            message: "Invalid credentials"
          }
      }
    })

  }


 const deposit = (acno,pswd,amt) =>{

  
    var amount = parseInt(amt);
    let user = accountDetails;
    if(acno in user){
      if (pswd == user[acno]["password"]) {
        user[acno]["balance"]+=amount;
        return {
          statusCode:200,
          status:  true,
          balance: user[acno]["balance"],
          message: amount + " credited and new balance is "+ user[acno]["balance"]
        }
       
      }
      else{
        return {
          statusCode:422,
            status:  false,
            message: "Incorrect Password"
          }
      }
    }
    else{
      return {
        statusCode:422,
          status:  false,
          message: "Invalid Account"
        }
    }
  
  }



 const withdraw = (acno,pswd,amt) =>{

    var amount = parseInt(amt);
    let user = accountDetails;
    if(acno in user){
      if (pswd == user[acno]["password"]) {
  
        if(user[acno]["balance"] > amount){
          user[acno]["balance"]-=amount;
          
          return {
            statusCode:200,
            status:  true,
            balance: user[acno]["balance"],
            message: amount + " debited and new balance is "+ user[acno]["balance"]
          }
        }
       else{
         return {
          statusCode:422,
            status:  false,
            message: "Insufficient Balance"
          }
       }
      }
      else{
        return {
          statusCode:422,
            status:  false,
            message: "Incorrect Password"
          }
      }
    }
    else{
      return {
        statusCode:422,
          status:  false,
          message: "Invalid Account"
        }
    }
  
  }

  module.exports={
    register,
    login,
    deposit,
    withdraw
  }