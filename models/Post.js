const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  body: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  comments: [
    {
      body: {
        type: String,
        required: true,
        trim: true,
      },
      username: {
        type: String,
        required: true,
        trim: true,
      },
      created: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  likes: [
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      created: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Post", PostSchema);
