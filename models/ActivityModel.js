const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for activity'],
    unique: true,
    trim: true,
    maxLength: [50, 'Title can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [false],
    maxLength: [500, 'Description can not be more than 500 characters']
  },
  duration: {
    type: String,
    required: [true, 'Please add duration in a weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add total cost'],
  },
  minimalAge: {
    type: String,
    required: [true, 'Please add a minimal age'],
    enum: ['2-3 years', '3-6 years', '6-9 years', '9-12 years']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  camp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Camp',
    required: true
  }
});

ActivitySchema.statics.getAverageCost = async function (campId) {
  const result = await this.agregate([
    {
      $match: { camp: campId }
    },
    {
      $group: {
        _$id: '$camp',
        averageCost: { $avg: 'tuition' }
      }
    }
  ])

  try {
    await this.model('Camp').findByIdAndUpdate(campId, {
      averageCost: Math.ceil(
        result[0].averageCost / 10
      ) * 10
    })
  } catch (error) {
    console.error(error)
  }
}

ActivitySchema.post('save', async function (next) {
  this.constructor.getAverageCost(this.camp)
})

ActivitySchema.pre('remove', async function (next) {
  this.constructor.getAverageCost(this.camp)
})

module.exports = mongoose.model('Activity', ActivitySchema)