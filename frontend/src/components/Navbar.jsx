import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-coffee-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:text-coffee-200 transition">
            <Coffee className="w-8 h-8" />
            <span className="text-xl font-bold">BeanMind AI</span>
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-coffee-200 transition">Dashboard</Link>
            <Link to="/cupping" className="hover:text-coffee-200 transition">New Cupping</Link>
            <Link to="/standards" className="hover:text-coffee-200 transition">SCA Standards</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
