import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext';

const Loading = () => {

  const navigate = useNavigate();
  
  const {fetchUser} = useAppContext();

  useEffect(()=>{
   const timeout = setTimeout(()=>{
    fetchUser();
    navigate('/'); 
   },8000)
   return(()=>clearTimeout(timeout))
  },[])

  return (
    <div className='bg-[#089F75] backdrop:opacity-50 flex items-center justify-center h-screen w-screen text-white text-2xl'>
       <div className='w-10 h-10 rounded-full border-3 border-gray-300 border-t-transparent animate-spin'></div>
    </div>
  )
}

export default Loading
