"use client"

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter, FaYenSign } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import  KYCAll from "./components/Tabs/KYCAll";
import  KYCNone from "./components/Tabs/KYCNone";
import  KYCAccepted from "./components/Tabs/KYCAccepted";
import  KYCDeclined from "./components/Tabs/KYCDeclined";
import  KYCPending from "./components/Tabs/KYCPending";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import { checkCircleIcon, haltCircleIcon, stopIcon, folderIcon, ongoingCircleIcon, verifiedIcon, waitCircleIcon } from "@/constants/icons";
import { UserService } from "@/api/services/user";
import { useTitle } from "@/hooks/useTitle";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { setKYCAccepted, setKYCAll, setKYCDeclined, setKYCNone, setKYCPending } from "@/redux/slices_v2/kyc";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";
import { CustomerService } from "@/api/services/v2/customer";
import { FaNairaSign } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


const getAllKYC = async ({queryKey}:any) => {
  const [_key, filter, st] = queryKey;
  let params:any = {};
  if(st) params.searchTerm = st;
  if(filter?.kyc_result) params.kyc_result = filter?.kyc_result;
  if(filter?.kyc_status) params.kyc_status = filter?.kyc_status;

  const response = await CustomerService.get_all_customers(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users'); 
  }  
  
  
  return responseJson.data; 
};
const getKYCStats = async () => {
  const response = await CustomerService.get_kyc_stats();
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users statistics'); 
  }
  // console.log("getKYCStats.data : ", responseJson.data);
  return responseJson.data; 
};

export default function KYC() {
  useTitle("Sekure | ChinPay", true);
  const pathname = usePathname();
  const router = useRouter();

  const paymentServices:any = [
    {
      title:'ChinPay',
      slug:'chinpay',
      icon:<FaYenSign size={35} color="#18BC7A"/>
    },
    {
      title:'NairaPay',
      slug:'nairapay',
      icon:<FaNairaSign size={35} color="#18BC7A"/>
    },
  ]
  
  const handlePaymentServiceSelect = (payservice:any) => {
    router.push(`${pathname}/${payservice.slug}`);
  }

	return (
		<Layout
		title={"Services de paiement"}
		>
			<>
			<section className="px-2">
        <div className="pl-[30px] flex flex-wrap justify-start items-start gap-10">
          {paymentServices.map((paymentService:any) => {
            return(
              <div 
              key={paymentService.slug}
              onClick={()=>handlePaymentServiceSelect(paymentService)} 
              className="flex flex-col justify-center items-center gap-3 w-[200px] cursor-pointer rounded-xl p-[10px] hover:bg-gray-100">
                  
                  <div className="img-container bg-white border rounded-lg h-[120px] w-[120px] overflow-hidden flex justify-center items-center">
                    {paymentService.icon}
                  </div>
                  {/* <div className="text-sm text-gray-400 text-center w-full">{payservice.code}</div>
                  <div className="text-sm text-gray-600 text-center w-full">{payservice.slug}</div> */}
                  <div className="text-md text-center w-full">{paymentService.title}</div>
              </div>
            )
          })}
        </div>
        {/* <div className='mb-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
            {allKYCStatsQueryRes?.status === 'loading' ? 
                <div className="flex justify-center w-full py-10">
                    <div className={'loadingSpinner'}></div>
                </div>
                :
                <>
                {infoData.map((data, index) => (
                    <InfoCard key={index} data={data} />
                ))}
                </>
            } 
        </div> */}
      </section>
			</>
	  </Layout>
	);
}

