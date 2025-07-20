const BedApplication = require("../models/bedapplications");

// Submit new application
exports.submitApplication = async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log("Incoming data:", req.body);

    const application = new BedApplication({
      ...req.body,
      user: req.body.user || null,
    });

    await application.save();

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    console.error("Save error:", err);

    // Improved error response
    if (err.name === "ValidationError") {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
//zainab test
exports.getApplications = async (req, res) => {
  try {
    const applications = await BedApplication.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get all bed applications
// exports.getApplications = async (req, res) => {
//   try {
//     const applications = await BedApplication.find(); // optional: populate user data if ref exists

//     res.status(200).json({
//       success: true,
//       count: applications.length,
//       data: applications,
//     });
//   } catch (err) {
//     console.error("Fetch error:", err);
//     res.status(500).json({
//       success: false,
//       error: "Server error",
//     });
//   }
// };

// Admin-only functions (disabled since no auth)
// exports.getApplications = async (req, res) => {
//   const test =BedApplication.find();
//   res.json(test)
//   res.status(501).json({
//     success: false,
//     message: 'Admin features disabled - no authentication system exists'
//   });
// };

exports.getMyApplications = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Login required - no authentication system exists",
  });
};

exports.updateStatus = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Admin features disabled - no authentication system exists",
  });
};
