const bcrypt = require('bcrypt')
const { user } = require('../../models')
const joi = require('joi')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    
    try {        

        const { username, fullname, password, email } = req.body
        const data = req.body        

        const schema = joi.object({
            fullname: joi.string().min(8).required(),         
            username: joi.string().min(6).required(),
            email: joi.string().email().required(),
            password: joi.string().min(8).required(),
            bio: joi.string().allow(null).allow(''),
            p_image: joi.string().allow('')
        }).validate(data)

        if(schema.error){
            return res.send({
                status: 'failed',
                message: schema.error.details[0].message
            })
        }

        const checkUsername = await user.findOne({
            where: {
                username: username
            }
        })

        const checkEmail = await user.findOne({
            where: {
                email: email
            }
        })

        if(checkUsername){
            return res.send({
                status: 'failed',
                message: 'Username already exist'
            })
        } else if(checkEmail) {
            return res.send({
                status: 'failed',
                message: 'Email already exist'
            })
        }
        
        const hashPassword = await bcrypt.hash(password, 10)
        
        const dataBody = {
            fullname: fullname,
            username: username,
            email: email
        }
        
        await user.create({
            ...data,
            password: hashPassword
        })        

        res.send({
            status: 'success',
            data: {
                user: dataBody
            }
        })

    } catch (error) {

        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'            
        })
    }
    
}

exports.login = async (req, res) => {
    
    try {

        const { email, username, password } = req.body

        if(!email && !username){
            return res.send({
                status: 'failed',
                message: "Email or username could'nt empty"
            })
        }

        if(username){
            data = await user.findOne({
                where: {
                    username
                }
            })
        } else if (email) {
            data = await user.findOne({
                where: {
                    email
                }
            })
        } else {
            return res.send({
                status: 'failed',
                message: 'Email or password wrong!'
            })
        }
        
        if(!data){
            return res.send({
                status: 'failed',
                message: `Email or password wrong!`
            })
        }
        
        const hashPassword = await bcrypt.compare(password, data.password)

        if(!hashPassword){
            return res.send({
                status: 'failed',
                message: `Email or password wrong!`
            })
        }

        const secretKey = process.env.SECRET_KEY
        const token = jwt.sign({
            id: data.id
        }, secretKey)

        const { fullname } = data
    
        const dataBody = {
            id: data.id,
            fullname: fullname,
            username: username,
            email: email,
            token: token
        }
    
        res.send({
            status: 'success',
            data: {
                user: dataBody
            }
        })

    } catch (error) {
        
        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'            
        })
    }

}

exports.checkAuth = async (req,res) => {
    try {

        const id = req.idUser

        const dataUser = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })
    
        if(!dataUser){
            return res.status(404).send({
                status: 'failed'
            })
        }


        res.send({
            status: 'success',
            data: {
                user: {
                    id: dataUser.id,
                    fullname: dataUser.fullname,
                    username: dataUser.username,
                    email: dataUser.email
                }
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}