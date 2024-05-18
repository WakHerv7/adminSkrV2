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
import  KYCVerified from "./components/Tabs/KYCVerified";
import  KYCAccepted from "./components/Tabs/KYCAccepted";
import  KYCRejected from "./components/Tabs/KYCRejected";
import  KYCPending from "./components/Tabs/KYCPending";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import { checkCircleIcon, haltCircleIcon, folderIcon, ongoingCircleIcon, verifiedIcon, waitCircleIcon } from "@/constants/icons";


const infoData: TDataList[] = [
    [
        [{
            label:{
                text: "KYC aujourd'hui",
                tooltip:"KYC aujourd'hui", 
                fw:"bold", 
                color:"#444"
            },
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [
          
            {
                label:{text:folderIcon, tooltip:"Dossiers KYC", fw:"", color:"#444", fs:'11px'},
                value:{text:"75/120 comptes", fw:"bold", color:"#888", fs:'14px', tooltip:"Dossiers KYC",}
            },
            {
                label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
                value:{text:"71", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
            },
            {
                label:{text:checkCircleIcon, tooltip:"KYC Approuvés", fw:"", color:"#444", fs:'11px'},
                value:{text:"65", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"KYC Approuvés",}
            },
            {
                label:{text:haltCircleIcon, tooltip:"KYC Rejetés", fw:"", color:"#444", fs:'11px'},
                value:{text:"6", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"KYC Rejetés",}
            },
            {
                label:{text:waitCircleIcon, tooltip:"KYC En attente", fw:"", color:"#444", fs:'11px'},
                value:{text:"4", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
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
          value:{text:"", fw:"bold", color:"#444"}
      }],
      [
        
          {
              label:{text:folderIcon, tooltip:"Dossiers KYC", fw:"", color:"#444", fs:'11px'},
              value:{text:"5780/8852 comptes", fw:"bold", color:"#888", fs:'14px', tooltip:"Dossiers KYC",}
          },
          {
              label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
              value:{text:"2781", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
          },
          {
              label:{text:checkCircleIcon, tooltip:"KYC Approuvés", fw:"", color:"#444", fs:'11px'},
              value:{text:"2500", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"KYC Approuvés",}
          },
          {
              label:{text:haltCircleIcon, tooltip:"KYC Rejetés", fw:"", color:"#444", fs:'11px'},
              value:{text:"281", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"KYC Rejetés",}
          },
          {
              label:{text:waitCircleIcon, tooltip:"KYC En attente", fw:"", color:"#444", fs:'11px'},
              value:{text:"399", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
          },
      ]
  ],
];


export default function page() {
	return (
		<Layout
		title={"Vérifications KYC"}
		>
			<>
			<section className="px-2">
        <div className='mb-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
            {infoData.map((data, index) => (
                <InfoCard key={index} data={data} />
            ))}
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
              <TabsTrigger className="TabsTrigger" value="02">KYC vérifiés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="03">KYC approuvés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="04">KYC rejetés</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="05">KYC en attente</TabsTrigger>
            </TabsList>
            </div>
            <div className={`mt-5`}>
              <TabsContent value="01">
                <KYCAll/>
              </TabsContent>
              <TabsContent value="02">
                <KYCVerified />
              </TabsContent>
              <TabsContent value="03">
                <KYCAccepted />
              </TabsContent>
              <TabsContent value="04">
                <KYCRejected />
              </TabsContent>
              <TabsContent value="05">
                <KYCPending />
              </TabsContent>
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

