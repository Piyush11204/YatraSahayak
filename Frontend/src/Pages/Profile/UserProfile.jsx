import React, { useState, useContext } from "react";
import { Camera, MapPin, Globe, Send, X, Edit3 } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../../context/userContext";

const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    location: "",
    placeName: "",
    text: "",
    img: [],
    category: "",
    bestSeasonToVisit: "",
  });
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(UserContext);
  const categories = [
    "Beach",
    "Waterfall",
    "Cultural",
    "Historical",
    "Peaks",
    "Mountains",
    "Adventure",
  ];
  const seasons = ["Spring", "Summer", "Autumn", "Winter", "Rainy"];

  const handlePost = async () => {
    console.log("Submitting post:", newPost);
    try {
      const response = await axios.post("http://localhost:8000/posts/create", {
        ...newPost,
        username: user.username, // Include the username from context
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Post created successfully:", response.data);
      setPosts([{ ...newPost, timestamp: new Date().toISOString() }, ...posts]);
      setNewPost({
        location: "",
        placeName: "",
        text: "",
        img: [],
        category: "",
        bestSeasonToVisit: "",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("There was an error creating the post. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setNewPost((prevPost) => ({
      ...prevPost,
      img: [...prevPost.img, ...imageUrls],
    }));
  };

  // const removeImage = (index) => {
  //   setNewPost((prevPost) => ({
  //     ...prevPost,
  //     img: prevPost.img.filter((_, i) => i !== index),
  //   }));
  // };

  const changeProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = () => {
    setIsEditing(false);
  };

  // Extract username and profile image from user context
  const username = user ? user.username : "Guest"; // Fallback to "Guest" if user is not logged in
  // const userProfileImage = user ? user.profileImage : "/api/placeholder/150/150"; // Adjust to your API response structure

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-indigo-800 min-h-screen text-white">
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <Camera className="text-white w-6 h-6" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={changeProfileImage}
                  />
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // This doesn't change the username in UserContext
                className="bg-transparent border-b-2 border-white text-white text-xl font-bold focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-bold">{username}</h2>
            )}
          </div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-indigo-700 transition duration-300"
            onClick={isEditing ? handleUpdateProfile : handleEditProfile}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Update Profile" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-center text-indigo-600">
            Create New Post
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Location"
              value={newPost.location}
              onChange={(e) =>
                setNewPost({ ...newPost, location: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Place Name"
              value={newPost.placeName}
              onChange={(e) =>
                setNewPost({ ...newPost, placeName: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Text about the destination"
              value={newPost.text}
              onChange={(e) =>
                setNewPost({ ...newPost, text: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <label className="block">
              <span className="sr-only">Choose photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
              "
              />
            </label>
            <div className="flex flex-col gap-2">
              {newPost.img.map((img, index) => (
                <div key={index} className="relative flex flex-col items-start">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <select
              value={newPost.category}
              onChange={(e) =>
                setNewPost({ ...newPost, category: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={newPost.bestSeasonToVisit}
              onChange={(e) =>
                setNewPost({ ...newPost, bestSeasonToVisit: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Best Season to Visit</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
            <button
              onClick={handlePost}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-md hover:from-indigo-600 hover:to-purple-600 transition duration-300 flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
