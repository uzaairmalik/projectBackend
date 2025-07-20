const BloodDonor = require('../models/BloodDonor');
const User = require('../models/user');

// @desc    Register as blood donor
// @route   POST /api/blood/donors
exports.registerDonor = async (req, res) => {
  try {
    const { bloodType, location, contactNumber, healthConditions } = req.body;
    
    // Check if user already registered
    let donor = await BloodDonor.findOne({ user: req.user.id });
    
    if (donor) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a blood donor'
      });
    }
// @desc    Schedule blood donation appointment
// @route   POST /api/blood/appointments
exports.scheduleAppointment = async (req, res) => {
  try {
    const { location, appointmentDate } = req.body;
    
    // Check if donor exists
    const donor = await BloodDonor.findOne({ user: req.user.id });
    if (!donor) {
      return res.status(400).json({
        success: false,
        message: 'You need to register as a blood donor first'
      });
    }

    // Check if appointment is at least 56 days from last donation
    if (new Date(appointmentDate) < donor.nextDonationDate) {
      return res.status(400).json({
        success: false,
        message: `You can only donate blood after ${donor.nextDonationDate.toDateString()}`
      });
    }

    const appointment = new BloodDonationAppointment({
      donor: donor._id,
      location,
      appointmentDate
    });

    await appointment.save();
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
    donor = new BloodDonor({
      user: req.user.id,
      bloodType,
      location,
      contactNumber,
      healthConditions: healthConditions || []
    });

    await donor.save();
    
    // Update user profile with blood type
    await User.findByIdAndUpdate(req.user.id, { bloodType });

    res.status(201).json({
      success: true,
      data: donor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get blood donors by type and location
// @route   GET /api/blood/donors
exports.getDonors = async (req, res) => {
  try {
    const { bloodType, location } = req.query;
    let query = { isAvailable: true };

    if (bloodType) query.bloodType = bloodType;
    if (location) query.location = new RegExp(location, 'i');

    const donors = await BloodDonor.find(query)
      .populate('user', 'name email')
      .select('-healthConditions -donationHistory')
      .sort({ lastDonation: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get blood donation eligibility info
// @route   GET /api/blood/compatibility
exports.getCompatibilityInfo = async (req, res) => {
  try {
    const compatibilityInfo = {
      'A+': {
        canDonateTo: ['A+', 'AB+'],
        canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
      },
      'A-': {
        canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
        canReceiveFrom: ['A-', 'O-']
      },
      'B+': {
        canDonateTo: ['B+', 'AB+'],
        canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
      },
      'B-': {
        canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
        canReceiveFrom: ['B-', 'O-']
      },
      'AB+': {
        canDonateTo: ['AB+'],
        canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      },
      'AB-': {
        canDonateTo: ['AB+', 'AB-'],
        canReceiveFrom: ['A-', 'B-', 'AB-', 'O-']
      },
      'O+': {
        canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
        canReceiveFrom: ['O+', 'O-']
      },
      'O-': {
        canDonateTo: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
        canReceiveFrom: ['O-']
      }
    };

    res.status(200).json({
      success: true,
      data: compatibilityInfo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get blood donation process info
// @route   GET /api/blood/process
exports.getDonationProcess = async (req, res) => {
  try {
    const donationProcess = {
      steps: [
        {
          title: "Registration",
          description: "Provide basic information and show a valid ID."
        },
        {
          title: "Health Screening",
          description: "Answer health history questions and receive a quick physical check."
        },
        {
          title: "Donation",
          description: "The actual blood collection typically takes 8-10 minutes."
        },
        {
          title: "Post-Donation",
          description: "Enjoy refreshments and rest for 10-15 minutes."
        }
      ],
      duration: "45-60 minutes",
      frequency: "Every 56 days for whole blood donations"
    };

    res.status(200).json({
      success: true,
      data: donationProcess
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};