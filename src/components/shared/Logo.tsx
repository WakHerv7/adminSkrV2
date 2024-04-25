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
  )
}

export default Logo;
