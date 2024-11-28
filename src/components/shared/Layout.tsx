"use client"
import React, { useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import Modal from "./Modal/Modal";
// import Footer from "./Footer";
import { useContext, useEffect } from "react";
import { capitalize } from "@/utils/capitalize";
import { context } from "@/context/ApplicationContext";
import { useRouter, usePathname } from "next/navigation";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
interface LayoutProps {
    title: string;
    children: React.ReactNode;
    backLink?: string;
    goBack?:(data?:any)=>void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, backLink, goBack }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
	const pathname = usePathname();
	const token = useSelector(selectCurrentToken);
	const user = useSelector(selectCurrentUser);
	// console.log("token : ", token);
  
	
  /** //////////////////////////////////////////// */
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.title = capitalize(title);
		}
	}, [title]);
	
	useEffect(() => {
		if (!token) {
        window.sessionStorage.setItem('previousUrl', pathname);
				router.push("/login");
		}
	}, [router]);

	useEffect(() => {
		// const sktoken = localStorage.getItem('sktoken');
    const previousUrl = window.sessionStorage.getItem('previousUrl');
		if(token && pathname=='/login') {
      if(user.adminRole === 'customer-support'){
        router.push(previousUrl || urls.usersAccounts.root);  
      }
      else{
        router.push(previousUrl || urls.dashboardHome.root);  
      }			
		}
		if(token && (pathname=='/dashboard/retrait-gb' || pathname=='/retrait-gb') && user.email !== "digitalixgroupltd@gmail.com" ) {
			router.push(previousUrl || urls.dashboardHome.root);
		}
    if(token && (user.adminRole === 'customer-support' && 
      (!pathname.startsWith(urls.usersAccounts.root) 
      && !pathname.startsWith(urlsV2.usersAccounts.root) 
      && !pathname.startsWith(urlsV2.kyc.root)) ))
      router.push(previousUrl || urls.usersAccounts.root);
    }, [pathname]);
    /** //////////////////////////////////////////// */
    
  return (
    <main className="flex">
        <div className="relative">
          <SideBar user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
        </div>
        <div className="flex flex-col w-full" style={{width: isExpanded ? 'calc(100vw - 300px)' : 'calc(100vw - 120px)', transition:'all ease-in .3s'}}>
            <div className="relative w-full">
              <Navbar title={title} goBack={goBack} backLink={backLink} isExpanded={isExpanded}/>
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

