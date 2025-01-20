import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, Menu, Settings, User, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardTicker } from "@/components/dashboard-ticker"
import { NotificationCenter } from "@/components/notifications"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  userType: 'company' | 'agency' | 'staff'
}

export function DashboardLayout({ children, navItems, userType }: DashboardLayoutProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="EXTRASTAFF360 Logo" className="h-8 w-8" />
            <span className="font-bold">EXTRASTAFF360</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={router.pathname === item.href ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="flex items-center justify-between h-16 px-4 border-b">
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt="EXTRASTAFF360 Logo" className="h-8 w-8" />
                    <span className="font-bold">EXTRASTAFF360</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={router.pathname === item.href ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@username" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">username</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Ticker */}
        <DashboardTicker userType={userType} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

