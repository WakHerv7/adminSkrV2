
import Title from '@/components/shared/Title';
import cstyle from'../styles/style.module.scss';
import Link from 'next/link';
import { FaX } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { TDataList } from "@/components/cards/InfoCard";
import {
    checkCircleIcon,
    ongoingCircleIcon,
    haltCircleIcon,
    transferIcon,
    calendarIcon,
    transferIconToday,
    transferIconAvg,
    transferIconTotal,
    mobileMoneyIcon,
    sekureIcon,
    transferIconMomoToday,
    transferIconMomoTotal,
    transferIconSekureToday,
    transferIconSekureTotal,
  } from '@/constants/Index';
import CButton from '@/components/shared/CButton';
import { FourDots } from '@/components/shared/icons';
import { IoCopyOutline } from 'react-icons/io5';
import { getFormattedDate, getFormattedDateTime, getFormattedTime } from '@/utils/DateFormat';
import { categoryType, getCategoryMode } from '@/utils/graphs';

  const infoData: TDataList[] = [
    [
        [{
            key: 'type',
            label:{text: 'Type', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'date',
            label:{text: 'Date', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'heure',
            label:{text: 'Heure', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold",  color:"#444"}
        }],
        [{
            key: 'status',
            label:{text: 'Statut', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#18BC7A"}
        }],
        [{
            key: 'name',
            label:{text: 'Nom utilisateur', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],        
        [{
            key: 'phone',
            label:{text: 'Téléphone', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'country',
            label:{text: 'Pays', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'cardNumber',
            label:{text: 'Numero carte', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: '_id',
            label:{text: 'ID Transaction', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'merchant_name',
            label:{text: 'Marchand (nom)', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'merchant_country',
            label:{text: 'Marchand (pays)', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'merchant_city',
            label:{text: 'Marchand (ville)', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        // [{
        //     key: 'phone2',
        //     label:{text: 'Téléphone débiteur', fw:"bold", color:"#444"},
        //     value:{text:"+237 699 58 62 35", color:"#444"}
        // }],
        
    ],
    [
        
        [{
            key: 'mode',
            label:{text: 'Mode', fw:"bold", color:"#444"},
            value:{text:"",  color:"#444"}
        }],
        [{
            key: 'method',
            label:{text: 'Methode', fw:"bold", color:"#444"},
            value:{text:"",  color:"#444"}
        }],
        [{
            key: 'amount',
            label:{text: 'Montant', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'fees',
            label:{text: 'Frais de transaction', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'oldBalance',
            label:{text: 'Solde compte (avant)', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'newBalance',
            label:{text: 'Solde compte (après)', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'cardOldBalance',
            label:{text: 'Solde carte (avant)', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'cardNewBalance',
            label:{text: 'Solde carte (après)', fw:"bold", color:"#444"},
            value:{text:"", fw:"bold", color:"#444"}
        }],
        [{
            key: 'reason',
            label:{text: 'Motif', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        [{
            key: 'author',
            label:{text: 'Fait par', fw:"bold", color:"#444"},
            value:{text:"", color:"#444"}
        }],
        // [{
        //     key: 'amount',
        //     label:{text: 'Montant débité', fw:"bold", color:"#444"},
        //     value:{text:"50 350 XAF", fw:"bold", color:"#F85D4B"}
        // }],
        // [{
        //     key: '',
        //     label:{text: 'Solde préc.', fw:"bold", color:"#444"},
        //     value:{text:"353 000 XAF", color:"#444"}
        // }],
        // [{
        //     key: '',
        //     label:{text: 'Nouv. solde', fw:"bold", color:"#444"},
        //     value:{text:"225 000 XAF", fw:"bold", color:"#18BC7A"}
        // }],
    ],    
];


interface TransferModalProps {
    item: object,
    customer:any,
}
interface ItmInterface {
    [key: string]: any;
}
export default function TransactionModal({item, customer}:TransferModalProps) {
    const pathname = usePathname();
    
    const itemData = (itm: ItmInterface, infoData: TDataList[], customer:any): TDataList[] => {
        // Assuming TDataList is an array of arrays or a similar structure that supports forEach
        let modifiedInfoData: TDataList[] = JSON.parse(JSON.stringify(infoData)); // Shallow copy
        const itm2 = {...itm};
        itm2.name = customer.name;
        itm2.phone = customer.phone;
        itm2.date = '2024-02-18';
        itm2.heure = '11:18';
        itm2.merchant_name = '';
        itm2.merchant_country = '';
        itm2.merchant_city = '';
        Object.keys(itm2).forEach((key, itmIndex) => {
            modifiedInfoData.forEach((data, dataIndex) => {
                data.forEach((line, lineIndex) => {
                    line.forEach((x, xIndex) => {
                        if (key.toString() === String(x.key)) {
                            if (key.toString() === 'name') {
                                x.value.text = customer.name;
                            }
                            else if (key.toString() === 'date') {
                                x.value.text = getFormattedDate(itm['createdAt']);
                            }
                            else if (key.toString() === 'heure') {
                                x.value.text = getFormattedTime(itm['createdAt']);
                            }
                            else if (key.toString() === 'phone') {
                                x.value.text = customer.phone;
                            }
                            else if (key.toString() === 'merchant_name') {
                                x.value.text = itm.merchant?.name ?? '';
                            }
                            else if (key.toString() === 'merchant_country') {
                                x.value.text = itm.merchant?.country ?? '';
                            }
                            else if (key.toString() === 'merchant_city') {
                                x.value.text = itm.merchant?.city ?? '';
                            }
                            else if (key.toString() === 'amount') {
                                const USDValue = itm?.amountUSD ? `(${(itm?.amountUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                                if(getCategoryMode(itm.category, itm.type, itm.mode).mode =='CREDIT') {
                                    x.value.color = '#18BC7A' ;
                                } else if(getCategoryMode(itm.category, itm.type, itm.mode).mode =='DEBIT') {
                                    x.value.color = '#F85D4B';
                                }
                            }
                            else if (key.toString() === 'oldBalance') {
                                const USDValue = itm?.oldBalanceUSD ? `(${(itm?.oldBalanceUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                                x.value.color = '#999';
                            }
                            else if (key.toString() === 'newBalance') {
                                const USDValue = itm?.newBalanceUSD ? `(${(itm?.newBalanceUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                            }
                            else if (key.toString() === 'cardOldBalance') {
                                const USDValue = itm?.cardOldBalanceUSD ? `(${(itm?.cardOldBalanceUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                                x.value.color = '#999';
                            }
                            else if (key.toString() === 'cardNewBalance') {
                                const USDValue = itm?.cardNewBalanceUSD ? `(${(itm?.cardNewBalanceUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                            }
                            else if (key.toString() === 'fees') {
                                const USDValue = itm?.feesUSD ? `(${(itm?.feesUSD/100)?.toLocaleString('fr-FR')} USD)` : '';
                                x.value.text = (itm[key]?.toLocaleString('fr-FR') ?? 0) + " XAF " + USDValue;
                                x.value.color = '#F85D4B';
                            }
                            else if (key.toString() === 'author') {
                                x.value.text = itm[key]?.name ?? '';
                            } 
                            else if (key.toString() === 'status') {
                                if (itm[key] === 'SUCCESS') {
                                    x.value.text = 'Réussi' ;
                                    x.value.color = '#18BC7A' ;
                                } else if (itm[key] === 'FAILED') {
                                    x.value.text = 'Echec'; //'Echoué';
                                    x.value.color = '#F85D4B';
                                } else if (itm[key] === 'PENDING' || itm[key] === 'pending') {
                                    x.value.text = 'En cours';
                                    x.value.color = 'orange';
                                } else if (itm[key] === 'CANCELLED' || itm[key] === 'CANCELED') {
                                    x.value.text = 'En cours';
                                    x.value.color = '#777';
                                } else if (itm[key] === 'INITIATED') {
                                    x.value.text = 'Initial';
                                    x.value.color = '#007FFF';
                                }
                                
                            } 
                            else if (key.toString() === 'createdAt') {
                                x.value.text = getFormattedDateTime(itm[key]) ;
                            }
                            else if (key.toString() === 'type') {
                                x.value.text = categoryType[itm.category][itm.type] ;
                            }
                            else if (key.toString() === 'mode') {
                                x.value.text = `${getCategoryMode(itm.category, itm.type, itm.mode).text} (${itm.mode})` ;
                                if(getCategoryMode(itm.category, itm.type, itm.mode).mode =='CREDIT') {
                                    x.value.color = '#18BC7A' ;
                                } else if(getCategoryMode(itm.category, itm.type, itm.mode).mode =='DEBIT') {
                                    x.value.color = '#F85D4B';
                                }
                            }
                            else {
                                x.value.text = String(itm[key]);
                            }
                        }
                    });
                });
            });
        });
        return modifiedInfoData; // Consider adjusting the return type if necessary
    };

    return (
    <div className="bg-white m-auto p-8 rounded-md">
        <div className="flex justify-between mb-5">
            <Title
            title={"Details de la transaction"}
            />
            {/* {customer.name} */}
            <Link href={pathname}>
                <FaX size={16} color={"#444"}/>
            </Link>
        </div>
        <div className={`${cstyle['dualGrid']}`}>
            {itemData(item, infoData, customer).map((data, index) => (
                <div key={index} className={``}>
                {data.map((line, index1) => (
                    <div key={index1} className={`flex flex-wrap justify-between items-center mx-1`}>
                    {line.map((item, index2) => (                        
                        <div key={index2} className={`my-3 grid grid-cols-2 gap-3 w-full`}>
                            <span title={item.label.tooltip ?? ''} style={{fontSize: item.label.fs ?? '14px', color:item.label.color ?? '#444'}} className={`font-${item.label.fw ?? 'normal'}`}>
                                {item.label.text}
                            </span>
                            <span title={item.value.tooltip ?? ''} style={{fontSize: item.value.fs ?? '14px', color:item.value.color ?? '#444'}} className={`font-${item.value.fw ?? 'normal'}`}>
                                {item.value.text}
                            </span>
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            ))}
        </div>
        {/* <div className='flex gap-5 mt-8'>
                <CButton
                text={'Voir utilisateur'}
                href={``}
                btnStyle={'dark'}
                icon={<FourDots />}  
                height={'32px'}            
                width={'100%'}
                />
                <CButton
                text={'Copier'}
                icon={<IoCopyOutline/>}
                btnStyle={'lightGreen'}
                height={'32px'}
                width={'100%'}
                />
        </div> */}
    </div>
  )
}
