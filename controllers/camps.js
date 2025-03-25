const Camp = require('../models/CampModel');

//@desc       Get all camps
//@route      GET /api/v1/camps
//@access     Public
exports.getCamps = async (req, res, next) => {
  try {
    const campsList = await Camp.find();
    res.status(200).json({ success: true, total: campsList.length, data: campsList })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }

}

//@desc       Get camp by id
//@route      GET /api/v1/camps/:id
//@access     Public
exports.getCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findById(req.params.id);

    if (!camp) {
      return res.status(400).json({ success: false, msg: 'Camp not found' })
    }

    res.status(200).json({ success: true, data: camp })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

//@desc       Create a new camp
//@route      POST /api/v1/camps
//@access     Private
exports.createCamp = async (req, res, next) => {
  try {
    const camp = await Camp.create(req.body)
    res.status(201).json({ success: true, data: camp })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

//@desc       Update camp
//@route      PUT /api/v1/camps/:id
//@access     Private
exports.updateCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!camp) {
      return res.status(400).json({ success: false, msg: 'Camp not found' })
    }

    res.status(200).json({ success: true, data: camp })

  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

//@desc       Delete camp
//@route      DELETE /api/v1/camps/:id
//@access     Private
exports.deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}