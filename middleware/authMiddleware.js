import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).send({
            message:"Unauthorized: no token provided"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.status(403).send({
            message:"invalid or expired token",
            error
        })
    }
}