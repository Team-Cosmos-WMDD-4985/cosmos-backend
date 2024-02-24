import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
});


userSchema.pre('save', async function(next){
    const user = this;
    user.password = await bcrypt.hash(user.password,8)
    next()
})


const User = mongoose.model("User", userSchema);
export default User;

