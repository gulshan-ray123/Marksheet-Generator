const jwt= require('jsonwebtoken');
require('dotenv').config();
const jwtSecretKey=process.env.SECRET_KEY;
const requireAuth=(req,res,next)=>{
       const token=req.cookies.token;
       // syntax for jwt token fetching
       // const token = req.cookies.tokenname(token);
       // You can refer tokem name from browser cookie.
       if(token){
                jwt.verify(token,jwtSecretKey,(err,decodeToken)=>{
                        if (err) {
                                res.redirect('/home/login/page');
                        }
                        else{
                                console.log(decodeToken);
                                
                               req.email=decodeToken,
                              
                                next();
                        }
                })
       }
        else{
                res.redirect('/home/login/page')
        }
        
       
}

module.exports={requireAuth};