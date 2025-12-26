import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment'
import toast from 'react-hot-toast';

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate,createNewChat, axios, setChats, fetchUserChats, token,setToken } = useAppContext();

  const [search, setSearch] = useState('');

  const logout = ()=>{
    localStorage.removeItem('token');
    setToken(null);
    toast('Logged out successfully!');
  }

  const deleteChat = async(e, chatId)=>{
    try {
      e.stopPropagation();
      const confirm = window.confirm('Are you sure you want to delete this chat?');

      if(!confirm) {
        return;
      }

      const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization : token}})

      if(data.success) {
        setChats(prev =>prev.filter(chat => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }

    } catch (error) {
       toast.error(error.message); 
    }
  }

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r dark:border-white/15 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* Logo */}
      <div className='flex'>
      <img src={theme == 'dark' ? assets.logo_dark : assets.logo} alt="" className=' max-w-16' />
      <div className='ml-2 flex flex-col translate-y-3 -translate-x-0.5 -space-y-1'>
         <div className='text-[#0E9F75] dark:text-[#10B981] text-2xl'>AithenAI</div>
         <div className='text-gray-500 dark:text-gray-300 text-sm'>Your Ideas, Amplified</div>
      </div>
      </div>
        
    
      

      {/* New chat button*/}
      <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-4 text-white bg-gradient-to-r from-[#34D399] to-[#10B981] text-sm rounded-md cursor-pointer'>
        <span className='mr-2 text-xl'>+</span>New Chat
      </button>

      {/* Search conversations */}
      <div className='flex items-center gap-2 p-3 mt-1 border border-gray-400 dark:border-white/15 rounded-md'>
        <img src={assets.search_icon} alt="" className='w-4 not-dark:invert' />
        <input onChange={(e) => { setSearch(e.target.value) }} value={search} type="text" placeholder='Search conversations' className='text-xs placeholder:text-gray-400 outline-none' />
      </div>

      {/* Recent chats */}
      {chats.length > 0 && <p className='m-2 text-sm'>Recent Chats</p>}
      <div className='flex-1 overflow-y-scroll mt-1 text-sm space-y-1'>
        {
          chats.filter((chat) => {
            const content = chat.messages?.[0]?.content || chat.name || '';
            return content.toLowerCase().includes(search.toLowerCase());
          }).map((chat) => (
            <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }} key={chat._id} className='p-2 px-4 dark:bg-[#065F46]/20 border border-gray-400 dark:border-[#065F46]/15 rounded-md cursor-pointer flex justify-between group'>
              <div>
                <p className='truncate w-full'>
                  {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name || "Untitled Chat"}
                </p>
                <p className='text-xs text-gray-500 '>{moment(chat.updatedAt).fromNow()}</p>
              </div>
              <img onClick={e => toast.promise(deleteChat(e, chat._id), {loading : 'deleting..'})} src={assets.bin_icon} alt="" className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' />
            </div>
          ))
        }
      </div>

      {/* Community images */}
      <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.gallery_icon} alt="" className='w-4.5 not-dark:invert' />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/* Credits purchase option */}
      <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-1 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.diamond_icon} alt="" className='w-4.5 dark:invert' />
        <div className='flex flex-col text-sm'>
          <p>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase credits to use AithenAI</p>
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className='flex justify-between items-center gap-2 p-3 mt-1 border border-gray-400 dark:border-white/15 rounded-md '>
        <div className='flex items-center text-sm gap-2'>
          <img src={assets.theme_icon} alt="" className='w-4 not-dark:invert' />
          <p>Dark Mode</p>
        </div>
        <label className='relative inline-flex cursor-pointer'>
          <input onChange={() => { setTheme(theme === 'dark' ? 'light' : 'dark') }} type="checkbox" className='sr-only peer' checked={theme === 'dark'} />
          <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-[#10B981] transition-all'></div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

      {/*User account*/}
      <div className='flex items-center gap-3 p-3 mt-1 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer'>
        <img src={assets.user_icon} alt="" className='w-7 rounded-full' />
        <p className='flex-1 text-sm  dark:text-white truncate'>{user ? user.name : "Login to your account"}</p>
        {user && <img onClick={logout} src={assets.logout_icon} className='h-5 cursor-pointer not-dark:invert' />}
      </div>

      <img onClick={() => { setIsMenuOpen(false) }} src={assets.close_icon} alt="" className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' />

    </div>
  )
}

export default Sidebar
