import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cargoDetails: {
    weight: {
      type: Number,
      required: true
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    type: {
      type: String,
      required: true
    },
    description: String,
    value: Number
  },
  pickupLocation: {
    type: String,
    required: true
  },
  deliveryLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  notes: String,
  driverRating: {
    rating: Number,
    comment: String
  },
  senderRating: {
    rating: Number,
    comment: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Request', requestSchema);