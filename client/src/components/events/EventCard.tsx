import { Clock, MapPin } from "lucide-react";
import { Event } from "@/types";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:translate-y-[-4px] hover:shadow-md transition duration-300">
      {event.imageUrl && (
        <img
          className="h-40 w-full object-cover"
          src={event.imageUrl}
          alt={event.title}
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold">{event.title}</h3>
          <span className="bg-[#DAE5F2] text-[#002A5C] text-xs px-2 py-1 rounded-full">
            {event.date}
          </span>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{event.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-neutral-600">
            <Clock className="h-4 w-4 mr-1" />
            {event.time}
          </div>
          <Link 
            href={`/events/${event.id}`}
            className="text-[#002A5C] font-medium text-sm hover:text-opacity-80 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
