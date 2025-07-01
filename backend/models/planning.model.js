import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    destination:{
        type: String,
        required: [true, 'Please enter your destination'],
        
    },
    date:{
        arrival: {
        type: Date,
        required: true
        },
    departure: {
        type: Date,
        required: true
        }
    },
    transportation:{
        type: String,
        required:[true, 'Please select your mode of transportation']
    }

}, {
  timestamps: true,
})

const UserPlan = mongoose.model('UserPlan', userSchema);
export default UserPlan;