import mongoose, {Schema} from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
type: String,
required: true
    },
    username: {
type: String,
required: true,
unique: true
    },
    email: {
type: String,
required: true,
unique: true
    },
    createdAt: {
type: Date,
default: Date.now
    },
    token: {
type: String,
default: ''
    },
    profilePicture: {
type: String,
default: 'default.jpg'
    },
    active: {
type: Boolean,
default: true
    },
    password: {
type: String,
required: true
    }

});
const User = mongoose.model("User", UserSchema)
export default User;