import { Link, useLocation } from "wouter";
import {
  Layout,
  Calendar,
  Lightbulb,
  Users,
  Clipboard
} from "lucide-react";

const NavigationTabs = () => {
  const [location] = useLocation();

  const tabs = [
    {
      name: "Discover",
      path: "/discover",
      icon: <Layout className="w-5 h-5" />,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "For You",
      path: "/recommendations",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      name: "Clubs",
      path: "/clubs",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Organizer",
      path: "/organizer",
      icon: <Clipboard className="w-5 h-5" />,
    },
  ];

  return (
    <div className="mb-8 border-b border-neutral-200">
      <nav className="flex space-x-1 md:space-x-4 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <Link 
            key={tab.path} 
            href={tab.path}
            className={`px-3 py-3 border-b-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
              location === tab.path
                ? "border-[#002A5C] text-[#002A5C]"
                : "border-transparent hover:text-[#002A5C]/70"
            }`}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;
