import { useRecentContracts } from '@/hooks/useRecentContracts';
import { useLanguage } from '@/hooks/useLanguage';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useState } from 'react';

export default function AllContracts() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const { recent, isLoading } = useRecentContracts(10);

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        showMobile={showMobileSidebar}
        setShowMobile={setShowMobileSidebar}
        activePage="contracts"
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isRTL ? "mr-60" : "ml-60",
        isSidebarCollapsed && (isRTL ? "mr-16" : "ml-16"),
        "lg:mr-0 lg:ml-0",
        isRTL ? "lg:mr-60" : "lg:ml-60",
        isSidebarCollapsed && (isRTL ? "lg:mr-16" : "lg:ml-16")
      )}>
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('جميع العقود', 'All Contracts')}
          </h1>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Recent Contracts</h2>
              
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <p className="mb-4">Total recent contracts: {recent.length}</p>
                  <div className="space-y-2">
                    {recent.map((contract) => (
                      <div key={contract.id} className="p-4 border rounded-lg">
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-sm text-gray-600">
                          ID: {contract.id} | Party: {contract.partyName} | Date: {contract.date}
                        </div>
                        <div className="text-sm text-gray-600">
                          Last viewed: {contract.lastViewedAt || 'Never'}
                        </div>
                      </div>
                    ))}
                    {recent.length === 0 && (
                      <p className="text-gray-500">No recent contracts found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';