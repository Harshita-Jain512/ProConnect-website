import mongoose, {Schema} from "mongoose";

const CommentSchema =  new mongoose.Schema({
    userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
    },
    postId: {
type: mongoose.Schema.Types.ObjectId,
ref: "post"
    },
    body: {
type: String,
required: true
    },

});
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;