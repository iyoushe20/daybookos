import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  Users,
  LineChart,
  Link2,
  UserCog,
  User
} from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Badge } from './ui/badge';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  managerOnly?: boolean;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logs', label: 'Logs', icon: FileText },
  { 
    href: '/tasks', 
    label: 'Tasks', 
    icon: CheckSquare,
    children: [
      { href: '/tasks/today', label: "Today's Plan" },
      { href: '/tasks', label: 'All Tasks' },
    ]
  },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/manager', label: 'Team', icon: Users, managerOnly: true },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
];

export function MainNav() {
  const location = useLocation();
  const { user, logout, isManager, switchRole } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter nav items based on role
  const visibleNavItems = navItems.filter(item => !item.managerOnly || isManager);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.href || 
                location.pathname.startsWith(item.href + '/');
              
              if (item.children) {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "gap-1 px-3",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link to={child.href}>{child.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "gap-2 px-3",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Role indicator */}
          <Badge variant="outline" className="hidden sm:flex gap-1 text-xs">
            {isManager ? <UserCog className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isManager ? 'Manager' : 'IC'}
          </Badge>

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
              <DropdownMenuSeparator />
              
              {/* Role Switcher */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Work Mode
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup 
                value={user?.role || 'individual'} 
                onValueChange={(value) => switchRole(value as UserRole)}
              >
                <DropdownMenuRadioItem value="individual" className="gap-2">
                  <User className="h-4 w-4" />
                  Individual Contributor
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="manager" className="gap-2">
                  <UserCog className="h-4 w-4" />
                  Manager View
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/projects">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Projects
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/integrations">
                  <Link2 className="mr-2 h-4 w-4" />
                  Integrations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
