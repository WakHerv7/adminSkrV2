import React from 'react'

type TText = {
  text: string | number;
  fw?: string;
  color?: string;
  fs?: string;
}
type TDataItem = {
  label: TText;
  value: TText;
};
export type TDataList = TDataItem[][];

interface InfoCardProps {
  data: TDataList;
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const InfoCard: React.FC<InfoCardProps> = ({data}) => {
  return (
    <div className='ring-1 ring-[#444] w-full px-2 py-4 rounded-md flex flex-col'>
      
      {data.map((line, index1) => (
        <div key={index1} className={`flex justify-between items-center mx-1`} 
        style={{
          // display: 'flex', 
          // gridTemplateColumns: `repeat(${line.length}, 1fr)` ,
          gap:`${line.length*5}px`}}>
          {line.map((item, index2) => (
            <div key={index2} className={`my-1 flex ${line.length>1 ? 'gap-3' : 'w-full'}  justify-between items-center`}>
              <span style={{fontSize: item.label.fs ?? '14px', color:item.label.color ?? '#444'}} className={`font-${item.label.fw ?? 'normal'}`}>
                {item.label.text}
              </span>
              <span style={{fontSize: item.value.fs ?? '14px', color:item.value.color ?? '#444'}} className={`font-${item.value.fw ?? 'normal'}`}>
                {item.value.text}
              </span>
            </div>
          ))}
        </div>
      ))}


      {/* <div className='flex gap- justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          Transferts aujourd'hui
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {data.reuse}F
        </h1>
      </div>
      <div className='flex gap-1 justify-between items-center'>
        <h1 className='text-gray-900 text-[10px] font-normal'>
          Mayenne de transferts
        </h1>
        <h1 className='text-gray-900 text-[10px] font-bold'>
          {data.encurs} F/jour
        </h1>
      </div> */}
    </div>
  )
}

export default InfoCard
