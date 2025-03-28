const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Camp = require('../models/CampModel')

//@desc       Get all camps
//@route      GET /api/v1/camps
//@access     Public
exports.getCamps = asyncHandler(async (req, res, next) => {
  const campsList = await Camp.find()
  res
    .status(200)
    .json({ success: true, total: campsList.length, data: campsList })
})

//@desc       Get camp by id
//@route      GET /api/v1/camps/:id
//@access     Public
exports.getCamp = asyncHandler(async (req, res, next) => {
  const camp = await Camp.findById(req.params.id)

  if (!camp) {
    return next(new ErrorResponse(`Camp id: ${req.params.id} not found`, 404))
  }

  res.status(200).json({ success: true, data: camp })
})

//@desc       Create a new camp
//@route      POST /api/v1/camps
//@access     Private
exports.createCamp = asyncHandler(async (req, res, next) => {
  const camp = await Camp.create(req.body)
  res.status(201).json({ success: true, data: camp })
})

//@desc       Update camp
//@route      PUT /api/v1/camps/:id
//@access     Private
exports.updateCamp = asyncHandler(async (req, res, next) => {
  const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!camp) {
    return next(new ErrorResponse(`Camp id: ${req.params.id} not found`, 404))
  }

  res.status(200).json({ success: true, data: camp })
})

//@desc       Delete camp
//@route      DELETE /api/v1/camps/:id
//@access     Private
exports.deleteCamp = asyncHandler(async (req, res, next) => {
  const camp = await Camp.findByIdAndDelete(req.params.id)

  if (!camp) {
    return next(new ErrorResponse(`Camp id: ${req.params.id} not found`, 404))
  }

  res.status(200).json({ success: true, data: {} })
})

//@desc       Get bootcamps within a radius
//@route      GET /api/v1/camps/radius/:zipcode/:distance
//@access     Private
exports.getCampsInRadius = asyncHandler(async (req, res, next) => {
  const EARTH_RADIUS = 6378 //in km
  const { zipcode, distance } = req.params
  const location = await geocoder.geocoder(zipcode)
  const lat = location[0].latitude
  const lng = location[0].longitude
  const radius = distance / EARTH_RADIUS
  const camps = await Camp.find({
    locstion: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({ success: true, total: camps.length, data: camps })
})
