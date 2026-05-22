/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import AppHeader from './components/AppHeader';
import BottomNavBar, { NavTab } from './components/BottomNavBar';
import HomeView from './components/HomeView';
import CalendarView from './components/CalendarView';
import NutritionView from './components/NutritionView';
import ProfileView from './components/ProfileView';

import { UserPreferences } from './types';
import { getTodayKST, getDefaultSelectedDate } from './utils/dateUtils';
import { generateMockDataForWeek, getRecommendationForDate } from './utils/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Calculates today's actual date in Asia/Seoul (KST)
  const todayKST = useMemo(() => getTodayKST(), []);

  // Set default starting date (if Saturday/Sunday, jump to next Monday)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return getDefaultSelectedDate(todayKST);
  });

  // Check if actual today is Saturday or Sunday
  const isWeekend = todayKST.getDay() === 0 || todayKST.getDay() === 6;

  // Dynamically generate the 5 days * 2 meals structure of KST calendar data based on the selected week
  const meals = useMemo(() => {
    return generateMockDataForWeek(selectedDate);
  }, [selectedDate]);

  // Extract the recommendation meal details
  const recommendation = useMemo(() => {
    return getRecommendationForDate(selectedDate);
  }, [selectedDate]);

  // Global user preferences with initial sample allergies to show warnings automatically
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    name: '김학생',
    gradeClass: '2학년 3반 15번',
    allergies: ['우유', '땅콩'], // Alerts will display on home/nutrition views
    allergyNotification: true,
    dailyNotification: true
  });

  const handleUpdatePrefs = (updated: Partial<UserPreferences>) => {
    setUserPrefs(prev => ({
      ...prev,
      ...updated
    }));
  };

  // Allows toggling next/prev week offsets inside the Calendar view
  const handleNavigateOffsetWeek = (offsetDays: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + offsetDays);
    setSelectedDate(nextDate);
  };

  return (
    <div className="bg-[#fffcf9] min-h-screen w-full flex justify-center items-start">
      {/* Container simulating a sleek mobile device shell center aligned */}
      <div className="w-full max-w-[420px] bg-background min-h-screen shadow-[0_0_40px_rgba(60,85,0,0.04)] border-x border-surface-container-highest flex flex-col relative pb-32">
        
        {/* Universal Top App bar */}
        <AppHeader />

        {/* View Router */}
        <main className="px-6 flex-1 flex flex-col gap-5 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView 
              today={todayKST}
              displayDate={isWeekend ? selectedDate : todayKST} // In weekend, show next Mon's schedule with "다음 급식일" badge
              isWeekend={isWeekend}
              meals={meals}
              recommendation={recommendation}
              userPrefs={userPrefs}
              onNavigateToProfile={() => setActiveTab('profile')}
            />
          )}

          {activeTab === 'schedule' && (
            <CalendarView 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              meals={meals}
              userPrefs={userPrefs}
              onNavigateOffsetWeek={handleNavigateOffsetWeek}
            />
          )}

          {activeTab === 'calculator' && (
            <NutritionView 
              today={todayKST}
              meals={meals}
              selectedDate={selectedDate}
              userPrefs={userPrefs}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              userPrefs={userPrefs}
              onUpdatePrefs={handleUpdatePrefs}
            />
          )}
        </main>

        {/* Dynamic bottom tabs navigation bar */}
        <BottomNavBar 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
        />
      </div>
    </div>
  );
}
