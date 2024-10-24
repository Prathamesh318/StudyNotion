const Tag=require("../model/Category")



exports.createCategory=async(req,res)=>{
        try {
            const {name,description}=req.body;

            if(!name || !description){
                return res.status(400).json({
                    success:false,
                    message:"All Fields are requires"
                })
            }

            const tagDetails = await Tag.create({
                name:name,
                description:description
            });


            return res.status(200).json({
                success:true,
                message:"Created tage successfully"
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message:"Creating tage fails"
            })
            
        }
}

exports.showAllCategory=async(req,res)=>{
    try {
        const allTags=await Tag.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"Category retrieved successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Retrieving failed"
        })
    }
}