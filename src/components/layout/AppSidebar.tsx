
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { 
  LayoutDashboard, 
  Zap, 
  Activity, 
  TestTube, 
  CreditCard,
  Settings,
  User,
  Plus,
  Eye,
  History,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CreditPurchaseButton from '@/components/CreditPurchaseButton';
import UserMenu from '@/components/UserMenu';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    workflows: false,
    monitoring: false,
    testing: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      isActive: isActive('/dashboard')
    },
    {
      title: 'Workflows',
      icon: Zap,
      key: 'workflows',
      isActive: isParentActive(['/workflows']),
      subItems: [
        { title: 'All Workflows', path: '/workflows', icon: Eye },
        { title: 'Create New', path: '/workflows/create', icon: Plus }
      ]
    },
    {
      title: 'Monitoring',
      icon: Activity,
      key: 'monitoring',
      isActive: isParentActive(['/monitoring']),
      subItems: [
        { title: 'Live Executions', path: '/monitoring', icon: Activity },
        { title: 'History', path: '/monitoring/history', icon: History }
      ]
    },
    {
      title: 'Testing',
      icon: TestTube,
      key: 'testing',
      isActive: isParentActive(['/testing']),
      subItems: [
        { title: 'API Tests', path: '/testing', icon: TestTube },
        { title: 'Connection Status', path: '/testing/status', icon: CheckCircle }
      ]
    },
    {
      title: 'Billing',
      icon: CreditCard,
      path: '/billing',
      isActive: isActive('/billing')
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      isActive: isActive('/settings')
    },
    {
      title: 'Profile',
      icon: User,
      path: '/profile',
      isActive: isActive('/profile')
    }
  ];

  return (
    <Sidebar className="bg-gray-900 border-gray-700">
      <SidebarHeader className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-white">AutoN8n</span>
          </div>
          <SidebarTrigger className="text-gray-400 hover:text-white" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible open={openMenus[item.key!]} onOpenChange={() => toggleMenu(item.key!)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full ${item.isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton 
                                onClick={() => navigate(subItem.path)}
                                className={isActive(subItem.path) ? 'bg-blue-600/50 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      onClick={() => navigate(item.path!)}
                      className={`w-full ${item.isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-700 p-4 space-y-3">
        {/* Credits Display */}
        <div className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-white font-medium text-sm">{credits}</span>
          </div>
          <CreditPurchaseButton />
        </div>

        {/* User Menu */}
        <div className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm truncate max-w-32">
              {user?.user_metadata?.full_name || user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white p-1 h-auto"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
