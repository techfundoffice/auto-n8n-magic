
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your personal information and account details
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                  Change Avatar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-white">Full Name</Label>
                  <Input
                    id="full-name"
                    defaultValue={user?.user_metadata?.full_name || ''}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-700 border-gray-600 text-white opacity-50"
                  />
                </div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-500" />
                Account Details
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your account information and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Account ID</span>
                <span className="text-white font-mono text-sm">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{new Date(user?.created_at || '').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Sign In</span>
                <span className="text-white">{new Date(user?.last_sign_in_at || '').toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
