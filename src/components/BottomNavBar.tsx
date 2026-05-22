/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Calendar, Calculator, User } from 'lucide-react';

export type NavTab = 'home' | 'schedule' | 'calculator' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export default function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  const navItems = [
    { id: 'home' as NavTab, label: '홈', icon: Home },
    { id: 'schedule' as NavTab, label: '식단표', icon: Calendar },
    { id: 'calculator' as NavTab, label: '영양계산', icon: Calculator },
    { id: 'profile' as NavTab, label: '프로필', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[420px] mx-auto z-50 flex justify-around items-center px-4 py-3 pb-6 bg-surface border-t border-surface-container-highest shadow-[0_-4px_12px_rgba(73,104,0,0.06)] rounded-t-2xl">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-95 px-4 py-1.5 rounded-full ${
              isActive
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-secondary-container dark:text-on-secondary-fixed-variant opacity-75 hover:opacity-100 hover:bg-secondary-container/30'
            }`}
          >
            <IconComponent 
              className={`w-5 h-5 ${
                isActive ? 'stroke-[2.5]' : 'stroke-2'
              }`} 
            />
            <span className="text-[11px] font-label-sm mt-0.5 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
