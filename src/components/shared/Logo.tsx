// import { FaBorderAll } from "react-icons/fa6";

const Logo = () => {
  return (
    <div className="flex justify-start items-start w-[180px] h-[24px]">
      <img
        src="/assets/LogoSekure.png"
        alt="logo"
        className="w-[121px] h-full"
      />
      <img
        src='/assets/Admin-logo.png'
        alt="admin logo"
        className="w-[56px] h-[19px] ml-1"
      />
    </div>
    // <div className="flex flex-row justify-between items-center gap-1">
    //   <FaBorderAll size={26} color="#18BC7A" /><span className="text-4xl font-bold text-[#18BC7A]">sekure</span><span className="text-xs font-semibold bg-[#FFDB5A] text-gray-100 rounded-full px-2 py-1 align-middle">Admin</span>
    // </div>
  )
}

export default Logo;
