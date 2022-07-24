const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = function (req, res, next) {
  try{
    // console.log("inside the auhorization",req.headers.authorization.split(' ')[2])
      let token = req.headers.authorization.split(' ')[2]
        const decoded = jwt.verify(token, process.env.APP_SECRET)
        req.userData = decoded
        next()
    }catch(err){
        return res.status(401).json({"message": "Not Authorized"})
    }
};