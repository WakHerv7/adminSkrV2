"use client";

// import Category, { ICategory } from "@/components/cards/Category";
import CButton from "@/components/shared/CButton";
import DataCard from "@/components/cards/DataCard/DataCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from '@/components/charts/Doughnut';
import CustomDropdown from "@/components/shared/CustomDropdown";
import Layout from "@/components/shared/Layout";
import LegendItem from "@/components/shared/LegendItem";
import Title from "@/components/shared/Title";
import { doughnutData, gradientData1, gradientData2, gradientData3, pieData, pieDataFour, pieDataThree, pieDataTwo } from "@/constants/graphData";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FourDots } from "@/components/shared/icons";
import { FaChevronRight } from "react-icons/fa";
import ChartLabelBox from "@/components/shared/ChartLabelBox";
import PieChart from "@/components/charts/pieChart/PieChart";
import CustomTable from "@/components/shared/CustomTable";
import { 
  headerHomeUserAccountData as headerData, 
  tableHomeUserAccountData as tableData } from "@/constants/Index";
import ActiveYesNo from "@/components/shared/ActiveYesNo";



export default function Home() {
	
    const rearrangedTableData = tableData.map((item, index) => {
      const rearrangedItem = {
        index: index+1,
        name: item.name,			
        country: item.country,
        phone: item.phone,
        email: item.email,        
        soldeCompte: item.solde,
        nbCartes: index%3 + 1,
        soldeCarte: item.solde,
        totalTrx: item.totalTrx,
        avgTrx: item.avgTrx,
        status: <ActiveYesNo isActive={item.status}/>,			
        date: item.date,
        // actions: <>
        // <div className='flex gap-5'>
        //       <CButton
        //   text={'Manager'}
        //   href={`users_accounts/manage/${index+1}`}
        //   btnStyle={'dark'}
        //   icon={<FourDots />}              
        //   />
        //         {item.locked ?
        //         <CButton 
        //   text={'Debloquer'} 
        //   btnStyle={'lightYellow'}
        //   icon={<FaLock />} 
        //   />
        //         :
        //         <CButton 
        //   text={'Bloquer'} 
        //   btnStyle={'yellow'}
        //   icon={<FaLock />}
        //         width={'100%'}
        //   />
                // }
          
                
        //   </div>
        // </>
      };
      item = rearrangedItem;
      return item;
    });
	
	return (
		<Layout
			title="Accueil et visualisation globale"
		>
			<section className="flex justify-between items-start gap-10 w-full">
				<div className="flex-1 overflow-hidden">
					<div className="w-full flex justify-between items-start mb-3">
						<Title title="Évolution des transactions " subtitle="visualisez la courbe d’evolution en nombre de cartes parrainées" />
						<div className='flex flex-col gap-2'>
							<div className='flex justify-between items-center gap-8'>
								<p className='text-xs'>Transactions aujourd'hui</p>
								<h1 className='text-sm font-semibold'>12 542 500 Fcfa</h1>
							</div>
							<div className='flex justify-between items-center gap-8'>
								<p className='text-xs'>Transactions Totales</p>
								<p className='text-xs text-right'>262 550 000 Fcfa</p>
							</div>
						</div>
					</div>
					<CustomDropdown
						title={'Par jour'}			
						cstyle={'outline'}
						iconSize={20}
						items={[
							<div key={'1'} className='flex justify-between gap-2'>            
								<span className='text-nowrap text-sm '>
								Par jour
								</span>
							</div>,
							<div key={'2'} className='flex justify-between gap-2'>            
								<span className='text-nowrap text-sm '>
								Par semaine
								</span>
							</div>,
							<div key={'3'} className='flex justify-between gap-2'>            
								<span className='text-nowrap text-sm '>
								Par mois
								</span>
							</div>,
						]}
					/>
					<AreaChart data={gradientData1}/>
				</div>
        <div>
            <div className="relative  h-80 overflow-hidden">
                <Title title={"Traffic de paiements"} />
                <Doughnut data={doughnutData} />
                <div className='grid grid-cols-2 gap-x-10 gap-3'>
                    <LegendItem label={`Cameroun`} color={`#33E89C`} value={`46%`}/>
                    <LegendItem label={`Gabon`} color={`#FFDB5A`} value={`46%`}/>
                    <LegendItem label={`Cote d'ivoire`} color={`#FD8A49`} value={`46%`}/>
                    <LegendItem label={`Mali`} color={`#6200EE`} value={`46%`}/>
                    <LegendItem label={`Senegal`} color={`#5BCEFF`} value={`46%`}/>
                    <LegendItem label={`Autres`} color={`#F85D4B`} value={`46%`}/>
                </div>
            </div>
        </div>
      </section>
      

      <section>
        <div className='w-full my-[50px] border border-gray-800'/>
        <div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-5 w-full gap-5'>
          {Array.from({length: 10}, (_, i) => i).map((item, index) => (
            <DataCard 
            title="Recharges de compte"
            change_per="24%"
            chartData={{
              labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
              datasets: [{
                label: '',
                // data: [20, 32, 11, 29, 10, 25, 30, 27, 100, 320, 28, 100],
                data: Array.from({length: 12}, () => Math.floor(Math.random() * 100)),
                borderColor: index%2 == 0 ? '#FFDB5A' : '#18BC7A',
                borderWidth: 2,
                pointStyle: false
              }]
            }}
            data={{
              today: "12 542 500 Fcfa",
              total: "262 550 000 Fcfa",
              average: "550 000 Fcfa"
            }}
          />
          ))}
        </div>
      </section>


      <section>
        <div className='flex flex-between items-center p-8 w-full bg-[#FFDB5A] rounded-lg mt-10'>
          <div className='flex items-start gap-4 flex-1'>
            <IoChatbubble size={26} color="#994617" className='mt-2'/>
            <div className='flex flex-col items-start justify-start text-[#994617]'>
              <h1 className='text-md lg:text-lg font-semibold text-[#994617]'>03 Nouveaux messages des requetes clients</h1>
              <p className='text-xs text-[#994617]'>Separated they live in Bookmarks right at the coast of the famous </p>
            </div>
          </div>
          <CButton
          text={'Voir'}
          href={"#"}
          btnStyle={'white_darkRed'}
          icon={<FaChevronRight />}
          iconSize={12}
          iconPosition={'end'}
          />
        </div>
      </section>


      <section>
        <div className='w-full my-[50px] border border-gray-800'/>
        <div className='grid grid-cols-2 gap-x-10 w-full mt-6'>
          <div className='flex flex-col gap-2 overflow-hidden'>
            <div className='flex justify-between items-center'>
              <Title title={"Évolution des utilisateurs"} />
              <CustomDropdown
                title={'Par jour'}			
                cstyle={'outline'}
                iconSize={20}
                items={[
                  <div key={'1'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par jour
                    </span>
                  </div>,
                  <div key={'2'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par semaine
                    </span>
                  </div>,
                  <div key={'3'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par mois
                    </span>
                  </div>,
                ]}
              />
            </div>
            <div className='w-full flex justify-between items-center gap-3'>
              <ChartLabelBox title="Comptes créés aujourd'hui" rate="42" />
              <ChartLabelBox title="Transactions Totales" rate="2550" />
              <ChartLabelBox title="Moy. de creation" rate="80/jour" />
            </div>
            <AreaChart data={gradientData2}/>
            <div className='grid grid-cols-2 gap-10 overflow-hidden  mt-5'>
              <div>
                <Title title={"Etat des comptes créés"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`Tinder.com`} color={`#F85D4B`} value={`46%`}/>
                        <LegendItem  label={`Alibaba.com`} color={`#B8A16B`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataFour} size={90}/>
                </div>
              </div>
              <div>
                <Title title={"Nbre de cartes par compte"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`0`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`1`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`2`} color={`#F85D4B`} value={`46%`}/>
                        <LegendItem  label={`3 et plus`} color={`#B8A16B`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataFour} size={90}/>
                </div>
              </div>
            </div>
          </div>
          

          <div className='flex flex-col gap-2 overflow-hidden'>
            <div className='flex justify-between items-center'>
              <Title title={"Évolution des cartes"} />
              <CustomDropdown
                title={'Par jour'}			
                cstyle={'outline'}
                iconSize={20}
                items={[
                  <div key={'1'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par jour
                    </span>
                  </div>,
                  <div key={'2'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par semaine
                    </span>
                  </div>,
                  <div key={'3'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par mois
                    </span>
                  </div>,
                ]}
              />
            </div>
            <div className='w-full flex justify-between items-center gap-3'>
              <ChartLabelBox title="Cartes créés aujourd'hui" rate="42" />
              <ChartLabelBox title="Transactions Totales" rate="2550" />
              <ChartLabelBox title="Moy. de création" rate="80/jour" />
            </div>
            <AreaChart data={gradientData3}/>
            <div className='grid grid-cols-2 gap-10 overflow-hidden  mt-5'>
              <div>
                <Title title={"Etat des cartes créés"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Actives`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Bloquées`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`Supprimées`} color={`#FD8A49`} value={`46%`}/>                      
                    </div>
                    <PieChart data={pieDataThree} size={90}/>
                </div>
              </div>
              <div>
                <Title title={"Nbre de cartes par type"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Mastercard`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Visa`} color={`#FFDB5A`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataTwo} size={90}/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      <section>
        <div className='w-full my-[50px] border border-gray-800'/>
        <div className="">
            <div className="mb-5">
                <Title 
                title={"Liste des meilleurs utilisateurs"}
                />
            </div>
            <CustomTable
            headerData={headerData}
            tableData={rearrangedTableData}
            threeButtons
            />
        </div>
      </section>
		</Layout>
	);
}
