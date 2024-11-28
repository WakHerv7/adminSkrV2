"use client"

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter } from "react-icons/fa";
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
import  KYCBlocked from "./components/Tabs/KYCBlocked";
import  KYCOngoing from "./components/Tabs/KYCOngoing";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import { checkCircleIcon, haltCircleIcon, stopIcon, folderIcon, ongoingCircleIcon, verifiedIcon, waitCircleIcon } from "@/constants/icons";
import { UserService } from "@/api/services/user";
import { useTitle } from "@/hooks/useTitle";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { setKYCAccepted, setKYCAll, setKYCBlocked, setKYCNone, setKYCOngoing } from "@/redux/slices/kyc";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";


const infoData: TDataList[] = [
    [
        [{
            label:{
                text: "KYC aujourd'hui",
                tooltip:"KYC aujourd'hui", 
                fw:"bold", 
                color:"#444"
            },
            value:{text:"75/120 comptes", fw:"bold", color:"#444"}
        }],
        [         
            
            // {
            //     label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
            //     value:{text:"71", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
            // },
            {
                label:{text:checkCircleIcon, tooltip:"KYC Approuvés", fw:"", color:"#444", fs:'11px'},
                value:{text:"65", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"KYC Approuvés",}
            },
            {
              label:{text:waitCircleIcon, tooltip:"KYC En attente", fw:"", color:"#444", fs:'11px'},
              value:{text:"4", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
            },
            {
                label:{text:haltCircleIcon, tooltip:"KYC Bloqués", fw:"", color:"#444", fs:'11px'},
                value:{text:"6", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"KYC Bloqués",}
            },
            {
                label:{text:stopIcon, tooltip:"Aucune verification KYC", fw:"", color:"#444", fs:'11px'},
                value:{text:"0", fw:"bold", color:"#888", fs:'14px', tooltip:"Aucune verification KYC",}
            },
        ]
    ],
    [
      [{
          label:{
              text: "Total KYC",
              tooltip:"Total KYC", 
              fw:"bold", 
              color:"#444"
          },
          value:{text:"5780/8852", fw:"bold", color:"#444"}
      }],
      [          
          // {
          //     label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
          //     value:{text:"2781", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
          // },
          {
              label:{text:checkCircleIcon, tooltip:"KYC Approuvés", fw:"", color:"#444", fs:'11px'},
              value:{text:"2500", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"KYC Approuvés",}
          },
          {
            label:{text:waitCircleIcon, tooltip:"KYC En attente", fw:"", color:"#444", fs:'11px'},
            value:{text:"399", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
          },
          {
              label:{text:haltCircleIcon, tooltip:"KYC Bloqués", fw:"", color:"#444", fs:'11px'},
              value:{text:"281", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"KYC Bloqués",}
          },
          {
              label:{text:stopIcon, tooltip:"Aucune verification KYC", fw:"", color:"#444", fs:'11px'},
              value:{text:"0", fw:"bold", color:"#888", fs:'14px', tooltip:"Aucune verification KYC",}
          },
      ]
  ],
];


infoData[0][0][0].value.text = `${0}/${0} comptes`;
infoData[0][1][0].value.text = 0;
infoData[0][1][1].value.text = 0;
infoData[0][1][2].value.text = 0;
infoData[0][1][3].value.text = 0;
infoData[1][0][0].value.text = `${0}/${0} comptes`;
infoData[1][1][0].value.text = 0;
infoData[1][1][1].value.text = 0;
infoData[1][1][2].value.text = 0;
infoData[1][1][3].value.text = 0;

const getAllKYC = async ({queryKey}:any) => {
  const [_key, filter, st] = queryKey;
  let params:any = {};
  if(st) params.searchTerm = st;
  if(filter) params.filter = filter;
  // console.log("getCustomers searchTerm : ", st, queryKey);    
  const response = await UserService.get_all_kyc(params);
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users'); 
  }  
  
  
  return responseJson.data; 
};
const getKYCStats = async () => {
  const response = await UserService.get_kyc_stats();
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get users statistics'); 
  }
  // console.log("getKYCStats.data : ", responseJson.data);
  return responseJson.data; 
  
};

