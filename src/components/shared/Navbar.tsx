import { RxCaretDown } from "react-icons/rx"
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io"
import { CgProfile } from "react-icons/cg";
import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import './style-navbar.css';

type Props = {
    title: string | undefined;
};

export default function Navbar(props:Props) {
    const { title } = props;
  return (
    <div className="w-full flex justify-between items-center h-fit px-10 py-5 ">
        <div className="relative flex justify-start items-center gap-3">
        <div className="hidden absolute top-1 left-[-30px]">
            <FaArrowLeftLong color="#000" size={20}/>
        </div>
        <h1 className="font-semibold text-2xl pl-1 py-0">{title}</h1>
        </div>
        <div className="flex justify-between items-center gap-2">
        <button className="bg-[#F3FFF8] rounded-full pl-5 pr-3 py-2 text-sm font-[500] text-gray-700 flex justify-between items-center gap-5">ce jour <RxCaretDown color="#33E89C" size={24} /></button>
        <div className="flex justify-between items-center gap-[15px]">
            <div className="relative w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#F4EFE3]">
                <IoIosNotificationsOutline color="#18BC7A" size={22}  />
                <div className='absolute bottom-[-8px] right-[-8px] w-[18px] h-[18px] bg-[#18BC7A] rounded-full 
                text-center flex justify-center items-center text-[10px] font-bold text-white'>
                14
                </div>
            </div>
            <div style={{width: 30, height: 30, borderRadius:'50%', position: 'relative'}}>
                <Image
                    alt='vector background'
                    src="/assets/user-icon.png"
                    layout='fill'
                    objectFit='contain'
                />
                <div className='absolute bottom-[-8px] right-[-8px]
                text-center flex justify-center items-center text-[10px] font-bold text-white'>
                    <svg width="19" height="19" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.71404 1.82088C6.33845 1.09319 7.46454 1.09319 8.08895 1.82088C8.41345 2.19907 8.8987 2.40006 9.39557 2.3621C10.3517 2.28907 11.1479 3.08534 11.0749 4.04142C11.0369 4.53829 11.2379 5.02354 11.6161 5.34804C12.3438 5.97245 12.3438 7.09854 11.6161 7.72295C11.2379 8.04746 11.0369 8.5327 11.0749 9.02958C11.1479 9.98565 10.3517 10.7819 9.39557 10.7089C8.8987 10.6709 8.41345 10.8719 8.08895 11.2501C7.46454 11.9778 6.33845 11.9778 5.71404 11.2501C5.38953 10.8719 4.90429 10.6709 4.40741 10.7089C3.45134 10.7819 2.65507 9.98565 2.7281 9.02958C2.76606 8.5327 2.56506 8.04746 2.18688 7.72295C1.45919 7.09854 1.45919 5.97245 2.18688 5.34804C2.56506 5.02354 2.76606 4.53829 2.7281 4.04142C2.65507 3.08534 3.45134 2.28907 4.40741 2.3621C4.90429 2.40006 5.38953 2.19907 5.71404 1.82088Z" fill="#18BC7A"/>
                        <path d="M3.9975 6.24499L5.73992 7.98741L9.51517 4.21216" stroke="white"/>
                    </svg>
                </div>
            </div>
            
        </div>
        <div className="pl-2">
            <label htmlFor="modeToggle" className="flex items-center cursor-pointer">                
                <div className="relative">                
                    <input type="checkbox" defaultChecked id="modeToggle" className="sr-only"/>                
                    <div className="switchbar block bg-gray-200 w-[110px] h-[30px] rounded-full flex items-center px-2 text-xs">
                        <span className="testMode">Mode Test</span>
                        <span className="proMode">Mode Pro</span>
                    </div>

                    <div className="dot absolute left-1 top-[1px] bg-[#18BC7A] w-[28px] h-[28px] 
                    rounded-full transition flex justify-center items-center">
                        <span className="w-[14px] h-[14px] rounded-[5px] border border-solid border-4 border-white"></span>
                    </div>
                </div>
            </label>            
        </div>
        </div>
    </div>
  )
}
