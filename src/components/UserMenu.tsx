
import { useState } from 'react';
import { User, LogOut, Settings, ChevronDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleBilling = () => {
    setIsOpen(false);
    navigate('/billing');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-gray-800/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm">
            {user.user_metadata?.full_name || user.email}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
        <DropdownMenuLabel className="text-gray-300">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleProfile}
          className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleBilling}
          className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing & Credits</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSettings}
          className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-400 hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
