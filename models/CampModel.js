const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const CampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxLength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [false],
    maxLength: [500, 'Description can not be more than 500 characters']
  },
  website: {
    type: String,
    match: [
      /https ?: \/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please add a valid URL'
    ]
  },
  phone: {
    type: String,
    maxLength: [20, 'Phone number ca not be more than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid e-mail'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  activities: {
    type: String,
    required: true,
    enum: ['Math', 'Language camp', 'Dancing', 'Art', 'Sport', 'Singing']
  },
  avarageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating can not be more than 5']
  },
  cost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

//Geocode and location
CampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);

  if (!loc || !loc.length) {
    return next(new Error('Invalid address'));
  }

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  this.address = undefined;

  next();
})

//Activities in camp
CampSchema.virtual('activitiesList', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'camp',
  justOne: false
})

//Delete activities when camp is deleted
CampSchema.pre('remove', async function (next) {
  await this.model('Activity').deleteMany({
    camp: this._id
  });

  next();
})

module.exports = mongoose.model('Camp', CampSchema)
