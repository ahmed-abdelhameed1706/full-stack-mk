// Navbar.js
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const {location} = useLocation();
  console.log(location);
  if (location === '/room') return null;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold cursor-pointer"><Link to='/'><img src="/mkletters.png" alt="Logo" className='w-12 h-12'/></Link></div>
      <div className="flex items-center md:w-1/2 mx-4 text-black xs:w-3/4">
        
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Search Rooms By Name..."
        />
        <button className="ml-2 p-2 bg-gray-700 text-white rounded transition-all duration-300 hover:bg-gray-600 hover:text-gray-200">
          Search
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
