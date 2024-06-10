"use client"
import React, { useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import Modal from "./Modal/Modal";
// import Footer from "./Footer";

interface LayoutProps {
    title: string;
    children: React.ReactNode;
    backLink?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, backLink }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <main className="flex">
        <div className="relative">
          <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
        </div>
        <div className="flex flex-col w-full" style={{width: isExpanded ? 'calc(100vw - 300px)' : 'calc(100vw - 120px)', transition:'all ease-in .3s'}}>
            <div className="relative w-full">
              <Navbar title={title} backLink={backLink} isExpanded={isExpanded}/>
            </div>
            <div className="pl-10 pt-3 pb-10 w-full">
                {children}
            </div>
        </div>
        {/* <Modal/>    */}
    </main>
  );
};

export default Layout;

// export async function getServerSideProps(context) {
//   return {
//     props: {},
//   };
// }

