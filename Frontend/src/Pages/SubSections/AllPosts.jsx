import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MapPin, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import Itinerary from '../Itinerary/Itinerary';
import useItineraryStore from '../Itinerary/ItineraryService';
import { UserContext } from "../../../context/userContext";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useContext(UserContext);
  const { addToItinerary } = useItineraryStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts/all");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch posts.");
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const seasons = [...new Set(posts.map(post => post.bestSeasonToVisit))];
  const filteredPosts = selectedSeason
    ? posts.filter(post => new RegExp(selectedSeason, "i").test(post.bestSeasonToVisit))
    : posts;

  const handleAddToItinerary = (post) => {
    if (user) {
      addToItinerary(user.id, {
        ...post,
        addedAt: new Date().toISOString()
      });
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const nextImage = () => {
    if (selectedPost && selectedPost.img) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedPost.img.length);
    }
  };

  const prevImage = () => {
    if (selectedPost && selectedPost.img) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedPost.img.length) % selectedPost.img.length);
    }
  };

  if (loading) {
    return <div className="text-center text-white text-2xl mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-indigo-800 min-h-screen text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Discover Amazing Locations</h1>

      <div className="mb-6 max-w-md mx-auto">
        <label className="block text-lg font-semibold mb-2">Select Best Season to Visit:</label>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="block text-black w-full p-2 rounded border border-gray-300"
        >
          <option value="">All Seasons</option>
          {seasons.map((season) => (
            <option key={season} value={season}>{season}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={post.img[0]} alt={post.placeName} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-bold text-lg">{post.placeName}</h2>
              <p className="text-gray-600">{post.description}</p>
              <div className="flex justify-between mt-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-1" />
                  <span>{post.location}</span>
                </div>
                <button
                  onClick={() => handleAddToItinerary(post)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Add to Itinerary
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                <Calendar className="inline mr-1" />
                {post.bestSeasonToVisit}
              </div>
              <button onClick={() => openModal(post)} className="mt-3 text-indigo-600 hover:underline">
                View More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-11/12 max-w-2xl relative">
            <button onClick={closeModal} className="absolute top-2 right-2 bg-gray-100 p-1 rounded-full">
              <X className="text-gray-600" />
            </button>
            <div className="relative">
              <img src={selectedPost.img[currentImageIndex]} alt={selectedPost.placeName} className="w-full h-64 object-cover" />
              <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full">
                <ChevronLeft className="text-gray-600" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full">
                <ChevronRight className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="font-bold text-2xl text-indigo-800">{selectedPost.placeName}</h2>
              <div className="text-gray-700 mt-2">{selectedPost.description}</div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Category:</h3>
                <p className="text-gray-600">{selectedPost.category}</p>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Location:</h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-1" />
                  <span>{selectedPost.location}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Google Maps:</h3>
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedPost.placeName)}&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 text-gray-600">
                <span className="font-bold">Best Season to Visit:</span> {selectedPost.bestSeasonToVisit}
              </div>
              <button
                onClick={() => handleAddToItinerary(selectedPost)}
                className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      )}
      {user && <Itinerary userId={user.id} />}
    </div>
  );
};

export default AllPosts;