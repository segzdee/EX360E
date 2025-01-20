import React, { useState } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Users, Briefcase, Calendar, TrendingUp,
  ChevronRight, X, Bell, Search, Filter,
  UserPlus, ClipboardList, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AgencyMetrics {
  totalStaff: number;
  activeJobs: number;
  monthlyRevenue: number;
  placementRate: number;
  staffBreakdown: Array<{
    category: string;
    value: number;
    color: string;
  }>;
  revenueData: Array<{
    month: string;
    amount: number;
  }>;
}

interface AgencyDashboardProps {
  children: React.ReactNode;
  metrics?: AgencyMetrics;
}

const defaultMetrics: AgencyMetrics = {
  totalStaff: 150,
  activeJobs: 45,
  monthlyRevenue: 85000,
  placementRate: 78,
  staffBreakdown: [
    { category: 'Bartenders', value: 30, color: '#FF6B6B' },
    { category: 'Servers', value: 45, color: '#4ECDC4' },
    { category: 'Chefs', value: 25, color: '#45B7D1' }
  ],
  revenueData: [
    { month: 'Jan', amount: 65000 },
    { month: 'Feb', amount: 72000 },
    { month: 'Mar', amount: 85000 }
  ]
};

export default function AgencyDashboard({ 
  children,
  metrics = defaultMetrics
}: AgencyDashboardProps) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<'staff' | 'jobs' | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const SidePanel = () => (
    <Sheet open={showSidePanel} onOpenChange={setShowSidePanel}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {sidePanelContent === 'staff' ? 'Staff Management' : 'Job Management'}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {sidePanelContent === 'staff' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Staff</h3>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full" />
                          <div>
                            <div className="font-medium">Staff Member {i}</div>
                            <div className="text-sm text-gray-500">Bartender</div>
                          </div>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Jobs</h3>
                <Button size="sm">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Job Position {i}</div>
                          <div className="text-sm text-gray-500">Company Name</div>
                        </div>
                        <Badge variant="outline">3 Openings</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="placements">Placements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => {
                    setSidePanelContent('staff');
                    setShowSidePanel(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalStaff}</div>
                    <div className="text-xs text-muted-foreground">+2% from last month</div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSidePanelContent('jobs');
                    setShowSidePanel(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.activeJobs}</div>
                    <div className="text-xs text-muted-foreground">12 new this week</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
                    <div className="text-xs text-muted-foreground">+15% from last month</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.placementRate}%</div>
                    <div className="text-xs text-muted-foreground">+5% from last month</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.revenueData}>
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                          />
                          <Tooltip 
                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Staff Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.staffBreakdown}
                            dataKey="value"
                            nameKey="category"
                            innerRadius={60}
                            outerRadius={80}
                          >
                            {metrics.staffBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional content */}
              {children}
            </TabsContent>

            <TabsContent value="staff">
              {/* Staff management content */}
            </TabsContent>

            <TabsContent value="jobs">
              {/* Jobs management content */}
            </TabsContent>

            <TabsContent value="placements">
              {/* Placements content */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel />
    </div>
  );
}