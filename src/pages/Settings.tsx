
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* API Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-500" />
                N8n API Configuration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure your n8n instance connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url" className="text-white">API URL</Label>
                <Input
                  id="api-url"
                  placeholder="https://your-n8n-instance.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-white">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Your n8n API key"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save API Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Workflow Execution Alerts</Label>
                  <p className="text-sm text-gray-400">Get notified when workflows fail</p>
                </div>
                <Switch />
              </div>
              <Separator className="bg-gray-600" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Credit Low Warnings</Label>
                  <p className="text-sm text-gray-400">Alert when credits are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-600" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Weekly Reports</Label>
                  <p className="text-sm text-gray-400">Receive weekly usage summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Security
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                Change Password
              </Button>
              <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
