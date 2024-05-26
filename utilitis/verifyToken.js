
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utilitis/error.js'

export const verifytoken=(req,res,next)=>{  //you have to install the module cookie-parser first
 const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,"You are not authenticated!"))

    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(401,"Invalid token"))

            req.user=user;
            next()
    })
   
}