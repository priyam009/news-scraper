var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },

  noteText: String
});

// Create the Note model using the noteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;