import React from 'react'
import { usePathname } from 'next/navigation'
// import { Link, NavLink } from 'next-link';
import Link from 'next/link'
import Logo from '../shared/Logo';
import { Accueil, Cards, Gains, Kyc, Logout, Notifications, Parameters, Transfert, Users, Wallet } from './icons';

interface ISideBarLinks {
  title: string;
  icon: string;
  path: string;
};
const SideBarLinks = [
  {
    title: 'Accueil',
    path:'/',
    count: null,
    icon: <Accueil/>,
  },
  {
    title: 'Comptes utilisateurs',
    path: '/users',
    count: null,
    icon: <Users/>,    
  },
  {
    title: 'Transactions wallet',
    path: '/products',
    count: null,
    icon: <Wallet/>,    
  },
  {
    title: 'Transfert d\'argent',
    path: '/orders',
    count: null,
    icon: <Transfert/>,    
  },
  {
    title: 'Cartes',
    path: '/settings',
    count: null,
    icon: <Cards/>,    
  },
  {
    title: 'Verifications KYC',
    path: '/settings',
    count: 14,
    icon: <Kyc/>,    
  },
  {
    title: 'Gains',
    path: '/settings',
    count: null,
    icon: <Gains/>,    
  },
  {
    title: 'Administration',
    path: '/administration',
    count: null,
    icon: <Notifications/>,    
  },
  {
    title: 'Notifications',
    path: '/settings',
    count: null,
    icon: <Notifications/>,    
  },
  {
    title: 'Paramètres généraux',
    path: '/settings',
    count: null,
    icon: <Parameters/>,    
  },
  {
    title: 'Logout',
    path: '/logout',
    count: null,
    icon: <Logout/>,    
  }
]

const SideBar = () => {
  const pathname = usePathname()
  
  return (
    <div className='pt-[22px] w-[300px] h-screen flex flex-col gap-0 border-r-4 border-gray-200'>
      <div className='pl-[20px] mb-[40px]'>
        <Logo/>
      </div>
      <ul className='list-image-none w-full my-0 py-0'
      style={{marginBlockStart:0, marginBlockEnd:0, paddingInlineStart:0}}>
        {SideBarLinks.map((link) =>  {
          const isActive = pathname?.split('/')[1] === link.path.split('/')[1];
          const iconColor = isActive ? 'fill-[#fff]' : 'fill-[#444]'; // Adjust the color based on the condition

          return (
          <li key={link.title} className={`flex items-center justify-between gap-[15px] group 
          pl-[22px] pr-3 py-3 text-gray-700 group hover:bg-[#18BC7A] 
          hover:pl-7 transition-all ${isActive ? 'bg-[#18BC7A] pl-7' : ''}`}>
            <div className='flex items-center gap-[15px]'>
              <div className=''>
                {/* {link.icon} */}
                {React.cloneElement(link.icon, { className: iconColor })}
              </div>
              <Link href={link.path} className={`text-sm group-hover:text-gray-100 transition-all ${pathname?.split('/')[1] === link.path.split('/')[1] ? 'text-white' : ''}`}>
                {link.title}
              </Link>
            </div>
            {link.count ?
            <div className='relative w-[20px] h-[20px]'>
              <span className='absolute rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center 
              text-xs font-bold text-white group-hover:text-[#18BC7A] w-full h-full'>
                14
              </span>
            </div>
            :<></>}
          </li>
        )})}
      </ul>
    </div>
  )
}

export default SideBar
