import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        
    },

}, {
  timestamps: true,
})

const UserEmail = mongoose.model('UserEmail', userSchema);
export default UserEmail;