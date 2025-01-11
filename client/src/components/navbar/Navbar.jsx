import React from 'react'
import Logo from './Logo'
import Searchbar from './Searchbar'
import DropdownList from './DropdownList'

const Navbar = () => {
  return (
    <nav>
        <div className='flex flex-col items-center 
        py-4  justify-between sm:flex-row gap-4'>

    <Logo />
    <Searchbar />
    <DropdownList />
        </div>
    </nav>
  )
}

export default Navbar