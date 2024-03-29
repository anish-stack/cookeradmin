import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageModal from './ImageModal';
import toast from 'react-hot-toast'
const CreateCategoryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    CatImg: "", // Assuming CatImg is a file
  });

  const [showModal, setShowModal] = useState(false);
  const [fetchedImages, setFetchedImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.camrosteel.com/api/v1/All-images');
      setFetchedImages(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };
  useEffect(()=>{
    fetchImages()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageClick = (imageUrl) => {
    console.log(imageUrl); // Just for debugging, you can remove this line if not needed
    setFormData((prevState) => ({
      ...prevState,
      CatImg: imageUrl,
    }));
    setShowModal(false); // Close modal after image selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to server or perform other actions as needed
      const res = await axios.post('https://api.camrosteel.com/api/v1/Make-categories',formData)
      console.log('Category created successfully!', formData);
      // Reset form after successful submission
      toast.success("Category created successfully!")
      console.log(res.data)
      setFormData({
        title: '',
        CatImg: '',
      });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-[300px] h-[300px] border-2 border-black mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          
          className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Select Image
        </button>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          Create Category
        </button>

        <ImageModal isOpen={showModal} onClose={() => setShowModal(false)} images={fetchedImages} handleImageClick={handleImageClick} />
      </form>
    </div>
  );
};

export default CreateCategoryForm;
