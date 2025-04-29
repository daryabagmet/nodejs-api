const express = require('express')
const {
  getActivities, getActivity, addActivity, updateActivity, deleteActivity
} = require('../controllers/activities')


const Activity = require('../models/ActivityModel');
const completedResults = require('../middleware/completedResults')
const { protect } = require('../middleware/auth')

const router = express.Router({ mergeParams: true })

router.route('/').get(completedResults(Activity, {
  path: 'camp',
  select: 'name description'
}), getActivities).post(protect, addActivity)
router.route('/:id').get(getActivity).put(protect, updateActivity).delete(protect, deleteActivity)

module.exports = router
