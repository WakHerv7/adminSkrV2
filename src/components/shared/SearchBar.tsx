import { Input } from '../ui/input'
import { IoIosSearch } from 'react-icons/io'


interface SearchProps {
  searchTerm?: string; 
  onChange?: any;
}

const SearchBar: React.FC<SearchProps> = ({ searchTerm, onChange }) => {

  return (
    <div className='flex bg-gray-100 w-full rounded-md'>
      <span className='flex justify-center items-center px-4'>
        <IoIosSearch size={25} color='#d1d1d1' />
      </span>
      <form id='search-form' role='search' className='w-full'>
        <Input
          type='search'
          defaultValue={searchTerm}
          placeholder='Rechercher ...'
          className='bg-inherit text-sm text-gray-700 font-medium ring ring-transparent h-[33px] w-full border-none'
          aria-label='search'
          id='search'
          name='search'
          onChange={onChange}
        />      
      </form>
    </div>
  )
}

export default SearchBar
