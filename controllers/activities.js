const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Activity = require('../models/ActivityModel')
const Camp = require('../models/CampModel')

//@desc       Get all activities
//@route      GET /api/v1/activities
//@access     Public
exports.getActivities = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.campId) {
    query = Activity.find({ camp: req.params.campId })
  } else {
    query = Activity.find().populate({
      path: 'camp',
      select: 'name description'
    });
  }

  const activities = await query;

  res
    .status(200)
    .json({ success: true, total: activities.length, data: activities })
})


//@desc       Get an activity
//@route      GET /api/v1/activities/:id
//@access     Public
exports.getActivity = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id).populate({
    path: 'camp',
    select: 'name description'
  });

  if (!activity) {
    return next(new ErrorResponse('Activity not found'), 404)
  }

  res
    .status(200)
    .json({ success: true, data: activity })
})

//@desc       Add new activity
//@route      POST /api/v1/camps/:campsId/activities
//@access     Private
exports.addActivity = asyncHandler(async (req, res, next) => {
  req.body.camp = req.params.campId;

  const camp = await Camp.findById(req.params.id)

  if (!camp) {
    return next(new ErrorResponse('Camp not found'), 404)
  }

  const activity = await Activity.create(req.body);

  res
    .status(200)
    .json({ success: true, data: activity })
})

//@desc       Update an activity
//@route      PUT /api/v1/activities/:id
//@access     Private
exports.updateActivity = asyncHandler(async (req, res, next) => {
  let activity = await Activity.findById(req.params.id)

  if (!activity) {
    return next(new ErrorResponse('Activity not found'), 404)
  }

  activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res
    .status(200)
    .json({ success: true, data: activity })
})

//@desc       Delete an activity
//@route      Delete /api/v1/activities/:id
//@access     Private
exports.deleteActivity = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id)

  if (!activity) {
    return next(new ErrorResponse('Activity not found'), 404)
  }

  await activity.remove()

  res
    .status(200)
    .json({ success: true, data: {} })
})
