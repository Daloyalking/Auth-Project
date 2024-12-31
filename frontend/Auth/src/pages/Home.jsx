import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='h-screen bg-[url("./src/assets/bg_img.png")] bg-cover bg-current'>
      <Navbar />
      <Header />
    </div>
  );
}

export default Home