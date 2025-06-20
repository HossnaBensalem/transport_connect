import { validationResult } from 'express-validator';
import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcement = await Announcement.create({
      ...req.body,
      driver: req.user.id
    });

    await announcement.populate('driver', 'firstName lastName rating isVerified');
    
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startLocation, 
      endLocation, 
      cargoTypes, 
      minDate, 
      maxDate 
    } = req.query;

    const query = { status: 'active' };
    
    if (startLocation) {
      query.startLocation = { $regex: startLocation, $options: 'i' };
    }
    if (endLocation) {
      query.endLocation = { $regex: endLocation, $options: 'i' };
    }
    if (cargoTypes) {
      query.cargoTypes = { $in: cargoTypes.split(',') };
    }
    if (minDate || maxDate) {
      query.departureDate = {};
      if (minDate) query.departureDate.$gte = new Date(minDate);
      if (maxDate) query.departureDate.$lte = new Date(maxDate);
    }

    const announcements = await Announcement.find(query)
      .populate('driver', 'firstName lastName rating isVerified')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('driver', 'firstName lastName rating isVerified phone');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ driver: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndUpdate(
      { _id: req.params.id, driver: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({
      _id: req.params.id,
      driver: req.user.id
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};