import { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ProfileSidebar = ({ isOpen, onClose, user }: ProfileSidebarProps) => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editableProfile, setEditableProfile] = useState<User>({ ...user });
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editableProfile);
      setShowProfileEdit(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !editableProfile.interests.includes(interest)) {
      setEditableProfile({
        ...editableProfile,
        interests: [...editableProfile.interests, interest]
      });
    }
  };

  const removeInterest = (index: number) => {
    const newInterests = [...editableProfile.interests];
    newInterests.splice(index, 1);
    setEditableProfile({
      ...editableProfile,
      interests: newInterests
    });
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-lg z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-['Roboto_Slab'] font-bold text-neutral-900">Your Profile</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Profile Info Section */}
        {!showProfileEdit ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div 
                className="h-16 w-16 bg-[#002A5C] text-white rounded-full flex items-center justify-center text-2xl font-medium"
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-neutral-600">{user.major}, {user.year}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Your Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-[#DAE5F2] text-[#002A5C] rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Upcoming Events</h4>
              <div className="space-y-3">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <p className="font-medium">Tech Career Fair</p>
                  <p className="text-sm text-neutral-600">Tomorrow, 2-5pm</p>
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <p className="font-medium">Entrepreneurship Workshop</p>
                  <p className="text-sm text-neutral-600">Friday, 3-5pm</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowProfileEdit(true)}
              className="w-full py-2 px-4 bg-[#002A5C] text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input 
                type="text" 
                value={editableProfile.name} 
                onChange={(e) => setEditableProfile({...editableProfile, name: e.target.value})}
                className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Major</label>
              <select 
                value={editableProfile.major}
                onChange={(e) => setEditableProfile({...editableProfile, major: e.target.value})}
                className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
              >
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Business</option>
                <option>Arts & Sciences</option>
                <option>Life Sciences</option>
                <option>Humanities</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Year</label>
              <select 
                value={editableProfile.year}
                onChange={(e) => setEditableProfile({...editableProfile, year: e.target.value})}
                className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Interests</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {editableProfile.interests.map((interest, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-1 bg-[#DAE5F2] text-[#002A5C] px-2 py-1 rounded-full"
                    >
                      <span>{interest}</span>
                      <button 
                        onClick={() => removeInterest(index)}
                        className="text-[#002A5C] hover:text-opacity-70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <select 
                  onChange={(e) => {
                    addInterest(e.target.value);
                    e.target.value = '';
                  }}
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#002A5C] focus:border-[#002A5C]"
                >
                  <option value="">Add an interest...</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Research">Research</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Social Justice">Social Justice</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={handleSaveProfile}
                className="flex-1 py-2 px-4 bg-[#002A5C] text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setEditableProfile({ ...user });
                  setShowProfileEdit(false);
                }}
                className="py-2 px-4 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;
