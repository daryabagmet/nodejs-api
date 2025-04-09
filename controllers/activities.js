const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Activity = require('../models/ActivityModel')

//@desc       Get all activity
//@route      GET /api/v1/activities
//@access     Public
exports.getActivities = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.campId) {
    query = Activity.find({ camp: req.params.campId })
  } else {
    quesry = Activity.find();
  }

  const activities = await query;

  res
    .status(200)
    .json({ success: true, total: activities.length, data: activities })
})
