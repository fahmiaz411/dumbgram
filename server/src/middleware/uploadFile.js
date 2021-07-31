const multer = require('multer')

exports.uploadFile = (imageFile, videoFile) => {
    const filename = ''
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''))
        }
    })

    const fileFilter = (req, file, cb) => {
        if(file.fieldname === imageFile){
            if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)){
                req.fileValidationError = {
                    message: 'Only image files'
                }
                return cb(new Error('Only image files'), false)
            }
        }

        if(file.fieldname === videoFile){
            if(!file.originalname.match(/\.(mp4|mov)$/)){
                req.fileValidationError = {
                    message: 'Only video files'
                }
                return cb(new Error("Only video files"), false)
            }
        }
        cb(null, true)
    }

    const sizeInMb = 1000
    const maxSize = sizeInMb * 1000 * 1000

    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize
        }
    }).fields([
        {
            name: imageFile,
            maxCount: 1
        },
        {
            name: videoFile,
            maxCount: 1
        }
    ])

    return (req, res, next) => {
        upload(req, res, function (err) {
            if(req.fileValidationError){
                return res.status(400).send(req.fileValidationError)
            }

            if(!req.files && !err){
                return res.status(400).send({
                    message: 'Please select files to upload'
                })
            }

            if(err){
                if(err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).send({
                        message: 'Max file sized 100MB'
                    })
                }
                return res.status(400).send(err)
            }

            return next()
        })
    }

} 