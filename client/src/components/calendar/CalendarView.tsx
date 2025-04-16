import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CalendarViewProps {
  events: Event[];
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarView = ({ events }: CalendarViewProps) => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const { toast } = useToast();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddToCalendar = () => {
    toast({
      title: "Calendar Integration",
      description: "This feature will be available in the next update. Stay tuned!",
    });
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthDays = currentMonth === 0 
    ? getDaysInMonth(currentYear - 1, 11) 
    : getDaysInMonth(currentYear, currentMonth - 1);
  
  const calendarDays = [];
  
  // Add days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      currentMonth: false,
      isToday: false,
      events: []
    });
  }
  
  // Add days from current month
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = 
      i === today.getDate() && 
      currentMonth === today.getMonth() && 
      currentYear === today.getFullYear();
    
    // Filter events for this day
    const dayEvents = events.filter(event => {
      // For demonstration purposes, assuming event.date format is "Month Day" (e.g., "September 15")
      const eventDateParts = event.date.split(' ');
      if (eventDateParts.length >= 2) {
        const eventDay = parseInt(eventDateParts[1]);
        const eventMonthName = eventDateParts[0];
        const eventMonth = monthNames.findIndex(month => 
          month.toLowerCase().includes(eventMonthName.toLowerCase())
        );
        return eventDay === i && eventMonth === currentMonth;
      }
      return false;
    });
    
    calendarDays.push({
      day: i,
      currentMonth: true,
      isToday,
      events: dayEvents
    });
  }
  
  // Fill the remaining slots with days from next month
  const remainingSlots = 42 - calendarDays.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({
      day: i,
      currentMonth: false,
      isToday: false,
      events: []
    });
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-['Roboto_Slab'] font-bold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-neutral-100 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-neutral-100 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Days of the week */}
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-neutral-600 font-medium p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-1 h-24 border border-neutral-200 rounded-lg ${
                day.currentMonth ? '' : 'text-neutral-400'
              } ${day.isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm mb-1 ${day.isToday ? 'font-bold' : ''}`}>
                {day.day}
              </div>
              {day.events.slice(0, 2).map((event, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs rounded p-0.5 truncate mb-0.5 ${
                    event.featured
                      ? 'bg-[#FFD54F] text-[#002A5C]'
                      : 'bg-[#DAE5F2] text-[#002A5C]'
                  }`}
                >
                  {event.title}
                </div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-neutral-500 truncate">
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <h3 className="text-lg font-['Roboto_Slab'] font-bold mt-8 mb-4">Your Upcoming Events</h3>
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold">{event.title}</h4>
                <div className="flex items-center text-sm text-neutral-600 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {event.date}, {event.time}
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
              </div>
              <span className="bg-[#FFD54F] px-3 py-1 text-[#002A5C] text-sm font-medium rounded-full">
                RSVP'd
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4 text-center text-neutral-600">
          You have no upcoming events. Browse the Discover section to find events!
        </div>
      )}
      
      <div className="mt-6">
        <button 
          onClick={handleAddToCalendar}
          className="flex items-center text-[#002A5C] hover:underline focus:outline-none"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
