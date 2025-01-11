import Home from '@/pages/Home';
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
const Approutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
  )
}

export default Approutes