import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  intermediateStops: [String],
  departureDate: {
    type: Date,
    required: true
  },
  maxDimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  maxWeight: {
    type: Number,
    required: true
  },
  cargoTypes: [{
    type: String,
    enum: ['fragile', 'heavy', 'liquid', 'food', 'electronics', 'furniture', 'documents', 'other']
  }],
  availableSpace: {
    type: Number,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  requestCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Announcement', announcementSchema);