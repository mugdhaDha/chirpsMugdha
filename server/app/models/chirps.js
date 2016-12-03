var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var ChirpsSchema = new Schema({
  chirp: { type: String, required: true },
  chirpAuthor: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: {type: Number, default: 0},
  reChirp: { type: Boolean, required: true, default: false},
  dateCreated: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Chirps', ChirpsSchema);
