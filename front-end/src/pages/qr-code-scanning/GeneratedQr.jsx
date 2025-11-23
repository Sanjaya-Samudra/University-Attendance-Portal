import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const GeneratedQr = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionData, sessionId } = location.state || {};
  const {backendUrl} = useContext(AppContext)

  if (!sessionData) {
    navigate("/create-qr-session");
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCloseSession = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.post(backendUrl + '/professor/close-session', {sessionId})

      if (data.success) {
        toast.success(data.message)
        navigate('/professor')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Generated QR Code</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 shadow-md rounded text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Scan QR Code to Mark Attendance
          </h2>

          {/* QR Code Container */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-purple-200 rounded-lg inline-block">
              {/* Placeholder QR Code - In real app, use qrcode library */}
              <div className="w-64 h-64 bg-purple-100 border-4 border-purple-300 rounded flex items-center justify-center">
                <div className="text-center">
                  <QRCode value={ `http://localhost:5173/qr-loading/${sessionId}`} size={180} />
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Details</h3>
            <div className="space-y-3 text-left">
              {/* <div className="flex justify-between">
                <span className="font-medium text-gray-600">Course ID:</span>
                <span className="text-gray-800">{formatCourseName(sessionData.courseId)}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Lecture Title:</span>
                <span className="text-gray-800">{sessionData.lectureTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">{formatDate(sessionData.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Valid Time:</span>
                <span className="text-gray-800">{sessionData.qrValidTime == 0 ? 'Expire' : `${sessionData.qrValidTime} minutes`}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => navigate("/create-qr-session")}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition cursor-pointer"
            >
              Create New Session
            </button>
            <button
              onClick={() => handleCloseSession()}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Close Session
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 p-6 rounded mt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Instructions for Students</h3>
          <ul className="text-green-700 space-y-1">
            <li>• Open the student attendance app on your device</li>
            <li>• Scan this QR code when prompted</li>
            <li>• Ensure you scan within the valid time limit</li>
            <li>• Your attendance will be marked automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeneratedQr;