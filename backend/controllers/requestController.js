import { validationResult } from 'express-validator';
import Request from '../models/Request.js';
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import { sendNotificationEmail } from '../utils/email.js';

export const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcement = await Announcement.findById(req.body.announcement).populate('driver');
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (announcement.driver._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own announcement' });
    }

    const estimatedPrice = req.body.cargoDetails.weight * announcement.pricePerKg;

    const request = await Request.create({
      ...req.body,
      sender: req.user.id,
      driver: announcement.driver._id,
      estimatedPrice
    });

    await request.populate([
      { path: 'sender', select: 'firstName lastName rating' },
      { path: 'announcement', select: 'startLocation endLocation departureDate' }
    ]);

    // Send notification email to driver
    await sendNotificationEmail(
      announcement.driver.email,
      'New Transport Request',
      `You have received a new transport request from ${req.user.firstName} ${req.user.lastName}`
    );

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ driver: req.user.id })
      .populate('sender', 'firstName lastName rating')
      .populate('announcement', 'startLocation endLocation departureDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.user.id })
      .populate('driver', 'firstName lastName rating')
      .populate('announcement', 'startLocation endLocation departureDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const request = await Request.findById(requestId)
      .populate('sender')
      .populate('driver');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check authorization
    if (req.user.role === 'driver' && request.driver._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'sender' && request.sender._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // Send notification email
    const recipient = req.user.role === 'driver' ? request.sender : request.driver;
    await sendNotificationEmail(
      recipient.email,
      'Request Status Update',
      `Your transport request status has been updated to: ${status}`
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate completed deliveries' });
    }

    let targetUserId, ratingField;
    
    if (req.user.id.toString() === request.sender.toString()) {
      // Sender rating driver
      targetUserId = request.driver;
      ratingField = 'driverRating';
    } else if (req.user.id.toString() === request.driver.toString()) {
      // Driver rating sender
      targetUserId = request.sender;
      ratingField = 'senderRating';
    } else {
      return res.status(403).json({ message: 'Not authorized to rate this request' });
    }

    if (request[ratingField]) {
      return res.status(400).json({ message: 'You have already rated this user' });
    }

    // Update request with rating
    request[ratingField] = { rating, comment };
    await request.save();

    // Update user's average rating
    const user = await User.findById(targetUserId);
    const newCount = user.rating.count + 1;
    const newAverage = ((user.rating.average * user.rating.count) + rating) / newCount;
    
    user.rating.average = newAverage;
    user.rating.count = newCount;
    if (ratingField === 'driverRating') {
      user.completedTransports += 1;
    }
    await user.save();

    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};