
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 w-full">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SidebarLayout;
