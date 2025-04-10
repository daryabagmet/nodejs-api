const express = require('express')
const {
  getActivities, getActivity, addActivity, updateActivity, deleteActivity
} = require('../controllers/activities')

const router = express.Router({ mergeParams: true })

router.route('/').get(getActivities).post(addActivity)
router.route('/:id').get(getActivity).put(updateActivity).delete(deleteActivity)

module.exports = router
