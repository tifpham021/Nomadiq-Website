import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "Please enter your name"],
        trim: true
    },
    username:{
        type: String,
        required: [true, 'A username is required'],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    password:{
        type:String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        validator: function (v) {
        return /[A-Z]/.test(v) && /[0-9]/.test(v);
      },
      message: () => `Password must include at least one uppercase letter and one number.`
    },
    resetToken: String,
    resetTokenExpire: Date,
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
export default User;