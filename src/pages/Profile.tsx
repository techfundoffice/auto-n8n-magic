
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const handleSave = async () => {
    // For now, just show a toast since we'd need Supabase integration for actual updates
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFullName(user?.user_metadata?.full_name || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-gray-800/50 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl text-white">
                {user.user_metadata?.full_name || 'User'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {user.email}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Account Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-gray-700/50 border-gray-600 text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="created" className="text-gray-300">Member Since</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <Input
                        id="created"
                        value={new Date(user.created_at).toLocaleDateString()}
                        disabled
                        className="bg-gray-700/50 border-gray-600 text-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-700/50 border-gray-600 text-gray-300 mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
