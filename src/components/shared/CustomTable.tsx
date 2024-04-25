"use client";
import AdminTable, { ITableData } from '@/components/AdminTable/Table';
import SearchBar from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BsFileEarmarkExcel } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoCopyOutline, IoPrintOutline } from 'react-icons/io5';
import CustomDropdown from './CustomDropdown';
import { RxDotsHorizontal } from 'react-icons/rx';

const headerData: string[] = [
    "S/N", "Nom", "Email","Statut", "Accès", "Date de création", ""
]
const TableData: ITableData[] = [
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Admin',
    date: '12/03/2024',
    edit: '/administration/edit/1',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: false,
    access: 'Manager',
    date: '12/03/2024',
    edit: '/administration/edit/2',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Visitor',
    date: '12/03/2024',
    edit: '/administration/edit/3',
  },
];

interface CustomDropdownProps {
  btnLink?: string;
}

const CustomTable: React.FC<CustomDropdownProps> = ({ btnLink}) =>  {
  return (
    <>
    <div className='flex justify-between items-center'>
      <SearchBar />
      <div className='flex items-center gap-5 ml-[100px]'>
        <Link 
        href={btnLink ?? ''} 
        className='flex items-center bg-[#18BC7A] text-sm text-white text-nowrap rounded-full px-4 h-[32px] hover:bg-[#18BC7A]/80'>
          Ajouter un Admin
        </Link>        
        <CustomDropdown			
          cstyle={'light-green'}
          iconSize={20}
          hasDropdownIcon={false}
          icon= {<RxDotsHorizontal/>}
          items={[
            <div className='flex justify-between gap-2'>
            <IoCopyOutline size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A]'>
              Copy
            </span>
          </div>,
          <div className='flex justify-between gap-2'>
            <BsFileEarmarkExcel size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A] h-fit'>
              Excel
            </span>
          </div>,
          <div className='flex justify-between gap-2'>
            <IoPrintOutline size={15} color={'#18BC7A'} />
            <span className='text-sm text-[#18BC7A]'>
              Print
            </span>
          </div>
          ]}
        />
        
      </div>
    </div>
    <div className='mt-6 w-full'>
      <AdminTable headerData={headerData}data={TableData} />
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
