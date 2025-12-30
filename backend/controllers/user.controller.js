import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from "../models/connections.model.js";
import mongoose from 'mongoose';
import Post from "../models/posts.model.js";
const { Connection } = mongoose;
import Comment from "../models/comments.model.js";



const convertUserDataTOPDF = async(userData) => {
    const doc = new PDFDocument(); // ✅ fix 1
    const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf"; // ✅ fix 5
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);

    // ✅ Profile Picture
    const imagePath = userData.userId.profilePicture === "default.jpg"
  ? "uploads/default.jpg"
  : `uploads/${userData.userId.profilePicture}`;

doc.image(imagePath, {
  align: "center",
  width: 100
});


    // ✅ Profile Data
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);

    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    // ✅ Past Work
    doc.moveDown().fontSize(14).text("Past Work:");
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(12).text(`Company Name: ${work.company}`);
        doc.text(`Position: ${work.position}`);
        doc.text(`Years: ${work.years}`);
        doc.moveDown();
    });

    // ✅ Finalize PDF
    doc.end();

    return outputPath; // optional: return PDF path for response or email
};
// ================= REGISTER ====================
export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res.json({ message: "User Created Successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token, user }); // add user details too if needed
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPLOAD PROFILE PICTURE ====================
export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.json({ message: "Profile picture updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= UPDATE USER PROFILE ====================
export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { username, email } = newUserData;
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(400).json({ message: "User already exists" });
        }

        Object.assign(user, newUserData);
        await user.save();

        return res.json({ message: "User updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ================= GET USER AND PROFILE (GET VERSION) ====================
export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query; // ✅ GET: use query

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(userProfile);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const uploadProfileData = async (req, res ) => {
    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }
        const profile_to_update = await Profile.findOne({userId: userProfile._id})
        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();
        return res.json({ message: "profile Updated"});
}catch (error) {
        return res.status(500).json({ message: error.message });
}
}
export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');
    profiles.forEach(p => {
  if (
    !p.userId.profilePicture ||
    p.userId.profilePicture === "default.jpg"
  ) {
    p.userId.profilePicture = "/default.jpg";
  }
});

        return res.json({ profiles }); // ✅ now it matches the variable name
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const downloadProfile = async (req, res)=> {
const user_id = req.query.id;
console.log("USER ID:", user_id);

//return res.json({"message": "Not Implemented Yet"});
const userProfile = await Profile.findOne({userId: user_id})
.populate('userId', 'name username email profilePicture');
let outputPath = await convertUserDataTOPDF(userProfile);
return res.json({"message" : `uploads/${outputPath}` })
}

export const sendConnectionRequest = async(req, res) => {
    const {token, connectionId} = req.body;
    try {
       const user = await User.findOne({token }) ;
       if(!user){
        return res.status(404).json({ message: "User not found" });
       }
       const connectionUser = await User.findOne({_id: connectionId});
       if(!connectionUser){
        return res.status(404).json({ message: "Connection User not found" });
       }
       const existingRequest = await ConnectionRequest.findOne(
        {
            userId: user._id,
            connectionId: connectionUser._id
        }
       )
       if(existingRequest){
        return  res.status(400).json({message: "Request already sent"})
       }
       const request = new ConnectionRequest({
        userId: user._id,
            connectionId: connectionUser._id
       });
       await request.save();
       
       return res.json({message: "Request Send"})

    } catch (err) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.query; // ✅ GET uses query

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const whatAreMyConnections = async(req, res) => {
    const {token } = req.query;
    try {
        const user = await User.findOne({token }) ;
        if(!user){
        return res.status(404).json({ message: "User not found" });
       }
       const connections = await ConnectionRequest.find({connectionId: user._id})
       .populate('userId', 'name username email profilePicture');
       return res.json(connections);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const acceptConnectionRequest = async(req, res) => {
    const {token, requestId, action_type} = req.body ;
    try {
        const user = await User.findOne({ token });
         if(!user){
        return res.status(404).json({ message: "User not found" });
       }
       const connection = await ConnectionRequest. findOne({_id: requestId});
       if(!connection){
        return res.status(404). json({message: "Connection not found"})
       }
       if(action_type === "accept"){
        connection.status_accepted = true;
       }else{
        connection.status_accepted = false;
       }
       await connection.save();
       return res.json({message: "Request Updated"})
    } catch (err) {
        return res.status(500).json({ message: error.message });
    }
}

export const commentPost = async (req, res) => {
    console.log("COMMENT BODY:", req.body);
    const { token, post_id, body} = req.body;
    try {
        const user = await User.findOne({ token: token }).select("_id");
        if(!user){
        return res.status(404).json({ message: "User not found" });
       }
       const post = await Post.findOne({_id: post_id});
       if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: body
        });
        await comment.save();
        return res.status(200).json({message: "Comment Added"})
    } catch (error) {
        console.error("COMMENT ERROR:", error); 
         return res.status(500).json({ message: error.message });
    }
}

export const getUserProfileAndUserBasedOnUsername = async(req, res) => {
    const{ username} = req.query;
    try{

        const user = await User.findOne({
            username
        });
        if(!user){
            return res.status(404).json({ message: "User not found"})
        }

        const userProfile = await Profile.findOne({ userId: user._id})
        .populate('userId','name username email profilePicture');
        if (
  !userProfile.userId.profilePicture ||
  userProfile.userId.profilePicture === "default.jpg"
) {
  userProfile.userId.profilePicture = "default.jpg";
}
        return res.json({"profile": userProfile})
    }catch(err){
        return res.status(500).json({ message: error.message });
    }
}
 