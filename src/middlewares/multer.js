import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./src/public/uploadedImages')
    },
    fulename:function (req,file,cb){
    const uniqueName=Date.now() + '-' + Math.round(Math.random()* 1E9)
    cb(null,file.fieldname)
    }
})

export const upload=multer({storage:storage})

