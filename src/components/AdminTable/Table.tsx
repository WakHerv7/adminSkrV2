import { BsUiRadiosGrid } from 'react-icons/bs';
import { Button } from '../ui/button'
import { FourDots } from '../shared/icons';
import Link from 'next/link';
import ButtonOutlined from '../shared/ButtonOutlined';
import React from 'react';
import { BiTransferAlt } from 'react-icons/bi';
import { FaChevronLeft, FaChevronRight, FaSortDown, FaSortUp } from "react-icons/fa";
export interface ITableHeader {
	[key: string]: string;
}
export interface IGenericRow {
  [key: string]: any; //string | number | boolean | React.ReactNode; // Adjust according to your data types
}

export interface ISortState {
  keyToSort: string;
  order: 'asc' | 'desc';
}
export interface IMinMaxState {
  min?: number;
  max?: number;
}
type Props = {
  searchTerm?: string;
  data: IGenericRow[];
  headerData: ITableHeader;
};

const getSortedData = (arrayToSort: any[], sort:ISortState): any[] => {
  if (!Array.isArray(arrayToSort)) {
    throw new Error('arrayToSort must be an array');
  }
  if (typeof sort !== 'object' || !sort.hasOwnProperty('keyToSort') || !sort.hasOwnProperty('order')) {
    throw new Error('sort must be an object with properties keyToSort and order');
  }

  let sortOrder: number;
  switch (sort.order) {
    case 'asc':
      sortOrder = 1;
      break;
    case 'desc':
      sortOrder = -1;
      break;
    default:
      throw new Error(`Unsupported sort order: ${sort.order}`);
  }

  return arrayToSort.sort((a, b) => {
    // Handle JSX elements
    if (typeof a[sort.keyToSort] === "object" && typeof b[sort.keyToSort] === "object") {
      // Extract the underlying value using React.cloneElement to avoid unintended side effects
      const aValue = React.cloneElement(a[sort.keyToSort]).props.isActive ? 'Actif' : 'Inactif';
      const bValue = React.cloneElement(b[sort.keyToSort]).props.isActive ? 'Actif' : 'Inactif';
      return (aValue > bValue ? 1 : -1) * sortOrder;
    }

    // Handle other data types (string comparison with numeric sorting)
    if (typeof a[sort.keyToSort] === 'string' && typeof b[sort.keyToSort] === 'string') {
      return String(a[sort.keyToSort]).localeCompare(String(b[sort.keyToSort]), undefined, { numeric: true }) * sortOrder;
    }

    // Generic comparison for other data types
    return (a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1) * sortOrder;
  });
};

const filterData = (data: any[], searchTerm: string): any[] => {
  if (!searchTerm) {
    return data; // Return all items if no search term
  }

  return data.filter(item => {
    let found = false;
    Object.values(item).some(value => {
      if (typeof value === "object") {
        const val = React.cloneElement(value).props.isActive ? 'Actif' : 'Inactif';
        if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
            found = true;
        }
      } else if (typeof value === "string") {
        if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
          found = true;
        }
      }
    });
    return found;
  });
};


const AdminTable: React.FC<Props> = ({ searchTerm, data, headerData }) => {
  if (!data ||!headerData) return null;

  const [sort, setSort] = React.useState<ISortState>({ keyToSort: 'serial', order: 'asc'});
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsRange, setItemsRange] = React.useState<IMinMaxState>({ min: 1, max: currentPage * itemsPerPage});

  const handleHeaderClick = (headerKey: string | number) => {
    const { keyToSort, order } = sort;
    // Toggle the sorting order based on the current keyToSort and order
    const newOrder = order === 'asc'? 'desc' : 'asc';
    // Update the sorting state
    setSort({ keyToSort: String(headerKey), order: newOrder });
  };

