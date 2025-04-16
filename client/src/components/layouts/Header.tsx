import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-[#002A5C] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-xl font-['Roboto_Slab'] font-bold">CampusConnect UofT</h1>
          </div>
        </Link>
        
        <div className="flex items-center">
          <Link href="/profile">
            <button className="bg-white/10 py-1 px-3 rounded-full hover:bg-white/20 transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
