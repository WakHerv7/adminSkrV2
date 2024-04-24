import AdminTable, { ITableData } from '@/components/AdminTable/Table';
import SearchBar from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BsFileEarmarkExcel } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoCopyOutline, IoPrintOutline } from 'react-icons/io5';

const headerData: string[] = [
    "S/N", "Nom", "Email","Statut", "Accès", "Date de création", ""
]
const TableData: ITableData[] = [
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Admin',
    date: '12/03/2024'
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: false,
    access: 'Manager',
    date: '12/03/2024'
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Visitor',
    date: '12/03/2024'
  },
];

const CustomTable = () => {
  return (
    <>
    <div className='flex justify-start items-center'>
      <SearchBar />
      <div className='flex gap-2 ml-6'>
        <Button className='bg-[#18BC7A] rounded-full px-6 h-[32px] hover:bg-[#18BC7A]/80'>
          Ajouter un Admin
        </Button>
        <div className='flex justify-between items-center gap-1 bg-[#18BC7A]/10 hover:bg-[#18BC7A]/20 rounded-full px-6 cursor-pointer'>
          <IoCopyOutline size={15} color={'#18BC7A'} />
          <span className='text-sm text-[#18BC7A]'>
            Copy
          </span>
        </div>
        <div className='flex justify-between items-center gap-1 bg-[#18BC7A]/10  hover:bg-[#18BC7A]/20 rounded-full px-6 cursor-pointer'>
          <BsFileEarmarkExcel size={15} color={'#18BC7A'} />
          <span className='text-sm text-[#18BC7A] h-fit'>
            Excel
          </span>
        </div>
        <div className='flex justify-between items-center gap-1 bg-[#18BC7A]/10  hover:bg-[#18BC7A]/20 rounded-full px-6 cursor-pointer'>
          <IoPrintOutline size={15} color={'#18BC7A'} />
          <span className='text-sm text-[#18BC7A]'>
            Print
          </span>
        </div>
      </div>
    </div>
    <div className='mt-6 w-full'>
      <AdminTable headerData={headerData}data={TableData} />
    </div>
    <div className='py-10 text-sm flex justify-end items-center'>
        <div className='flex items-center gap-3'>
            <span>Aller à la page</span>
            <Link href=""><FaChevronLeft/></Link>
            <div className="py-2 w-[70px] bg-gray-200 rounded-2xl text-center">
                01
            </div>
            <Link href=""><FaChevronRight/></Link>
            <span>sur 254</span>
        </div>
    </div>
    </>
  )
}

export default CustomTable
