const { user, follow, feed} = require('../../models')
const joi = require('joi')
const { feedByFollow } = require('./feed')

exports.getUsers = async (req, res) => {

    try {
        
        const users = await user.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'token']
            }
        })

        res.send({
            status: 'success',
            data: {
                users
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

exports.getUserByUsername = async (req, res) => {
    try {

        const { username } = req.params

        const data = await user.findOne({
            where: {
                username
            }
        })

        if(!data){
            return res.send({
                status: 'failed',
                message: 'User not found'
            })
        }

        res.send({
            status: 'success',
            user: data
        })

    } catch (error) {
        console.log(error)
    }
}

exports.getUserById = async (req, res) => {
    try {

        const { id } = req.params

        const data = await user.findOne({
            where: {
                id
            }
        })

        if(!data){
            return res.send({
                status: 'failed',
                message: 'User not found'
            })
        }

        res.send({
            status: 'success',
            user: data
        })

    } catch (error) {
        console.log(error)
    }
}

exports.addFollowing = async (req, res) => {

    try {

        const { idUser } = req

        const { id } = req.body

        const schema = joi.object({
            id: joi.number().required()
        }).validate(req.body)

        const { error } = schema

        if(error){
            return res.send({
                status: 'failed',
                message: error.details[0].message
            })
        }

        const checkMe = await user.findOne({
            where: {
                id: idUser
            }
        })

        const check = await user.findOne({
            where: {
                id
            }
        })

        if(!check){
            return res.send({
                status: 'failed',
                message: `User with id ${id} not found!`
            })
        }

        const follows = await follow.findOne({
            where: {
                idFollower: idUser,
                idFollowing: id
            }
        })

        if(follows){
            
            await user.update({p_followers: check.p_followers - 1} ,{
                where: {
                    id: check.id
                }
            })

            await user.update({p_following: checkMe.p_following - 1} ,{
                where: {
                    id: idUser
                }
            })

            await follow.destroy({
                where: {
                    id: follows.id
                }
            })

            return res.send({
                status: 'success',
                message: `Unfollow id ${id}`
            })
        }
        
        const followers = check.p_followers + 1

        await user.update({p_followers: followers} ,{
            where: {
                id: check.id
            }
        })

        await user.update({p_following: checkMe.p_following + 1} ,{
            where: {
                id: idUser
            }
        })
    
        await follow.create({
            idFollower: idUser,
            idFollowing: id
        })

        res.send({
            status: 'success',
            message: `Followed id ${id}`
        })

        
    } catch (err) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }  
}

exports.getFollowers = async (req, res) => {
   
    try {
        
        const { id } = req.params

        const users = await user.findOne({
            where: {
                id
            },
            include: {

                model: follow,
                as: 'follower',
                include: {
                    model: user,
                    as: 'follower',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'token', 'password',]
                    }
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idFollower', 'idFollowing']
                }
            },
            
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'token', 'password', 'image', 'bio']
            }
        })

        if(!users){
            res.send({                
                status: 'failed',
                message: `Data with id: ${id} not found!`
            })
        }

        res.send({
            idUser: req.idUser,
            status: 'success',
            data: users
        })

    } catch (error) {

        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }

}

exports.getFollowing = async (req, res) => {
   
    try {
        
        const { id } = req.params

        const users = await user.findOne({
            where: {
                id
            },
            include: {
                
                model: follow,
                as: 'following',
                include: {
                    model: user,
                    as: 'following',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'token', 'password']
                    }
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idFollower', 'idFollowing']
                }
            },
            
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'token', 'password', 'image', 'bio']
            }
        })

        if(!users){
            res.send({                
                status: 'failed',
                message: `Data with id: ${id} not found!`
            })
        }

        res.send({
            idUser: req.idUser,
            status: 'success',
            data: users
        })

    } catch (error) {

        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }

}

exports.editProfile = async (req, res) => {

    try {
        
        const { idUser, body } = req

        const p_image = req.files.imageFile[0].filename

        if(!p_image){
            return await user.update(body, {where: {id: idUser}})
        }

        await user.update({
            ...body,
            p_image
        }, {
            where: {
                id: idUser
            }            
        })

        const updatedUser = await user.findOne({
            where: {
                id: idUser
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'token']
            }
        })

        res.send({
            status: 'success',
            data: updatedUser
        })

    } catch (error) {
        
        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'            
        })

    }

}

exports.deleteUser = async (req, res) => {

    try {

        const { id } = req.params

        const check = await user.findOne({
            where: {
                id
            }
        })

        if(!check){
            return res.send({
                status: 'failed',
                message: `User with id ${id} not found`
            })
        }

        await user.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            id: check.id
        })
        
    } catch (error) {
        
        console.log(error)

        res.status({
            status: 'failed',
            message: 'Server Error'            
        })

    }
}

exports.getProfileFeed = async (req, res) => {
    try {
        const { id } = req.params

        const data = await feed.findAll({
            where: {
                idUser: id
            },
            include: {
                model: user,
                as: 'user'
            }
        })

        if(!data) {
            return res.send({
                status: 'failed',
                message: 'no data found'
            })
        }

        res.send({
            status: 'success',
            feeds: data
        })

    } catch (error) {
        console.log(error)
    }
}