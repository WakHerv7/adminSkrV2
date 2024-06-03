// import { FaBorderAll } from "react-icons/fa6";

import { sekureIcon } from "@/constants/icons";

type Props = {
  isExpanded?: boolean;
};
const Logo = (props: Props) => {
  const {isExpanded} = props;
  return (
    <>
    {isExpanded ?
    <div className="flex justify-start items-start w-[180px] h-[24px]">
      <img
        src="/assets/LogoSekure.png"
        alt="logo"
        className={"h-full"}
        style={{width: '121px'}}
      />
      <img
        src='/assets/Admin-logo.png'
        alt="admin logo"
        className="w-[56px] h-[19px] ml-1"
      />
    </div>
    : 
    <div style={{paddingLeft:'10px', transform:'scale(1.7)'}}>
      {sekureIcon}
    </div>
    }
    </>
  )
}

export default Logo;
