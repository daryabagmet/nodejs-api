const express = require('express')
const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
  getCampsInRadius,
  uploadCampImage
} = require('../controllers/camps')

const Camp = require('../models/CampModel');
const completedResults = require('../middleware/completedResults')

const activitiesRouter = require('./activities')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.use('/:campId/activities', activitiesRouter)

router.route('/radius/:zipcode/:distance').get(getCampsInRadius)

router.route('/').get(completedResults(Camp, 'activitiesList'), getCamps).post(protect, createCamp)

router.route('/:id').get(getCamp).put(protect, authorize('admin', 'moderator'), updateCamp).delete(protect, authorize('admin', 'moderator'), deleteCamp)

router.route('/:id/photo').put(protect, authorize('admin', 'moderator'), uploadCampImage)

module.exports = router