export default function KYC() {
  useTitle("Sekure | Vérifications KYC", true);
  const [searchKYC, setSearchKYC] = useState('');
	const [searchKYCAccepted, setSearchKYCAccepted] = useState('');
	const [searchKYCOngoing, setSearchKYCOngoing] = useState('');
	const [searchKYCBlocked, setSearchKYCBlocked] = useState('');
  const [searchKYCNone, setSearchKYCNone] = useState('');

  
	const dispatch = useDispatch();
	const searchTerm:string = useSelector(selectSearchTerm);
	const allKYCStatsQueryRes = useQuery({
      queryKey: ["allKYCStats"],
      queryFn: getKYCStats,
      onError: (err) => {
        toast.error("Failed to get KYC stats.");
        console.log("Failed to get KYC stats : ", err);
      },
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  const allKYCQueryRes = useQuery({
      queryKey: ["allKYC", '', searchKYC],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get KYC.");
        console.log("Failed to get KYC : ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCAll(allKYCQueryRes.data));
  // console.log("allKYCQueryRes.data : ", allKYCQueryRes.data);
  const allKYCAcceptedQueryRes = useQuery({
      queryKey: ["allKYCAccepted", 'accepted', searchKYCAccepted],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Accepted KYC list.");
        console.log("Failed to get Accepted KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCAccepted(allKYCAcceptedQueryRes.data));
  console.log("allKYCAcceptedQueryRes.data : ", allKYCAcceptedQueryRes.data);
  const allKYCOngoingQueryRes = useQuery({
      queryKey: ["allKYCOngoing", 'ongoing', searchKYCOngoing],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Ongoing KYC list.");
        console.log("Failed to get Ongoing KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCOngoing(allKYCOngoingQueryRes.data));
  console.log("allKYCOngoingQueryRes.data : ", allKYCOngoingQueryRes.data);
  const allKYCBlockedQueryRes = useQuery({
      queryKey: ["allKYCBlocked", 'blocked', searchKYCBlocked],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get Blocked KYC list.");
        console.log("Failed to get Blocked KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCBlocked(allKYCBlockedQueryRes.data));
  console.log("allKYCBlockedQueryRes.data : ", allKYCBlockedQueryRes.data);
  const allKYCNoneQueryRes = useQuery({
    queryKey: ["allKYCNone", 'none', searchKYCNone],
      queryFn: getAllKYC,
      onError: (err) => {
        toast.error("Failed to get None KYC list.");
        console.log("Failed to get None KYC list: ", err);
      },
      // enabled: false,
      refetchInterval: 30000, // Fetches data every 30 seconds
  });
  dispatch(setKYCNone(allKYCNoneQueryRes.data));
  console.log("allKYCNoneQueryRes.data : ", allKYCNoneQueryRes.data);


  if(allKYCStatsQueryRes?.data) {

    infoData[0][0][0].value.text = `${(allKYCStatsQueryRes?.data?.stats?.today?.totalKYC?.toLocaleString('fr-FR') ?? 0)}
    / ${(allKYCStatsQueryRes?.data?.stats?.today?.total?.toLocaleString('fr-FR') ?? 0)} comptes`;
    infoData[0][1][0].value.text = (allKYCStatsQueryRes?.data?.stats?.today?.totalAccepted?.toLocaleString('fr-FR') ?? 0);
    infoData[0][1][1].value.text = (allKYCStatsQueryRes?.data?.stats?.today?.totalOngoing?.toLocaleString('fr-FR') ?? 0);
    infoData[0][1][2].value.text = (allKYCStatsQueryRes?.data?.stats?.today?.totalBlocked?.toLocaleString('fr-FR') ?? 0);
    infoData[0][1][3].value.text = (allKYCStatsQueryRes?.data?.stats?.today?.totalNone?.toLocaleString('fr-FR') ?? 0);
    infoData[1][0][0].value.text = `${(allKYCStatsQueryRes?.data?.stats?.overall?.totalKYC?.toLocaleString('fr-FR') ?? 0)}
    / ${(allKYCStatsQueryRes?.data?.stats?.overall?.total?.toLocaleString('fr-FR') ?? 0)} comptes`;
    infoData[1][1][0].value.text = (allKYCStatsQueryRes?.data?.stats?.overall?.totalAccepted?.toLocaleString('fr-FR') ?? 0);
    infoData[1][1][1].value.text = (allKYCStatsQueryRes?.data?.stats?.overall?.totalOngoing?.toLocaleString('fr-FR') ?? 0);
    infoData[1][1][2].value.text = (allKYCStatsQueryRes?.data?.stats?.overall?.totalBlocked?.toLocaleString('fr-FR') ?? 0);
    infoData[1][1][3].value.text = (allKYCStatsQueryRes?.data?.stats?.overall?.totalNone?.toLocaleString('fr-FR') ?? 0);

    // infoData[0][0][0].value.text = (allKYCStatsQueryRes?.data?.totalAmount?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[0][1][0].value.text = (allKYCStatsQueryRes?.data?.statuses?.['ACTIVE']?.count?.toLocaleString('fr-FR') ?? 0);
    // infoData[0][1][1].value.text = (allKYCStatsQueryRes?.data?.statuses?.['FREEZE']?.count?.toLocaleString('fr-FR') ?? 0);
    // infoData[0][1][2].value.text = (allKYCStatsQueryRes?.data?.statuses?.['DISABLED']?.count?.toLocaleString('fr-FR') ?? 0);
    // infoData[1][0][0].value.text = (allKYCStatsQueryRes?.data?.recharge_carte?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[1][1][0].value.text = (allKYCStatsQueryRes?.data?.recharge_carte?.avgTotal?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[2][0][0].value.text = (allKYCStatsQueryRes?.data?.retrait_carte?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[2][1][0].value.text = (allKYCStatsQueryRes?.data?.retrait_carte?.avgTotal?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[3][0][0].value.text = (allKYCStatsQueryRes?.data?.payments?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
    // infoData[3][1][0].value.text = (allKYCStatsQueryRes?.data?.payments?.avgTotal?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";

  }

	return (
		<Layout
		title={"Vérifications KYC"}
		>
			<>
			<section className="px-2">
        <div className='mb-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
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
            
        </div>
      	{/* <div className="flex justify-start items-center gap-1 w-full">
          <div className="w-56">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-xs font-semibold">Dossiers KYC auj.</h1>
              <p className="text-sm font-semibold text-[#18BC7A] leading-4">75/120 <span className="text-xs">comptes</span></p>
            </div>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[10px] font-thin">Total Dossiers KYC</h1>
              <p className="text-xs font-semibold text-gray-500 leading-4">5780/8852 <span className="text-xs">comptes</span></p>
            </div>
          </div>
          <div className="flex-1 p-3 w-48">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-xs font-semibold">KYC vérifiés auj.</h1>
              <p className="text-sm font-semibold text-[#18BC7A] leading-4">71</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[10px] font-thin">Total KYC vérifiés</h1>
              <p className="text-xs font-semibold text-gray-500 leading-4">2781</p>
            </div>
          </div>
          <div className="flex-1 p-3 w-48">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-xs font-semibold">KYC approuvés auj.</h1>
              <p className="text-sm font-semibold text-[#18BC7A] leading-4">65</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[10px] font-thin">Total KYC aprouvés </h1>
              <p className="text-xs font-semibold text-gray-500 leading-4">2500</p>
            </div>
          </div>
          <div className="flex-1 p-3 w-48">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-xs font-semibold text-[#F85D4B]">KYC rejetés auj.</h1>
              <p className="text-sm font-semibold text-[#F85D4B] leading-4">6</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[10px] font-thin">Total KYC rejetés</h1>
              <p className="text-xs font-semibold text-gray-500 leading-4">281</p>
            </div>
          </div>
          <div className="flex-1 p-3 w-48">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-xs font-semibold">KYC en attente auj.</h1>
              <p className="text-sm font-semibold text-[#18BC7A] leading-4">4</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-[10px] font-thin">Total KYC en attente</h1>
              <p className="text-xs font-semibold text-gray-500 leading-4">2999</p>
            </div>
          </div>
      	</div> */}
      </section>
      <section className="my-10">
          <Tabs defaultValue="01" className="w-full">
            <div className="border-b-1">
            <TabsList className="TabsList">
              <TabsTrigger className="TabsTrigger" value="01">Dossiers KYC</TabsTrigger>              
              <TabsTrigger className="TabsTrigger" value="02">KYC approuvés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="03">KYC bloqués</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="04">KYC en cours</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="05">Aucune vérification KYC</TabsTrigger>
            </TabsList>
            </div>
            <div className={`mt-5`}>
              <TabsContent value="01">
                <KYCAll
                isLoading={allKYCQueryRes.status == 'loading'}
                search={searchKYC}
						    setSearch={setSearchKYC}
                />
              </TabsContent>              
              <TabsContent value="02">
                <KYCAccepted
                isLoading={allKYCAcceptedQueryRes.status == 'loading'}
                search={searchKYCAccepted}
						    setSearch={setSearchKYCAccepted}
                />
              </TabsContent>
              <TabsContent value="03">
                <KYCBlocked
                isLoading={allKYCBlockedQueryRes.status == 'loading'}
                search={searchKYCBlocked}
						    setSearch={setSearchKYCBlocked}
                />
              </TabsContent>
              <TabsContent value="04">
                <KYCOngoing
                isLoading={allKYCOngoingQueryRes.status == 'loading'}
                search={searchKYCOngoing}
						    setSearch={setSearchKYCOngoing}
                />
              </TabsContent>
              <TabsContent value="05">
                <KYCNone
                isLoading={allKYCNoneQueryRes.status == 'loading'}
                search={searchKYCNone}
						    setSearch={setSearchKYCNone}
                />
  KYC    </TabsContent>
            </div>
          </Tabs>
      	{/* <Tabs defaultValue="Dossiers KYC" className="w-full">
					<div className="flex justify-between items-center mt-3 w-full">
						<TabsComponent data={['Dossiers KYC', 'KYC vérifiés', 'KYC approuvés', 'KYC rejetés', 'KYC en attente']} />
						<CButton
							text={'Filtrer par'}
							icon={<HiOutlineFilter/>}
							btnStyle={'green'}
							height={'32px'}
						/>
					</div>
					<TabsContent value="Dossiers KYC">
						<DosiersKYC />
					</TabsContent>
				</Tabs> */}
    </section>
			</>
	  </Layout>
	);
}

