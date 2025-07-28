import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Please enter the country"],
      trim: true,
    },
    date: {
      arrival: {
        type: Date,
        required: true,
      },
      departure: {
        type: Date,
        required: true,
      },
    },
    transportation: {
      type: String,
      required: [true, "Please select your mode of transportation"],
    },
  },
  {
    timestamps: true,
  }
);

const UserPlan = mongoose.model('UserPlan', userSchema);
export default UserPlan;