import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const CourseManagement = () => {

  const [formData, setFormData] = useState({
    _id: "",
    code: "",
    name: "",
    credits: "",
  });
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const {backendUrl} = useContext(AppContext)

  const getCourses = async () => {
    try {
      axios.defaults.withCredentials = true
      
      const {data} = await axios.get(backendUrl + '/course/get-prof')
      
      if(data.success) {
        setCourses(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.put(backendUrl + '/course/update-prof', {
        code : formData.code,
        _id: formData._id,
        name: formData.name,
        credits: formData.credits
      })

      if(data.success) {
        toast.success(data.message)

        setEditIndex(null);
        setFormData({ code: "", name: "", credits: "" });
        getCourses()
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

    // if (editIndex !== null) {
    //   const updatedCourses = [...courses];
    //   updatedCourses[editIndex] = formData;
    //   setCourses(updatedCourses);
    //   setEditIndex(null);
    // } else {
    //   setCourses([...courses, formData]);
    // }

    // setFormData({ code: "", name: "", credits: "" });
  };

  const handleEdit = (index) => {
    setFormData(courses[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const updatedCourses = courses.filter((_, i) => i !== index);
      setCourses(updatedCourses);
    }
  };

  useEffect(() => {
    getCourses()
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Course Unit Management</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-md rounded mb-6"
      >
        <div>
          <label className="block mb-1 font-medium">Course Code</label>
          <input
            type="text"
            name="code"
            placeholder="e.g., CS101"
            value={formData.code}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Course Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Introduction to Computing"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Credits</label>
          <input
            type="number"
            name="credits"
            placeholder="e.g., 3"
            value={formData.credits}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Save Course
          </button>
        </div>
      </form>

      {/* Course Table */}
      <div className="bg-white shadow-md rounded">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-purple-700">Course Unit List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Credits</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{course.code}</td>
                    <td className="px-4 py-2">{course.name}</td>
                    <td className="px-4 py-2">{course.credits}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;