// const getSortedData = (arrayToSort: any[], sort: { keyToSort: string, order: 'asc' | 'desc' }): any[] => {
  
  const sortedData = getSortedData(data, sort);
  const filteredData = filterData(sortedData, searchTerm.toLowerCase() || '');
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Calculate total pages

  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      let max = page * itemsPerPage;
      max = max > filteredData.length ? filteredData.length : max;
      let min = (page - 1) * itemsPerPage+1;
      // min = min < 1 ? 1 : min;
      setItemsRange({
        min: min,
        max: max,
      })
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const pageNumber = parseInt(e.target.value);
      if (pageNumber > 0 && pageNumber <= totalPages) {
        handlePageChange(e, pageNumber);
      }
    }
  };

  // const paginatedData = filteredData.slice(
  //   (currentPage - 1) * itemsPerPage, 
  //   (currentPage - 1) * itemsPerPage + filteredData.length
  // );
  
  const paginatedData = filteredData.slice(itemsRange.min-1, itemsRange.max);

  return (
    <div>
    <div className="w-full overflow-x-auto">
     {/* {JSON.stringify(Object.keys(headerData))} */}
    <table className="w-full">
      <thead className="bg-gray-800 py-6">
        <tr key={'th0'} className="h-10 rounded-md">

          {Object.keys(headerData)?.length ? Object.keys(headerData).map((key, index) => (
              <>
              <th key={index} 
              style={{whiteSpace: 'nowrap'}}
              className='px-2 text-start text-white font-semibold text-xs cursor-pointer' 
              onClick={() => handleHeaderClick(key)}>
                <span className='flex gap-2 items-center justify-between'>
                {headerData[key]}
                { !key.includes('edit') && !key.includes('action') ? 
                <span className='flex items-center cursor-pointer'>
                  {sort.keyToSort == key ?
                    sort.order =='asc' ?
                    <FaSortDown size={15} color={"#fff"} className='mb-2'/>
                    : <FaSortUp size={15} color={"#fff"} className=''/>
                    :<FaSortDown size={15} color={"#fff"} className='mb-2'/>}
                </span> : <></>}
                </span>
              </th>
              </>
          )): <></>}

        </tr>
      </thead>
      <tbody>
        {paginatedData.length !== 0 ? (
          paginatedData.map((row) => (
            <tr key={row.id} className="h-[50px] border-b border-gray-100 hover:bg-gray-50">
              {Object.keys(row).map((key, cellIndex) => (
                <td key={cellIndex} className="px-2 text-xs" style={{ whiteSpace: 'nowrap' }}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr style={{position:'relative'}}>
            <td colSpan={Object.keys(headerData)?.length} style={{display: 'table-cell', margin:'auto', paddingLeft:'50%'}} className=''>
            Aucun resultat
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
        {/* Footer content can be dynamic as well */}
      </tfoot>
    </table>
    </div>
    <div className='py-10 text-sm flex justify-between items-center'>
      
      {filteredData ? 
      <>
      <div>Résultats: <strong>{itemsRange.min} - {itemsRange.max} / {filteredData.length }</strong></div>
      <div className="flex items-center gap-3">
        <span>Aller à la page</span>
        <Link href="" style={{display:currentPage === 1? 'none': ''}} onClick={(e) => handlePageChange(e, currentPage - 1)}>
          <FaChevronLeft />
        </Link>
        <div className="py-2 px-2 w-[70px] bg-gray-200 rounded-2xl text-center flex justify-center">
          <input
            value={currentPage} // Update input value with current page
            type="number"
            min={1}
            max={totalPages}
            className="w-full bg-gray-200 border-none outline-none text-center"
            // onChange={(e) => handlePageChange(parseInt(e.target.value))} // Update page on input change
            // ref={inputRef} // Assign the ref
            onKeyDown={(e)=>handleKeyPress} // Add event handler for key press
          />
        </div>
        <Link href="" style={{display:currentPage === totalPages? 'none': ''}} onClick={(e) => handlePageChange(e, currentPage + 1)}>
          <FaChevronRight />
        </Link>
        <span>sur {totalPages}</span>
      </div>
      </>
      :<></>}
    </div>
    </div>
  );
};

export default AdminTable;


