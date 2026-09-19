import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Cpu, 
  User, 
  LogOut, 
  CheckCircle2, 
  ChevronDown, 
  Flame,
  Menu,
  X,
  Compass,
  Building2,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { isLiveFirebaseConfigured } from '../services/firebaseConfig';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenFirebaseModal: () => void;
  onOpenAuthModal: () => void;
  onOpenTechModal: () => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUpload,
  onOpenSearch,
  onOpenNotifications,
  onOpenFirebaseModal,
  onOpenAuthModal,
  onOpenTechModal,
  onSwitchRole,
  onLogout,
  unreadCount,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [dashMenuOpen, setDashMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const liveFirebase = isLiveFirebaseConfigured();

  const dashDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashDropdownRef.current && !dashDropdownRef.current.contains(event.target as Node)) {
        setDashMenuOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'projects', label: 'Discover Projects' },
    { id: 'upload', label: 'Upload Project' },
    { id: 'analysis', label: 'Project DNA' },
    { id: 'about', label: 'About' },
    { id: 'login', label: 'Login' }
  ];

  // 4 Core Role Dashboards for top-right quick switcher
  const roleDashboards = [
    { 
      id: 'student-dashboard', 
      label: 'Student Dashboard', 
      role: 'student' as UserRole, 
      icon: GraduationCap,
      description: 'Upload & develop projects, track Afterlife progress'
    },
    { 
      id: 'mentor-dashboard', 
      label: 'Mentor Dashboard', 
      role: 'mentor' as UserRole, 
      icon: Compass,
      description: 'Guide student innovations, technical review & matching'
    },
    { 
      id: 'industry-dashboard', 
      label: 'Industry Dashboard', 
      role: 'industry' as UserRole, 
      icon: Building2,
      description: 'Discover emerging innovations & pilot collaborations'
    },
    { 
      id: 'admin-dashboard', 
      label: 'Admin Dashboard', 
      role: 'admin' as UserRole, 
      icon: ShieldCheck,
      description: 'Ecosystem telemetry, verification & university hubs'
    },
  ];

  const isDashboardActive = activeTab === 'dashboard' || activeTab.includes('-dashboard');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/90 text-slate-800 shadow-[0_2px_15px_-3px_rgba(124,77,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none shrink-0" 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B76BE8] via-[#7C4DFF] to-[#6366F1] flex items-center justify-center shadow-md shadow-purple-500/25">
              <Sparkles className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">Project IdeaTec</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full hidden sm:inline-block">AI Ecosystem</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden xl:block leading-tight font-medium">Give Every Student Project a Second Life</p>
            </div>
          </div>

          {/* Desktop Main Navigation Links (Clean, No Dashboard links here) */}
          <nav className="hidden lg:flex items-center space-x-1 ml-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                    isActive 
                      ? 'bg-purple-100/80 text-purple-800 border border-purple-200/70 shadow-xs' 
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Top-Right Header Actions (Permanently Visible) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Quick Search Button */}
            <button
              id="navbar-search-btn"
              onClick={onOpenSearch}
              title="Search Projects & Mentors"
              className="p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Architecture Modal */}
            <button
              id="navbar-tech-btn"
              onClick={onOpenTechModal}
              title="System Architecture Specs"
              className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/70 rounded-xl transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <span>Arch</span>
            </button>

            {/* Firebase Status Badge */}
            <button
              id="navbar-firebase-btn"
              onClick={onOpenFirebaseModal}
              title={liveFirebase ? "Live Firebase Cloud Connected" : "Local Database Mode"}
              className={`hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                liveFirebase 
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80' 
                  : 'bg-purple-50/50 text-slate-600 border-purple-100 hover:bg-purple-50'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${liveFirebase ? 'text-amber-500 fill-amber-500' : 'text-purple-400'}`} />
              <span>{liveFirebase ? 'Live DB' : 'Local DB'}</span>
            </button>

            {/* ========================================================= */}
            {/* 🌟 PERMANENT TOP-RIGHT DASHBOARD SWITCHER DROPDOWN */}
            {/* ========================================================= */}
            <div className="relative" ref={dashDropdownRef}>
              <button
                id="navbar-dashboard-switcher-btn"
                onClick={() => setDashMenuOpen(!dashMenuOpen)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs select-none ${
                  isDashboardActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-300'
                    : 'bg-purple-50/90 hover:bg-purple-100 text-purple-900 border border-purple-200/90'
                }`}
                title="Switch between Student, Mentor, Industry, and Admin Dashboards"
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${isDashboardActive ? 'text-white' : 'text-purple-700'}`} />
                <span className="tracking-tight">Dashboard</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${dashMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Instant Dashboard Selection Dropdown */}
              {dashMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-purple-100/90 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-purple-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">Role Dashboards</span>
                      <p className="text-xs font-bold text-slate-900">Select Platform Perspective</p>
                    </div>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200/80">
                      Instant Switch
                    </span>
                  </div>

                  <div className="py-2 space-y-1">
                    {roleDashboards.map((dt) => {
                      const IconC = dt.icon;
                      const isCurrentActive = activeTab === dt.id || (activeTab === 'dashboard' && currentUser?.role === dt.role);

                      return (
                        <button
                          key={dt.id}
                          id={`nav-switch-${dt.id}`}
                          onClick={() => {
                            onSwitchRole(dt.role);
                            setActiveTab(dt.id);
                            setDashMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-3 ${
                            isCurrentActive
                              ? 'bg-purple-50 border border-purple-200/90 text-purple-950 shadow-2xs'
                              : 'hover:bg-purple-50/70 text-slate-700 border border-transparent'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isCurrentActive ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-100 text-purple-700'
                          }`}>
                            <IconC className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isCurrentActive ? 'text-purple-900' : 'text-slate-900'}`}>
                                {dt.label}
                              </span>
                              {isCurrentActive && (
                                <span className="flex items-center space-x-1 text-[10px] font-extrabold text-purple-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                                  <span>Active</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {dt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Action Button */}
                  <div className="pt-2 border-t border-purple-50 mt-1">
                    <button
                      id="nav-go-to-dashboard-direct-btn"
                      onClick={() => {
                        const targetTab = activeTab.includes('dashboard') 
                          ? activeTab 
                          : `${currentUser?.role || 'student'}-dashboard`;
                        setActiveTab(targetTab);
                        setDashMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm shadow-purple-500/25"
                    >
                      <span>Go to {currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard` : 'Dashboard'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Get Started CTA */}
            <button
              id="navbar-get-started-btn"
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 rounded-xl shadow-md shadow-purple-500/25 transition-all shrink-0"
            >
              <span>Get Started</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="navbar-notif-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors hidden sm:block"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Profile Pill Menu */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                id="navbar-user-menu-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-1.5 sm:space-x-2 pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200/80 rounded-xl text-xs transition-colors"
              >
                {currentUser?.photoUrl ? (
                  <img src={currentUser.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-300" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="font-semibold text-slate-800 leading-tight truncate max-w-[85px]">
                    {currentUser?.fullName?.split(' ')[0] || 'Account'}
                  </div>
                  <div className="text-[10px] text-purple-700 font-bold uppercase">
                    {currentUser?.role || 'Guest'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-purple-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-4 py-2 border-b border-purple-50">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200/80">
                      {currentUser?.role} Account
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-purple-700 hover:bg-purple-50 flex items-center space-x-2 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-purple-500" />
                      <span>Sign In with Another Account</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('register');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-purple-700 hover:bg-purple-50 flex items-center space-x-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>Create New Account</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reset / Switch Demo User</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="navbar-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Clean: No Dashboard links or role portals here) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-purple-100 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === item.id
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'text-slate-600 bg-purple-50/40 hover:bg-purple-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}
              className="text-purple-700 hover:text-purple-900"
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setMobileMenuOpen(false); }}
              className="text-purple-700 hover:text-purple-900"
            >
              Register
            </button>
            <button
              onClick={onOpenTechModal}
              className="text-slate-500 hover:text-purple-700"
            >
              System Architecture
            </button>
          </div>
        </div>
      )}

      {/* Mobile Horizontal Navigation Sub-bar */}
      <div className="lg:hidden flex items-center space-x-1 px-4 py-2 border-t border-purple-100 overflow-x-auto scrollbar-none text-xs bg-purple-50/30">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-semibold ${
              activeTab === item.id
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
