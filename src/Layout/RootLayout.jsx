import React,{useEffect,} from 'react'

const RootLayout = ({children, className}) => {

    //auto chuyển lên đầu trang khi chuyển trang
    useEffect (() =>{
        window.scrollTo(0,0);
    });

  return (
    <div className={'w-full  lg:px-24 md:px-16 sm:px-7 px-4 py-4 ${className}'}>
        <Navbar></Navbar>
        {children}
    </div>
  )
}

export default RootLayout