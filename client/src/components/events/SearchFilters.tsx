import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { EventFilterOptions } from "@/types";

interface SearchFiltersProps {
  onFilterChange: (filters: EventFilterOptions) => void;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [date, setDate] = useState("Any Date");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChange({
      search: search || undefined,
      category: category !== "All Categories" ? category : undefined,
      location: location !== "All Locations" ? location : undefined,
      date: date !== "Any Date" ? date : undefined,
    });
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative md:w-1/3">
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleSubmit(e);
              }}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
            >
              <option>All Categories</option>
              <option>Academic</option>
              <option>Social</option>
              <option>Career</option>
              <option>Arts & Culture</option>
              <option>Sports</option>
              <option>Technology</option>
              <option>Research</option>
              <option>Networking</option>
            </select>
            
            <select 
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                handleSubmit(e);
              }}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
            >
              <option>All Locations</option>
              <option>St. George Campus</option>
              <option>Mississauga Campus</option>
              <option>Scarborough Campus</option>
              <option>Virtual</option>
              <option>Myhal Centre</option>
              <option>Bahen Centre</option>
              <option>Rotman School</option>
              <option>Hart House</option>
              <option>Robarts Library</option>
            </select>
            
            <select 
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                handleSubmit(e);
              }}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
            >
              <option>Any Date</option>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Weekend</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
