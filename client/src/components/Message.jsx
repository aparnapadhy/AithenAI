import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

 useEffect(()=>{
    Prism.highlightAll();
 },[message.content])

  return (
    <div>
      {message.role === 'user' ? (
             <div className='flex items-start justify-end'>
               <div className='flex flex-col gap-2 p-2 px-4 bg-[#D1FAE5]/50 dark:bg-[#065F46]/50 border border-[#10B981]/50 dark:border-[#065F46] rounded-md max-w-2xl'>
                 <p className='text-sm dark:text-white'>{message.content}</p>
                 <span className='text-xs text-gray-400 dark:text-[B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
               </div>
               <img src={assets.user_icon} alt="" className='w-8 rounded-full'/>
             </div>
      ) : ( 
            <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-[#D1FAE5]/50 dark:bg-[#065F46]/50 border border-[#10B981]/50 dark:border-[#065F46] rounded-md my-4'>
                {message.isImage ? (
                  <img src={message.content} alt='' className='w-full max-w-md mt-2 rounded-md'/>
                ) : (
                  <div className='text-sm dark:text-white reset-tw'><Markdown>{message.content}</Markdown></div>
                )}
                <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
            </div>
      )}
    </div>
  )
}

export default Message
