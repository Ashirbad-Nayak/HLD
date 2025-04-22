
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token){
       return res.status(401).json({message: 'Unauthorized: Token not provided.'})
    }
    else{
        try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        next();
        }
        catch(error){
            console.log('Invalid token');
            return res.status(401).json({message: 'Unauthorized: Invalid token.'})
        }
    }
}