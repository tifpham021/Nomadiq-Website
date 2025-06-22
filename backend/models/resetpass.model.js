import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    newPass:{
        type: String,
        required: [true, 'Please enter your new password'],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: function (v) {
                return /[A-Z]/.test(v) && /[0-9]/.test(v);
            },
             message: 'Password must include at least one uppercase letter and one number.',
         }
    },

    confirmNewPass:{
        type: String,
        required: [true, 'Please confirm your new password'],
    }

}, {
  timestamps: true,
})

const UserPass = mongoose.model('UserPass', userSchema);
export default UserPass;