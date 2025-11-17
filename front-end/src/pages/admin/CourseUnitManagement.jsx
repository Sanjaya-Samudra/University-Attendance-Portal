import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import "../../styles/course-unit-management.css";

const CourseUnitManagement = () => {
  const [formData, setFormData] = useState({
    id: '',
    courseCode: "",
    courseDesc: "",
    department: "",
    semester: "",
    status: "",
    professor: "",
    courseName: "",
    faculty: "Faculty of Computing",
    credits: "",
    year: "",
    prerequisites: "",
    schedule: "",
  });

  const [courses, setCourses] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [search, setSearch] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + 
        '/course/add', {
          code: formData.courseCode,
          name: formData.courseName,
          description: formData.courseDesc,
          semester: formData.semester,
          status: formData.status,
          assignedProf: formData.professor,
          credits: formData.credits,
          yearOffered: formData.year,
          prerequisites: formData.prerequisites,
          courseSchedule: formData.schedule,
          departments: formData.department,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({
          courseCode: "",
          courseDesc: "",
          department: "",
          semester: "",
          status: "",
          professor: "",
          courseName: "",
          faculty: "",
          credits: "",
          year: "",
          prerequisites: "",
          schedule: "",
        });
        setSelectedDepts([]);
        getAllCourse();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedDepts.includes(selected)) {

      setSelectedDepts([...selectedDepts, selected]);
      setFormData({...formData, department: [...selectedDepts, selected] })
    }

  };

  

  const getAllProfessor = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/professor/all')

      if(data.success) {
        setProfessors(data.message.professors)

      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const getAllCourse = async () => {
    try {
      
      const {data} = await axios.get(backendUrl + '/course/all')
      
      if(data.success) {
        console.log(data)
        setCourses(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSelectCourse = async (e, course) => {
    try {
      e.preventDefault()

      setFormData({
          id: course._id,
          courseCode: course.code,
          courseDesc: course.description,
          department: course.departments,
          semester: course.semester,
          status: course.status,
          professor: course.assignedProf,
          courseName: course.name,
          faculty: "Faculty of Computing",
          credits: course.credits,
          year: course.yearOffered,
          prerequisites: course.prerequisites,
          schedule: course.courseSchedule,
        });
        setIsSelected(true)
        setSelectedDepts(course.departments)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleClose = () => {
    setIsSelected(false)
    setFormData({
      courseCode: "",
      courseDesc: "",
      department: "",
      semester: "",
      status: "",
      professor: "",
      courseName: "",
      faculty: "",
      credits: "",
      year: "",
      prerequisites: "",
      schedule: "",
    })

  }

  const handleUpdate = async () => {
    try {
      axios.defaults.withCredentials = true

      

      const {data} = await axios.put(backendUrl + '/course/update', {
        _id: formData.id,
        code: formData.courseCode,
        name: formData.courseName,
        description: formData.courseDesc,
        semester: formData.semester,
        status: formData.status,
        assignedProf: formData.professor,
        credits: formData.credits,
        yearOffered: formData.year,
        prerequisites: formData.prerequisites,
        courseSchedule: formData.schedule,
        departments: formData.department
      })

      if (data.success) {
        toast.success(data.message)
        getAllCourse()

        setFormData({
          id: '',
          courseCode: "",
          courseDesc: "",
          department: "",
          semester: "",
          status: "",
          professor: "",
          courseName: "",
          faculty: "",
          credits: "",
          year: "",
          prerequisites: "",
          schedule: "",
        })

        setSelectedDepts([])

      }else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {

    getAllCourse()

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then( async (result) => {
    if (result.isConfirmed) {
      try {
        const {data} = await axios.delete(backendUrl + '/course/delete/' + formData.id, {courseCode: formData.code, _id: formData.id})

        await getAllCourse()

        if(data.success) {

            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          
        }else{

          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.message)
      }
      
    }
  });
  }

  useEffect(() => {
    getAllProfessor()
    getAllCourse()
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen course-unit-page">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Course Unit Management</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="course-unit-form mb-6"
      >
        <div>
          <label className="block mb-1 font-medium">Course Code</label>
          <input
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={formData.courseCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Course Name</label>
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Course Description</label>
          <input
            type="text"
            name="courseDesc"
            placeholder="Course Description"
            value={formData.courseDesc}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Semester</label>
          <select
            className=""
            defaultValue=""
            name="semester"
            onChange={handleChange}
            value={formData.semester}
          >
            <option value="" disabled>
              Choose a Semester
            </option>
            <option value={1}>1st Semester</option>
            <option value={2}>2nd Semester</option>
            <option value={3}>3rd Semester</option>
            <option value={4}>4th Semester</option>
            <option value={5}>5th Semester</option>
            <option value={6}>6th Semester</option>
            <option value={7}>7th Semester</option>
            <option value={8}>8th Semester</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Year Offered</label>
          <select className="" name="year" value={formData.year} onChange={handleChange} defaultValue="">
            <option value="" disabled>Choose Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            className=""
            defaultValue=""
            name="status"
            onChange={handleChange}
            value={formData.status}
          >
            <option value="" disabled>
              Choose a Status
            </option>
            <option value='active'>Active</option>
            <option value='Close'>Close</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Assigned Professor</label>
          {/* <input type="text"
            name="professor"
            placeholder="Assigned Professor"
            value={formData.professor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          /> */}
          <select
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue=""
            name="professor"
            onChange={handleChange}
            value={formData.professor}
          >
            <option value="" disabled>
              Choose a Professor
            </option>
            {professors.map((pro, i) => (
              <option key={i} value={pro._id}>
                {pro.fullName}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Faculty</label>
          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            value='Faculty of Computing'
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Credits</label>
          <input
            type="text"
            name="credits"
            placeholder="Credits"
            value={formData.credits}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        

        <div>
          <label className="block mb-1 font-medium">Prerequisites</label>
          <input
            type="text"
            name="prerequisites"
            placeholder="Prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Course Schedule */}
        <div>
          <label className="block mb-1 font-medium">Course Schedule (Starting date)</label>
          <input
            type="date"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Select Department */}
        <div>
          <label className="block mb-1 font-medium">Select Departments</label>
          <select
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={handleSelect}
            defaultValue=""
            value={formData.department}
          >
            <option value="" disabled>
                Choose a department
              </option>
            <option value="SE" >Software Engineering</option>
            <option value="CS" >Computer Science</option>
            <option value="IS" >Information System</option>
          </select>

          {/* Show selected departments inside a read-only textbox (no separate chips) */}
          {/* Selected departments display removed per request */}
        </div>
        

        <div className="col-span-2 flex gap-4 mt-2">
          {!isSelected && (
            <button type="submit" className="cuc-btn cuc-btn-primary">Add Course</button>
          )}

          {isSelected && (
            <>
              <button type="button" className="cuc-btn cuc-btn-primary" onClick={handleUpdate}>Update</button>
              <button type="button" className="cuc-btn cuc-btn-danger" onClick={handleDelete}>Delete</button>
              <button type="button" className="cuc-btn cuc-btn-ghost" onClick={handleClose}>Close</button>
            </>
          )}
        </div>
      </form>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Course Name or Code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input md:w-1/2"
        />
      </div>

      {/* Course Table */}
      <div className="course-list-card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Course List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left">Course Code</th>
                <th className="px-4 py-2 text-left">Course Name</th>
                <th className="px-4 py-2 text-left">status</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Semester</th>
                <th className="px-4 py-2 text-left">Professor</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course,i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 cursor-pointer" onClick={(e) => handleSelectCourse(e, course)}>
                    <td className="px-4 py-2">{course.code}</td>
                    <td className="px-4 py-2">{course.name}</td>
                    <td className="px-4 py-2">{course.status}</td>
                    <td className="px-4 py-2">{course.departments?.join(' | ')}</td>
                    <td className="px-4 py-2">{course.semester} Semester</td>
                    <td className="px-4 py-2">{course.professor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
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

export default CourseUnitManagement;