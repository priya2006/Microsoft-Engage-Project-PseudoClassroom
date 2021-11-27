import React,{useState,useEffect} from 'react'
import './App.css';
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Student from './Components/Student';
import Teacher from './Components/Teacher';
import ForgotPassword from './Components/ForgotPassword';
import Home from './Components/Home';
import {BrowserRouter as Router, Routes ,Route} from 'react-router-dom';
import StudentDashboard from './Components/StudentDashboard';
import TeacherDashboard from './Components/TeacherDashboard';

function App() {
  return (
    <Router className="App">
      <Header />
        <Routes >
        <Route path="/" exact element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/resetPassword" element={<ForgotPassword />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
