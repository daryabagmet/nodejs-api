const express = require('express')
const {
  getActivities
} = require('../controllers/activities')

const router = express.Router({ mergeParams: true })

router.route('/').get(getActivities)

module.exports = router
