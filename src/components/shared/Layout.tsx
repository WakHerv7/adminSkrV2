"use client"
import React from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
// import Footer from "./Footer";

interface LayoutProps {
    title: string;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <main className="flex">
        <SideBar/>
        <div className="flex flex-col w-full">
            <Navbar title={title}/>
            <div className="px-10 pt-3">
                {children}
            </div>
        </div>
            
    </main>
  );
};

export default Layout;

// export async function getServerSideProps(context) {
//   return {
//     props: {},
//   };
// }

