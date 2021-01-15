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
    default: new Date().toISOString(),
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
        default: new Date().toISOString(),
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
        default: new Date().toISOString(),
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
