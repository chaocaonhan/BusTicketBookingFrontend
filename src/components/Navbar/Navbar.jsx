

import React, { useEffect, useState } from 'react'
import { FaBars, FaX } from 'react-icons/fa6';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


export const Navbar = () => {

    const[scrollPosition, setScrollPosition] = useState(0);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Nav items
    const navItems = [
        { label: "TRANG CHỦ", link: "/" },
        { label: "LỊCH TRÌNH", link: "/lich-trinh" },
        { label: "TRA CỨU VÉ", link: "/" },
        { label: "TIN TỨC", link: "/" },
    ]

    // Toggle mobile menu
    const toggleMenu = () => {
        setOpen(!open);
    }
    

    return (
        <nav className=" bg-[url('./assets/nav-bg.png')] block fixed w-full top-0 left-0 lg:px-24 md:px-16 sm:px-7 px-4 py-4 
                             backdrop-blur-lg transition-transform duration-300 z-50">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo section */}
                <Link to="/" className='text-4xl text-white font-bold'>
                    FutaBus
                </Link>

                {/* Hamburger menu for mobile */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu} 
                        className="text-2xl text-neutral-500 focus:outline-none"
                    >
                        {open ?
                           <FaX className='w-5 h-5'/> 
                           : 
                           <FaBars className='w-5 h-5'/>}
                    </button>
                </div>

                {/* Navlink and button - Responsive layout */}
                <div className={`
                    fixed md:static 
                    top-20 left-0 w-full md:w-auto 
                    bg-white md:bg-transparent 
                    md:flex items-center justify-end 
                    gap-16 
                    ${open ? 'block' : 'hidden'}
                `}>
                    {/* Nav links */}
                    <ul className="
                        list-none 
                        flex flex-col md:flex-row 
                        items-start md:items-center 
                        gap-4 md:gap-8 
                        text-lg text-neutral-50 
                        font-bold
                        p-4 md:p-0
                    ">
                        {navItems.map((item, ind) => (
                            <li key={ind} className="w-full md:w-auto">
                                <Link 
                                    to={item.link} 
                                    className='
                                        block md:inline 
                                        hover:text-red-500 
                                        ease-in-out duration-300
                                    '
                                    onClick={toggleMenu}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Button */}
                    <div className="flex items-center justify-center p-4 md:p-0">
                        <button 
                            className="
                                w-full md:w-fit 
                                px-6 md:px-4 
                                py-2.5 md:py-1 
                                bg-white
                                
                                border border-red-500 
                                md:rounded-full rounded-xl 
                                text-base font-normal 
                                text-orange-500
                                ease-in-out duration-300
                            "
                            onClick={() => navigate('/register')}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;