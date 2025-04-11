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
const router = express.Router()

router.use('/:campId/activities', activitiesRouter)

router.route('/radius/:zipcode/:distance').get(getCampsInRadius)

router.route('/').get(completedResults(Camp, 'activitiesList'), getCamps).post(createCamp)

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp)

router.route('/:id/photo').put(uploadCampImage)

module.exports = router
