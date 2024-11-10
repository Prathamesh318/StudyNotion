import React from 'react'
import { Link } from 'react-router-dom'

import logo from "../../assets/Logo/Logo-Full-Light.png"

import { NavbarLinks } from '../../data/navbar-links'
export const  Navbar = () => {
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex w-11/12 max-w-maxContent justify-between items-center'>
      {/* Image */}
      <Link to="/">
        <img src={logo} width={160} height={32} loading='lazy' alt=''/>
      </Link>

      {/* Nav links */}
      <nav>
        <ul className='flex gap-x-6 text-richblack-25'>
            {
              NavbarLinks.map((item,i)=>{
               return <li key={i}>

                  {
                    item.title==='Catalog' ? (<div>


                    </div>):(  <Link to={item?.path}>
                      <p className='text-yellow-25'>
                        {
                          item?.title

                        }

                      </p> 
                      </Link>)
                  }
                
                </li>
              })
            }
        </ul>
      </nav>
      </div>
    </div>
  )
}
