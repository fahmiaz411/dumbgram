const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {

    try {
        
        let header = req.header('Authorization')

        if(!header){
            return res.send({
                status: 'failed',
                message: 'Forbidden Access!'
            })
        }        

        const token = header.replace('Bearer ', '')

        const secretKey = process.env.SECRET_KEY

        const verified = jwt.verify(token, secretKey, (err, decoded) => {
            if(err){
                return res.send({
                    status: 'failed',
                    message: 'User not verified, Forbidden Access!'
                })
            }

            req.idUser = decoded.id
        })

        next()

    } catch (error) {

        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }    
}