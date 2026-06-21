const User = require('../../models/user');
const { saveImage } = require("../../utils/imageUpload")

async function editProfile(req, res){
    const { op } = req.query;
    if(!op) return res.status(400).json({ error: "Operation not specified."})
    try {
        const user = await User.findById(req.user.userId);
        if(!user) return res.status(404).json({ error: "User not found in DB."});

        if(op === "image"){
            const image = await saveImage(req.body.image, "profile", )
            if(!image)  return res.status(400).json({ error: "Image not uploaded. "});
            user.profile.image = image.path;
            await user.save();
            res.status(200).json({
                message: "Profile uploaded successfully.",
                path: user.profile.image
            })
        }else if(op === "name"){
            user.profile.fullName = req.body.fullName;
            await user.save();

            res.status(200).json({
                message:"Profile updated successfully.",
                fullName: user.profile.fullName
            })
        }
    } catch (err) {
        if (err.statusCode === 413) { return res.status(413).json({    error: err.message   }); }
        console.error("Profile edit Error:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = editProfile