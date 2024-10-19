import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
        },
        catagory: {
            type: String,
            required: true,
		},
		img: {
			type: [String],
			required: true,
		},
		placeName: {
			type: String, required: true
		},   // New field
		location: {
			type: String, required: true
		},    // New field
		bestSeasonToVisit: {
			type: String, required: true
		},  // New field
		
 // Adds createdAt and updatedAt fields
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
