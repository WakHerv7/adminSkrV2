"use client";

import React, { useEffect, useState } from 'react';
import AdminTable, { IGenericRow } from '@/components/AdminTable/Table';
import SearchBar from '@/components/shared/SearchBar';
import { BsFileEarmarkExcel } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoCopyOutline, IoPrintOutline } from 'react-icons/io5';
import { HiOutlineFilter } from 'react-icons/hi'; 
import CustomDropdown from './CustomDropdown';
import { RxDotsHorizontal } from 'react-icons/rx';
import CButton from './CButton';
import { THeaderData } from '@/app/(general)/administration/page';


interface CustomDropdownProps {
  btn?: React.ReactNode;
  filter?: boolean;
  threeButtons?: boolean;
  headerData: THeaderData[];
  tableData: IGenericRow[];
}

const CustomTable: React.FC<CustomDropdownProps> = ({headerData, tableData, btn, filter, threeButtons}) =>  {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [data, setData] = React.useState<IGenericRow[]>(); // Add type annotation for data and change initial state value to an empty object

  // useEffect(() => {
  //   const getUsers = async () => {
  //     const res = await fetch('api/users');
  //     const users = await res.json();
  //     setData(users);
  //   }

  //   getUsers();
  // }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data?.slice(indexOfFirstUser, indexOfLastUser) ?? [];

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  }

  return (
    <>
    <div className='flex justify-between items-center'>
      <SearchBar searchTerm={search} onChange={handleSearch} />
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
            <div key={Math.random()} className='flex justify-between gap-2'>
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
      <AdminTable searchTerm={search} headerData={headerData} data={currentUsers || []} />
    </div>

    {/* <div className="py-2 px-2 w-[70px] bg-gray-200 rounded-2xl text-center flex justify-center">
      <input
        defaultValue={'01'}
        type="number"
        min={'0'}
        className="w-full bg-gray-200 border-none outline-none text-center"
        placeholder="Enter a number"
      />
    </div> */}

    <div className='py-10 text-sm flex justify-between items-center'>
      {data &&
        <p className='hidden md:inline-block'>page {currentPage} of {Math.ceil(data.length / usersPerPage)}</p>
      }
      <div className='flex items-center gap-3'>
        <span>Aller à la page</span>
        <div className='w-full md:w-1/5 flex flex-row justify-between'>
        {data &&
          Array.from({ length: Math.ceil(data?.length / usersPerPage) }).map((_, i) => (
            <button key={i} onClick={() => paginate(i + 1)} className="w-2/3 p-2 border border-slate-100 rounded-md hover:bg-blue-100">
          {i === 0 ? <FaChevronLeft/> : <FaChevronRight/>}
          </button>
        ))
      }
        </div>
        <span>sur 254</span>
      </div>
    </div>
    </>
  )
}

export default CustomTable
