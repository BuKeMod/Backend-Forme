import Layout from '@/layouts/Layout';
import Home from '@/pages/Home';
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
const Approutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Approutes