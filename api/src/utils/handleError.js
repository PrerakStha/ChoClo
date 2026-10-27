export function handleError(err, res){
    if(err.status){
        return res.status(err.status).json({message: err.message})
    }
    console.log(err)
    return res.status(500).json({message: "Something went wrong"})
}