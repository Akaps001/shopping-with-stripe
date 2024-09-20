const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json("Token not valid or expire")
            }
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("Not Authenticated")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
   //checking for both user and admin
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json("You are not allowed to do that !")
        }
        
    })

}
// verification for admin only
const verifyTokenAndAdmin = (req, res, next) => {
    //strictly for admin
     verifyToken(req, res, () => {
         if (req.user.isAdmin) {
             next()
         } else {
             return res.status(403).json("You are not allowed to do that !")
         }
         
     })
 
 }
module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} 