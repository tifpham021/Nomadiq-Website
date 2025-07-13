import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
    time: {
        type:String,
        trim: true
    },
    activity:{
        type: String,
        trim: true
    },
    checked: {
        type: Boolean,
        default: false,
    }
}, {
})

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  dayBoxes: {
    type: [boxSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  },
  nightBoxes: {
    type: [boxSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length <= 4;
}

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;