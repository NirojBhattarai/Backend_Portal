var jwt = require("jsonwebtoken");
const JWT_SECRET = "Neeerajisafullstackdeveloper";
const fetchuser = (req, res, next)=>{
    //Get th user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid"})   
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
         res.status(401).send({error:"Please authenticate using a valid"}) 
    }

   
}   

module.exports = fetchuser;