"use client";
import AdminTable, { IGenericRow } from '@/components/AdminTable/Table';
import SearchBar from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BsFileEarmarkExcel } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoCopyOutline, IoPrintOutline } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi'; 
import CustomDropdown from './CustomDropdown';
import { RxDotsHorizontal } from 'react-icons/rx';
import ButtonFilled from './ButtonFilled';
import CButton from './CButton';



interface CustomDropdownProps {
  btn?: React.ReactNode;
  filter?: boolean;
  threeButtons?: boolean;
  headerData: string[];
  tableData: IGenericRow[];
}

const CustomTable: React.FC<CustomDropdownProps> = ({headerData, tableData, btn, filter, threeButtons}) =>  {
  return (
    <>
    <div className='flex justify-between items-center'>
      <SearchBar />
      <div className='flex items-center gap-5 ml-[100px]'>        
       
       {btn}

       {filter ?
       <CButton
       text={'Filtrer par'}
       icon={<HiOutlineFilter/>}
       btnStyle={'green'}
       height={'32px'}
       />
       :<></>}
       
       {threeButtons ?
        <div className={`flex gap-x-3`}>
          <CButton
          text={'Copier'}
          icon={<IoCopyOutline/>}
          btnStyle={'lightGreen'}
          height={'32px'}
          />
          <CButton
          text={'Excel'}
          icon={<BsFileEarmarkExcel/>}
          btnStyle={'lightGreen'}
          height={'32px'}
          />
          <CButton
          text={'Imprimer'}
          icon={<IoPrintOutline/>}
          btnStyle={'lightGreen'}
          height={'32px'}
          />
        </div>
        :
        <CustomDropdown			
          cstyle={'light-green'}
          iconSize={20}
          hasDropdownIcon={false}
          icon= {<RxDotsHorizontal/>}
          items={[
            <div key={'1'} className='flex justify-between gap-2'>
            <IoCopyOutline size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A]'>
              Copy
            </span>
          </div>,
          <div key={'2'} className='flex justify-between gap-2'>
            <BsFileEarmarkExcel size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A] h-fit'>
              Excel
            </span>
          </div>,
          <div key={'3'} className='flex justify-between gap-2'>
            <IoPrintOutline size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A]'>
              Print
            </span>
          </div>
          ]}
        />
        }
        
        
      </div>
    </div>
    <div className='mt-6 w-full'>
      <AdminTable headerData={headerData}data={tableData} />
    </div>

    <div className='py-10 text-sm flex justify-end items-center'>
        <div className='flex items-center gap-3'>
            <span>Aller à la page</span>
            <Link href=""><FaChevronLeft/></Link>
            <div className="py-2 px-2 w-[70px] bg-gray-200 rounded-2xl text-center flex justify-center">
              <input
                defaultValue={'01'}
                type="number"
                min={'0'}
                className="w-full bg-gray-200 border-none outline-none text-center"
                placeholder="Enter a number"
              />
            </div>
            <Link href=""><FaChevronRight/></Link>
            <span>sur 254</span>
        </div>
    </div>
    </>
  )
}

export default CustomTable
