import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
// import { Link, NavLink } from 'next-link';
import Link from 'next/link'
import Logo from '../shared/Logo';
import { Accueil, Cards, Gains, Kyc, Logout, Notifications, Parameters, Transfert, Users, Wallet } from './icons';
import { FaChevronLeft, FaChevronRight, FaUserCheck } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";
import cstyle from './styles/sidebar-style.module.scss'
import urls from '@/config/urls';
import urlsV2 from '@/config/urls_v2';

interface ISideBarLinks {
  title: string;
  icon: string;
  path: string;
};
const SideBarLinks = [
  {
    title: 'Accueil',
    slug:'home',
    path: urls.dashboardHome.root,
    count: null,
    icon: <Accueil/>,
  },
  {
    title: 'Comptes utilisateurs',
    slug:'usersAccounts',
    path: urls.usersAccounts.root,
    count: null,
    icon: <Users/>,    
  },
  {
    title: 'Transactions wallet',
    slug:'walletTransactions',
    path: urls.walletTransactions.root,
    count: null,
    icon: <Wallet/>,    
  },
  {
    title: 'Transfert d\'argent',
    slug:'transferts',
    path: urls.transferts.root,
    count: null,
    icon: <Transfert/>,    
  },
  {
    title: 'Cartes',
    slug:'cards',
    path: urls.cards.root,
    count: null,
    icon: <Cards/>,    
  },
  {
    title: 'Verifications KYC',
    slug:'kyc',
    path: urls.kyc.root,
    count: null,
    icon: <Kyc/>,    
  },
  {
    title: 'Gains',
    slug:'profit',
    path: urls.profit.root,
    count: null,
    icon: <Gains/>,    
  },
  {
    title: 'Administration',
    slug:'administration',
    path: urls.administration.root,
    count: null,
    icon: <Notifications/>,    
  },
  {
    title: 'Notifications',
    slug:'notifications',
    path: urls.notifications.root,
    count: null,
    icon: <IoIosSend size={18}/>,    
  },
  {
    title: 'Paramètres généraux',
    slug:'generalSettings',
    path: urls.generalSettings.root,
    count: null,
    icon: <Parameters/>,    
  },
  {
    title: 'Verifs KYC V2',
    slug:'kycV2',
    path: urlsV2.kyc.root,
    count: null,
    icon: <FaUserCheck size={18}/>,    
  },
  // {
  //   title: 'Logout',
  //   path: urls.login,
  //   count: null,
  //   icon: <Logout/>,    
  // }
]

type Props = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  user:any;
};


const SideBar = (props: Props) => {
  const {isExpanded, setIsExpanded, user} = props;
  const pathname = usePathname();
  // const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className='relative'>      
      <div 
      style={{zIndex:10, width: isExpanded? '250px' : '80px'}}
      className={`${cstyle['sidebar-container']}`}>
        <div 
        style={{width: isExpanded? '250px' : '80px'}}
        className='fixed pt-[22px] pb-[20px] h-full flex flex-col gap-0 border-r-4 border-gray-200'>
          <div>
            <input type="checkbox" 
            hidden 
            checked={isExpanded} 
            onChange={(e)=> setIsExpanded(e.target.checked)} 
            id="sidebarToggleInput" 
            className={`${cstyle['sidebar-toggle-input']}`}
            />
            <label className={`${cstyle['sidebar-toggle']}`} htmlFor='sidebarToggleInput'>
                <span className={`${cstyle['chevronLeft']}`}><FaChevronLeft color={'#444'} /></span>
                <span className={`${cstyle['chevronRight']}`}><FaChevronRight color={'#444'}/></span>
            </label>
          </div>
          <div className={`pl-[20px] mb-[27px] ${cstyle['sidebar-logo']}`}>
            <Logo isExpanded={isExpanded}/>
          </div>
          <div className='relative'>
            <ul className='list-image-none w-full my-0 py-0'
            style={{marginBlockStart:0, marginBlockEnd:0, paddingInlineStart:0}}>
              {SideBarLinks.map((link) =>  {
                const isActive = (pathname?.split('/')[3] === link.path.split('/')[3]);
                const iconColor = isActive ? 'fill-[#fff]' : 'fill-[#444]'; // Adjust the color based on the condition
                if(user?.adminRole === 'customer-support'){
                  if(link.slug === 'usersAccounts' || link.slug === 'kycV2') {
                    return (
                      <li key={link.title} className={`relative`} style={{margin: !isExpanded ? '5px 0':''}}>
                        <Link 
                        href={link.path} 
                        className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
                        text-gray-700 group hover:bg-[#18BC7A] 
                      hover:pl-7 transition-all ${isActive ? 'bg-[#18BC7A] pl-7' : ''}
                        text-sm group-hover:text-gray-100 transition-all ${pathname?.split('/')[3] === link.path.split('/')[3] ? 'text-white' : ''}`}>
                        <div className='flex items-center gap-[15px]'>
                          <div className='' style={{transform: !isExpanded ? 'scale(1.2)':''}}>
                            {/* {link.icon} */}
                            {React.cloneElement(link.icon, { className: iconColor })}
                          </div>
                          {/* <div className={`group-hover:text-gray-100`} style={{display: !isExpanded ? 'none':''}}>
                            {link.title}
                          </div> */}
                          {isExpanded ?
                          <div className={`group-hover:text-gray-100`} style={{display: !isExpanded ? 'none':''}}>
                            {link.title}
                          </div>
                          :
                          <div className={`absolute top-0 left-[80px]  shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block`}
                          style={{zIndex:'1000', color:'#444', whiteSpace:'nowrap'}}
                          >
                            {link.title}
                          </div>}
                        </div>
                        {link.count ?
                        <div className=''>
                          <div className='absolute w-[20px] h-[20px] top-[10px] right-[10px] rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center 
                          text-xs font-bold text-white group-hover:text-[#18BC7A]'>
                            <span>14</span>
                          </div>
                        </div>
                        :<></>}
                        </Link>
                      </li>
                    )
                  }
                } else {
                return (
                <li key={link.title} className={`relative`} style={{margin: !isExpanded ? '5px 0':''}}>
                  <Link 
                  href={link.path} 
                  className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
                  text-gray-700 group hover:bg-[#18BC7A] 
                hover:pl-7 transition-all ${isActive ? 'bg-[#18BC7A] pl-7' : ''}
                  text-sm group-hover:text-gray-100 transition-all ${pathname?.split('/')[3] === link.path.split('/')[3] ? 'text-white' : ''}`}>
                  <div className='flex items-center gap-[15px]'>
                    <div className='' style={{transform: !isExpanded ? 'scale(1.2)':''}}>
                      {/* {link.icon} */}
                      {React.cloneElement(link.icon, { className: iconColor })}
                    </div>
                    {/* <div className={`group-hover:text-gray-100`} style={{display: !isExpanded ? 'none':''}}>
                      {link.title}
                    </div> */}
                    {isExpanded ?
                    <div className={`group-hover:text-gray-100`} style={{display: !isExpanded ? 'none':''}}>
                      {link.title}
                    </div>
                    :
                    <div className={`absolute top-0 left-[80px]  shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block`}
                    style={{zIndex:'1000', color:'#444', whiteSpace:'nowrap'}}
                    >
                      {link.title}
                    </div>}
                  </div>
                  {link.count ?
                  <div className=''>
                    <div className='absolute w-[20px] h-[20px] top-[10px] right-[10px] rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center 
                    text-xs font-bold text-white group-hover:text-[#18BC7A]'>
                      <span>14</span>
                    </div>
                  </div>
                  :<></>}
                  </Link>
                </li>
              )}})}
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default SideBar
