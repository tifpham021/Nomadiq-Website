import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter your username'],
        trim: true
    },
    password:{
        type:String,
        required: [true, 'Please enter your password'],
        trim: true
    },

}, {
    timestamps: true
})

const UserLogin = mongoose.model('UserLogin', userSchema);
export default UserLogin;