# 📚 Student Attendance Portal

The **Student Attendance Portal** is a web-based application designed to streamline the process of recording, managing, and analyzing student attendance. It provides role-based access for administrators, teachers, and students, making attendance tracking more efficient and transparent.

---

## 🚀 Features

* **User Authentication & Authorization**
  Secure login for Admin, Teacher, and Student roles.

* **Attendance Management**
  Teachers can mark daily attendance and update records.

* **Student Dashboard**
  Students can view their personal attendance history.

* **Admin Dashboard**

  * Manage users (add/edit/remove students and teachers).
  * View attendance reports across classes and subjects.

* **Reports & Analytics**

  * Generate attendance summaries.
  * Export data to Excel/PDF.
  * Visual charts for attendance trends.

* **Responsive UI**
  Optimized for desktop and mobile devices.

---

## 🛠️ Tech Stack

* **Frontend:** React.js / HTML / CSS / JavaScript (with Material UI or Bootstrap)
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** JWT / bcrypt
* **Other Tools:** Axios, Redux/Context API, Chart.js

---

## ⚙️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/student-attendance-portal.git
   cd student-attendance-portal
   ```

2. Install dependencies for both back-end and front-end:

  ```powershell
  cd back-end
  npm install

  cd ..\front-end
  npm install
  ```

3. Create a `.env` file in the `back-end` folder with the following keys (example values):

  ```text
  PORT=5000
  HOST_URL=127.0.0.1
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key
  SMTP_USER=your_smtp_user
  SMTP_PASS=your_smtp_password
  VITE_REACT_APP=http://localhost:5173
  ```

  Notes:
  - The server also accepts `MONGODB_URI` or even the misspelled `MONGIDB_URI` as fallbacks.
  - `VITE_REACT_APP` is used to allow the frontend origin; set it to the front-end dev URL.

4. Run the backend (from repository root):

  ```powershell
  cd back-end
  npm run dev
  ```

5. Run the front-end (in a separate terminal):

  ```powershell
  cd front-end
  npm run dev
  ```

6. Open the app in your browser at:

  ```
  http://localhost:5173
  ```

---

## 📌 Future Enhancements

* Biometric / QR code-based attendance.
* Email / SMS alerts for parents.
* AI-powered attendance insights.
* Integration with Learning Management Systems (LMS).

---

## 🤝 Contributing

1. Fork this repo.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push and create a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Group 06[Web Technology - Group Project]** ✨

1. Saranga 
2. Praveen
3. Heshan
4. Sanjaya
5. Malith
6. Sanduni
7. Dulneth
8. Nimesha
9. Ramla