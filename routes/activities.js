const express = require('express')
const {
  getActivities, getActivity, addActivity
} = require('../controllers/activities')

const router = express.Router({ mergeParams: true })

router.route('/').get(getActivities).post(addActivity)
router.route('/:id').get(getActivity)

module.exports = router
