import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo or Name */}
        <div>
          <Link to="/" className="text-white font-bold text-xl">
            ShikshaSoladu
          </Link>
        </div>

        {/* Menu Links */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/deaf" className="text-white hover:text-gray-200">
              Deaf Community
            </Link>
          </li>
          <li>
            <Link to="/blind" className="text-white hover:text-gray-200">
              Blind Community
            </Link>
          </li>
          <li>
            <Link to="/allusers" className="text-white hover:text-gray-200">
              All Users
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
