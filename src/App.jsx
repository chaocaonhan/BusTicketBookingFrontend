import { useState } from 'react'
import reactLogo from './assets/react.svg'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import Home from './pages/Home';
import TuyenXePage from './pages/TuyenXePage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <>
    <Router>
    <main className='w-full flex flex-col bg-neutral-50 min-h-screen'>
      {/* Navbar */}
        {/* <Navbar></Navbar> */}

      {/* Routing */}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/lich-trinh" element={<TuyenXePage/>} />
        <Route path="/register" element={<RegisterPage />} /> 
      </Routes>

      </main>
    </Router>
      
    </>
  )
}

export default App