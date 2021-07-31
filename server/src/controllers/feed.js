const { user, feed, follow, like, comment } = require('../../models')
const joi = require('joi')

exports.addFeed = async (req, res) => {

    try {

        const { idUser } = req

        const data = req.body
        const image = req.files.imageFile[0].filename
    
        const feeds = await feed.create({
            ...data,
            image,
            idUser: idUser,
            likes: 0,
            comments: 0,
            shares: 0
        })

        const checkUser = await user.findOne({
            where: {
                id: idUser
            }
        })

        await user.update({p_posts: checkUser.p_posts + 1}, {where: {id: idUser}})
    
        const users = await feed.findOne({
            where: {
                id: feeds.id
            },
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio', 'token']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'token', 'idUser']
            }
        })
    
        res.send({
            status: 'success',
            Feed: users
        })
        
    } catch (err) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }  
}

exports.feedByFollow = async (req, res) => {

    try {

        const { idUser } = req

        console.log(idUser)

        // // Include by

        // const data = await user.findOne({
        //     where: {
        //         id: idUser
        //     },
        //     include: {
        //         model: follow,
        //         as: 'following',
        //         attributes: {
        //             exclude: ['createdAt', 'updatedAt', 'idFollower', 'idFollowing']
        //         },
        //         include: {
        //             model: user,
        //             as: 'following',
        //             attributes: {
        //                 exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio', 'token', 'fullname', 'image', 'username']
        //             },
        //             include: {
        //                 model: feed,
        //                 as: 'posts',
        //                 attributes: {
        //                     exclude: ['createdAt', 'updatedAt', 'idUser', 'token']
        //                 },
        //                 include: {
        //                     model: user,
        //                     as: 'user',
        //                     attributes: {
        //                         exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio', 'token']
        //                     },
        //                 }
        //             }
        //         }
        //     },
        //     attributes: {
        //         exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio', 'token', 'fullname', 'image', 'id', 'username']
        //     },
        // })

        // //

        // Filter user following

        let foll = []

        foll = await follow.findAll({
            where: {
                idFollower: idUser
            }
        })

        // Looping to get each feed data by id

        let data = []

        for (i = 0; i < foll.length; i++) {

            const a = await feed.findAll({
                where: {
                    idUser: foll[i].idFollowing
                },
                include: {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'token', 'bio', 'email', 'password']
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'token', 'idUser']
                },
            })

            data.push(a)
            
        }         

        res.send({
            status: 'success',
            data: {
                feed: data
            }
        })
        
    } catch (err) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }
}

exports.feeds = async (req, res) => {

    try {

        const feeds = await feed.findAll({
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'token', 'bio', 'email', 'password']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'token', 'idUser']
            }
        })

        res.send({
            idUser: req.idUser,
            status: 'success',
            data: {
                feed: feeds
            }
        })
        
    } catch (error) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }

}

exports.like = async (req, res) => {

    try {

        const { idUser } = req
        const { id } = req.body

        const schema = joi.object({
            id: joi.number().required()
        }).validate(req.body)

        if(schema.error){
            return res.send({
                status: 'failed',
                message: schema.error.details[0].message
            })
        }

        const checkId = await feed.findOne({
            where: {
                id
            }
        })

        if(!checkId){
            return res.send({
                status: 'failed',
                message: 'Not found!'
            })
        }

        const check = await like.findOne({
            where: {
                idUser: idUser,
                idfeed: id
            }
        })

        if(check){

            const feeds = await feed.findOne({
                where: {
                    id
                }
            })

            const likes = feeds.likes - 1

            await feed.update({likes: likes}, { where: { id } })

            await like.destroy({
                where: {
                    idFeed: id,
                    idUser: idUser
                }
            })

            return res.send({
                status: 'success',
                message: 'Dislike',
                likes: likes
            })
        }

        const data = await feed.findOne({
            where: {
                id
            }
        })

        await like.create({
            idFeed: id,
            idUser: idUser
        })

        const likes = data.likes + 1

        await feed.update({likes: likes},{
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            id,
            likes
        })
        
    } catch (err) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }

}

exports.likeById = async (req, res) => {
    try {
        const { id } = req.params

        const likes = await like.findAll({
            where: {
                idUser: id
            }
        })

        if(!likes){
            return res.send({
                status: 'failed',
                message: 'No Likes'
            })
        }

        res.send({
            status: 'success',
            like: likes
        })
    } catch (error) {
        console.log(error)
    }
}

exports.comments = async (req, res) => {

    try {

        const { id } = req.params

        const check = await feed.findOne({
            where: {
                id
            }
        })

        if(!check) {
            return res.send({
                status: 'failed',
                message: 'Not Found!'
            })
        }

        const comments = await feed.findOne({
            where: {
                id
            },
            include: {
                model: comment,
                as: 'Comments',
                include: {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'email', 'bio', 'token']
                    }
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idUser', 'idFeed']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser', 'likes', 'id', 'image', 'caption', 'comments', 'shares']
            }
        })

        res.send({
            status: 'success',
            data: comments
        
        })
        
    } catch (err) {
        
        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }

}

exports.addComment = async (req, res) => {

    try {

        const { idUser } = req
        const { id_feed } = req.body
        const comments = req.body.comment

        const check = await feed.findOne({
            where: {
                id: id_feed
            }
        })

        if(!check){
            return res.send({
                status: 'failed',
                message: 'Feed not found'
            })
        }

        const schema = joi.object({
            id_feed: joi.number().required(),
            comment: joi.string().required()
        }).validate(req.body)

        if(schema.error){
            return res.send({
                status: 'failed',
                message: schema.error.details[0].message
            })
        }

        const data = await comment.create({
            idFeed: id_feed,
            comment: comments,
            idUser,
        })

        const comm = check.comments + 1

        await feed.update({comments: comm}, {
            where: {
                id: id_feed
            }
        })

        res.send({
            status: 'success',
            data: {
                comment: {
                    id: data.id,                    
                }
            }
        })
        
    } catch (err) {
        
        console.log(err)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })

    }

}

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params

        await comment.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success'
        })
    } catch (error) {
        console.log(error)
    }
}