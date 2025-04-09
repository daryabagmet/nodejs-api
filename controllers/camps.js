const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Camp = require('../models/CampModel')

//@desc       Get all camps
//@route      GET /api/v1/camps
//@access     Public
exports.getCamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort'];

  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Camp.find(JSON.parse(queryStr)).populate('activitiesList');

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Camp.countDocuments();

  query = query.skip(startIndex).limit(limit)

  const pagination = {};

  const campsList = await query;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ success: true, total: campsList.length, pagination, data: campsList })
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
  const camp = await Camp.findById(req.params.id)

  if (!camp) {
    return next(new ErrorResponse(`Camp id: ${req.params.id} not found`, 404))
  }

  camp.remove();

  res.status(200).json({ success: true, data: {} })
})

//@desc       Get bootcamps within a radius
//@route      GET /api/v1/camps/radius/:zipcode/:distance
//@access     Private
exports.getCampsInRadius = asyncHandler(async (req, res, next) => {
  const EARTH_RADIUS = 6378 //in km
  const { zipcode, distance } = req.params
  const location = await geocoder.geocode(zipcode)
  const lat = location[0].latitude
  const lng = location[0].longitude
  const radius = distance / EARTH_RADIUS
  const camps = await Camp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({ success: true, total: camps.length, data: camps })
})
