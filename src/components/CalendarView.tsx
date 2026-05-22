/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Leaf, Award, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { MealData, UserPreferences } from '../types';
import { 
  getWeekDates, 
  getWeekOfMonth, 
  getKoreanDayOfWeek, 
  formatDateKey, 
  formatKoreanDate 
} from '../utils/dateUtils';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  meals: MealData[]; // 10 meals for the selected date's week (5 days * 2 meals)
  userPrefs: UserPreferences;
  onNavigateOffsetWeek: (offset: number) => void;
}

export default function CalendarView({
  selectedDate,
  onSelectDate,
  meals,
  userPrefs,
  onNavigateOffsetWeek
}: CalendarViewProps) {
  // Compute week range dates
  const weekDates = getWeekDates(selectedDate);
  const selectedDateKey = formatDateKey(selectedDate);

  // Extract the meals for the currently SELECTED date
  const dayMeals = meals.filter(m => m.dateKey === selectedDateKey);
  const lunch = dayMeals.find(m => m.mealType === '중식');
  const dinner = dayMeals.find(m => m.mealType === '석식');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      {/* Week Navigation Header */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-secondary font-semibold text-xs mb-1">씨마스 웰빙 식단</p>
          <motion.h2 
            key={selectedDateKey}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold tracking-tight text-primary font-headline-title"
          >
            {getWeekOfMonth(selectedDate)}
          </motion.h2>
        </div>
        
        {/* Toggle weeks buttons */}
        <div className="flex gap-1 bg-surface-container-low p-1.5 rounded-xl border border-surface-container-highest/60 shadow-inner">
          <button 
            id="btn-prev-week"
            onClick={() => onNavigateOffsetWeek(-7)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors active:scale-90 text-primary"
            title="이전 주"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button 
            id="btn-next-week"
            onClick={() => onNavigateOffsetWeek(7)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors active:scale-90 text-primary"
            title="다음 주"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Week Date Selector Row */}
      <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-2xl border border-surface-container shadow-inner">
        {weekDates.map((date) => {
          const isSelected = formatDateKey(date) === selectedDateKey;
          const dayName = getKoreanDayOfWeek(date);
          const dateNum = date.getDate();

          return (
            <button
              key={date.toISOString()}
              id={`day-${formatDateKey(date)}`}
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center justify-center w-[64px] py-3.5 rounded-xl transition-all duration-300 transform active:scale-95 ${
                isSelected
                  ? 'bg-primary text-on-primary font-bold shadow-md scale-105'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className={`text-[11px] mb-1.5 font-semibold ${
                isSelected ? 'text-on-primary' : 'text-on-surface-variant opacity-75'
              }`}>
                {dayName}
              </span>
              <span className={`text-base font-bold tracking-tight`}>
                {dateNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daily Selected Summary */}
      <p className="text-center text-xs font-semibold bg-surface-container-high/60 border border-surface-container-highest/20 text-on-surface-variant py-2.5 rounded-xl">
        🍽️ <strong className="text-primary">{formatKoreanDate(selectedDate)}</strong> 식단 목록 정보입니다.
      </p>

      {/* Lunch Card */}
      {lunch ? (
        <section className="bg-surface-container-lowest p-5 rounded-[24px] shadow-sm border border-surface-container border-opacity-70">
          <div className="flex justify-between items-start mb-3 border-b border-surface-container-high pb-3">
            <div>
              <span className="inline-block px-3 py-1 bg-primary-container text-on-primary bg-opacity-95 text-[10px] font-bold rounded-full mb-1.5">
                중식 (Lunch)
              </span>
              <h3 className="text-on-surface text-lg font-bold font-headline-title">
                {lunch.title}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-primary font-bold text-lg font-mono">{lunch.totalCalories}</span>
              <span className="text-on-surface-variant text-xs ml-0.5 font-bold font-mono">kcal</span>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-on-surface-variant font-medium text-[14px] leading-relaxed text-slate-700">
              {lunch.dishes.join(', ')}
            </p>
          </div>

          {/* Allergens listed as small dots/pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {lunch.allergens.map((aller, idx) => {
              const userHasThisAllergy = userPrefs.allergies.includes(aller);
              return (
                <div 
                  key={idx} 
                  className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-outline-variant/10 ${
                    userHasThisAllergy 
                      ? 'bg-red-500 text-white font-semibold' 
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${userHasThisAllergy ? 'bg-white' : 'bg-secondary'}`} />
                  <span className="text-[10px] font-bold">{aller}</span>
                </div>
              );
            })}
          </div>

          {/* Protein gauge metric */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant">
              <span className="flex items-center gap-1 text-primary">
                <Award className="w-3.5 h-3.5" />
                단백질 달성률
              </span>
              <span className="text-primary font-mono">{lunch.proteinRate || 85}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-container">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700" 
                style={{ width: `${lunch.proteinRate || 85}%` }}
              />
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-10 text-on-surface-variant">
          급식 데이터가 존재하지 않습니다.
        </div>
      )}

      {/* Dinner Card */}
      {dinner ? (
        <section className="bg-surface-container-lowest p-5 rounded-[24px] shadow-sm border border-surface-container border-opacity-70 opacity-95">
          <div className="flex justify-between items-start mb-3 border-b border-surface-container-high pb-3">
            <div>
              <span className="inline-block px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-full mb-1.5">
                석식 (Dinner)
              </span>
              <h3 className="text-on-surface text-lg font-bold font-headline-title opacity-90">
                {dinner.title}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-tertiary font-bold text-lg font-mono">{dinner.totalCalories}</span>
              <span className="text-on-surface-variant text-xs ml-0.5 font-bold font-mono">kcal</span>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-on-surface-variant/80 font-medium text-[14px] leading-relaxed text-slate-600">
              {dinner.dishes.join(', ')}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {dinner.allergens.map((aller, idx) => {
              const userHasThisAllergy = userPrefs.allergies.includes(aller);
              return (
                <div 
                  key={idx} 
                  className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-outline-variant/10 ${
                    userHasThisAllergy 
                      ? 'bg-red-500 text-white font-semibold' 
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${userHasThisAllergy ? 'bg-white' : 'bg-tertiary'}`} />
                  <span className="text-[10px] font-bold">{aller}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-on-surface-variant/70">
              <span className="flex items-center gap-0.5">
                <Award className="w-3.5 h-3.5 text-secondary" />
                단백질 달성률
              </span>
              <span className="font-mono text-secondary">{dinner.proteinRate || 60}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-container">
              <div 
                className="h-full bg-secondary rounded-full transition-all duration-700" 
                style={{ width: `${dinner.proteinRate || 60}%` }}
              />
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-10 text-on-surface-variant">
          급식 데이터가 존재하지 않습니다.
        </div>
      )}

      {/* Bottom Bento Layout Grids */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-primary-container p-4 rounded-3xl text-on-primary-container flex flex-col justify-between aspect-square active:scale-[0.98] transition-transform duration-100 shadow-sm">
          <Leaf className="w-8 h-8 text-on-primary" />
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">오늘의 영양</p>
            <p className="text-md font-bold leading-tight mt-0.5">유기농 로컬 식자재</p>
          </div>
        </div>
        
        <div className="bg-surface-container-high p-4 rounded-3xl text-on-surface-variant flex flex-col justify-between aspect-square active:scale-[0.98] transition-transform duration-100 border border-surface-container-highest shadow-sm">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider">권장 섭취량</p>
            <p className="text-md font-bold leading-tight text-on-surface mt-0.5">균형 잡힌 영양 성분</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
