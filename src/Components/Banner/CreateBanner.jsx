import React, { useState,useEffect } from "react";
import axios from "axios";
import ImageModal from "../Products/ImageModal";
import { Link } from "react-router-dom";

const CreateBanner = () => {
  const [fetchedImages, setFetchedImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    active: true,
    image: null
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageClick = (imageUrl) => {
    console.log(imageUrl); // Just for debugging, you can remove this line if not needed
    setFormData(prevState => ({
      ...prevState,
      image: imageUrl // Assuming you only want to select one image for the banner
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData)
      const response = await axios.post(
        "https://api.camrosteel.com/api/v1/Bannercreate",
        formData,
       
      );
      console.log(response.data);
      setMessage("Banner created successfully!");
    } catch (error) {
      console.error("Error creating banner:", error);
      setMessage("Error creating banner. Please try again.");
    }
  };
  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.camrosteel.com/api/v1/All-images');
      setFetchedImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="max-w-2xl p-5 min-h-[70ch] border-2 mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Banner</h1>
      <p>**For Create Banner First upload Images in Upload-Images Tab</p>
      <Link to="/upload" className="text-blue-400 underline">Upload-images</Link>
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
       
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.active}
            name="active"
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="mr-2 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label className="text-sm text-gray-700">Active</label>
        </div>
        <button type="button" onClick={() => setShowModal(true)} value={formData.image} name='images' className="block w-full border-[1px] p-2 mt-1 rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
            Select Images
          </button> 
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Banner
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      <ImageModal isOpen={showModal} onClose={() => setShowModal(false)} images={fetchedImages} handleImageClick={handleImageClick} /> 
      

    </div>
  );
};

export default CreateBanner;
