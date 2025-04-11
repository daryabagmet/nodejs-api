const express = require('express')
const {
  getActivities, getActivity, addActivity, updateActivity, deleteActivity
} = require('../controllers/activities')


const Activity = require('../models/ActivityModel');
const completedResults = require('../middleware/completedResults')

const router = express.Router({ mergeParams: true })

router.route('/').get(completedResults(Activity, {
  path: 'camp',
  select: 'name description'
}), getActivities).post(addActivity)
router.route('/:id').get(getActivity).put(updateActivity).delete(deleteActivity)

module.exports = router
