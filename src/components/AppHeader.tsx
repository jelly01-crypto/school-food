/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Utensils, Bell } from 'lucide-react';
import { useState } from 'react';

interface AppHeaderProps {
  notificationCount?: number;
}

export default function AppHeader({ notificationCount = 1 }: AppHeaderProps) {
  const [bellClicked, setBellClicked] = useState(false);

  const handleNotifClick = () => {
    setBellClicked(true);
    setTimeout(() => setBellClicked(false), 500);
    alert('새로운 급식 소식: 오늘의 급식 영양 가이드를 읽어보세요!');
  };

  return (
    <header className="bg-background font-headline-title text-headline-title text-primary sticky top-0 flex justify-between items-center w-full max-w-[420px] mx-auto z-50 px-6 py-4 border-b border-surface-container-highest bg-opacity-90 backdrop-blur-md">
      <div className="flex items-center gap-2 select-none">
        <Utensils className="w-5 h-5 text-primary stroke-[2.5]" />
        <h1 className="font-bold text-lg tracking-tight text-primary">씨마스고등학교 급식</h1>
      </div>
      
      <button 
        id="btn-bell"
        onClick={handleNotifClick}
        className={`relative p-2 rounded-full hover:bg-surface-container transition-all duration-200 active:scale-95 text-primary ${
          bellClicked ? 'animate-bounce text-surface-tint' : ''
        }`}
        aria-label="알림"
      >
        <Bell className="w-5 h-5 stroke-[2.5]" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white border border-white" />
        )}
      </button>
    </header>
  );
}
