
const wrapper=(fn)=>async function(req,res,next){
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.status||500).render('error.ejs',{Error:error.message})
        // res.status(error.status||500).json({
        //     success:false,
        //     message:error.message
        // })
    }
}

export default wrapper