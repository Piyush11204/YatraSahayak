import React, { useState } from "react";
import { Camera, MapPin, Globe, Send, X, Edit3 } from "lucide-react";

const UserProfile = ({ initialUsername = "TravelLover123" }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    location: "",
    destination: "",
    images: [],
    categories: [],
    caption: "",
    bestSeason: "",
  });
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [username, setUsername] = useState(initialUsername);
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    "Beach",
    "Waterfall",
    "Cultural",
    "Historical",
    "Peaks",
    "Mountains",
  ];
  const seasons = ["Spring", "Summer", "Autumn", "Winter", "Rainy"];

  const handlePost = () => {
    if (newPost.location && newPost.destination && newPost.images.length > 0) {
      setPosts([{ ...newPost, timestamp: new Date().toISOString() }, ...posts]);
      setNewPost({
        location: "",
        destination: "",
        images: [],
        categories: [],
        caption: "",
        bestSeason: "",
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setNewPost((prevPost) => ({
      ...prevPost,
      images: [...prevPost.images, ...imageUrls],
      categories: [...prevPost.categories, ...new Array(files.length).fill("")],
    }));
  };

  const removeImage = (index) => {
    setNewPost((prevPost) => ({
      ...prevPost,
      images: prevPost.images.filter((_, i) => i !== index),
      categories: prevPost.categories.filter((_, i) => i !== index),
    }));
  };

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

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-indigo-800 min-h-screen text-white">
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={profileImage}
                alt={username}
                className="w-24 h-24 rounded-full border-2 border-white cursor-pointer transition-transform duration-300 transform group-hover:scale-110"
              />
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
                onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Destination"
              value={newPost.destination}
              onChange={(e) =>
                setNewPost({ ...newPost, destination: e.target.value })
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
              {newPost.images.map((img, index) => (
                <div key={index} className="relative flex flex-col items-start">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <select
                    value={newPost.categories[index]}
                    onChange={(e) => {
                      const updatedCategories = [...newPost.categories];
                      updatedCategories[index] = e.target.value;
                      setNewPost({ ...newPost, categories: updatedCategories });
                    }}
                    className="border rounded-md mt-1 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Caption for all images"
              value={newPost.caption}
              onChange={(e) =>
                setNewPost({ ...newPost, caption: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={newPost.bestSeason}
              onChange={(e) =>
                setNewPost({ ...newPost, bestSeason: e.target.value })
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
              <Send className="w-4 h-4 mr-2" /> Post
            </button>
          </div>
        </div>

        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 mb-6 text-gray-800"
          >
            <div className="flex items-center mb-4">
              <img
                src={profileImage}
                alt={username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-bold">{username}</h4>
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {post.location} •
                  <Globe className="w-4 h-4 mx-1" /> {post.bestSeason}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{post.destination}</h3>
            <p className="mt-2">{post.caption}</p>
            <div className="flex gap-2 mt-4">
              {post.images.map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt={`Post ${imgIndex + 1}`}
                  className="w-1/3 h-32 object-cover rounded-md"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
