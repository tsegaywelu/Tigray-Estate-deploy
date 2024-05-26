import User from '../models/users.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utilitis/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
       .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
export const google=async(req,res,next)=>{
  try{
    const user= await User.findOne({email:req.body.email})
    if(user){//if user is registerd before  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
         .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);

    }
    else{
      const generatedPassword =
        Math.random().toString(36).slice(-8) +   //this means from A-Z  and from 0-9  and then take the last 8 digit only
        Math.random().toString(36).slice(-8);//from above i will take 8 digit and now 8 digit  totally  16 digit number 
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +  //here user email may be like tsegay welu gebrezgi  but we are splitting around the space 
          Math.random().toString(36).slice(-4),//and here to make it unique we are adding it from A-Z and 0-9  with 4
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
     await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } =newUser._doc;
      res
         .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    
    }
  }
  catch(error){
    next( error );
  }
  
}
export const signOut = async (req, res) => {
  try{
     res
    .clearCookie('access_token')
    .status(200)
    .json('User has been signed out.');

  }
  catch(error){
    next( error );
  }
 
};



