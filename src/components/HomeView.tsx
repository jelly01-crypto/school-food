/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Sun, Moon, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import { MealData, RecommendationInfo, UserPreferences } from '../types';
import { formatKoreanDate } from '../utils/dateUtils';

interface HomeViewProps {
  today: Date;
  displayDate: Date;
  isWeekend: boolean;
  meals: MealData[];
  recommendation: RecommendationInfo;
  userPrefs: UserPreferences;
  onNavigateToProfile: () => void;
}

export default function HomeView({
  today,
  displayDate,
  isWeekend,
  meals,
  recommendation,
  userPrefs,
  onNavigateToProfile
}: HomeViewProps) {
  // Extract Lunch and Dinner for the displayDate
  const lunch = meals.find(m => m.mealType === '중식');
  const dinner = meals.find(m => m.mealType === '석식');

  // Verify allergies in meals
  const checkAllergies = (allergens: string[]) => {
    return allergens.filter(allergen => userPrefs.allergies.includes(allergen));
  };

  const lunchAllergyHits = lunch ? checkAllergies(lunch.allergens) : [];
  const dinnerAllergyHits = dinner ? checkAllergies(dinner.allergens) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      {/* Dynamic Header Info */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center gap-2">
          {isWeekend ? (
            <span className="bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              주말 알림 ⏰
            </span>
          ) : (
            <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider">
              씨마스고 실시간 식단 🌿
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-on-background">
          {formatKoreanDate(displayDate)}
        </h2>
        {isWeekend && (
          <p className="text-xs text-on-surface-variant font-medium text-amber-700 mt-1 bg-amber-50 rounded-lg p-2 flex items-start gap-1.5 border border-amber-100">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>오늘은 주말이므로 가장 가까운 <strong>다음 급식일(월요일)</strong> 식단표를 미리 보여 드립니다.</span>
          </p>
        )}
      </div>

      {/* Hero Meal Card (Best recommendation) */}
      <section className="relative">
        <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden custom-shadow active:scale-[0.99] transition-all duration-200 border border-surface-container-highest">
          <div className="relative h-56 w-full overflow-hidden">
            <img 
              alt={recommendation.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              src={recommendation.image}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                isWeekend 
                  ? 'bg-secondary text-white' 
                  : 'bg-primary text-on-primary'
              }`}>
                {isWeekend ? '다음 급식일 추천' : '오늘의 추천 급식'}
              </span>
              
              {isWeekend && (
                <span className="bg-amber-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  NEXT WEEK
                </span>
              )}
            </div>
            
            {/* Soft dark shadow at bottom of image for contrast */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2 gap-4">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  {isWeekend ? 'MONDAY TOP BANNER' : 'TODAY SPECIAL'}
                </p>
                <h3 className="text-xl font-bold text-on-surface mt-0.5">
                  {recommendation.title}
                </h3>
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-xl text-center flex-shrink-0 shadow-sm border border-secondary-container/50">
                <span className="font-bold text-sm block">{recommendation.calories}</span>
                <span className="text-[10px] opacity-80 font-bold block">kcal</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-body-md leading-relaxed text-slate-600">
              {recommendation.description}
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Menus (Lunch / Dinner) */}
      <section className="grid grid-cols-1 gap-5">
        
        {/* Lunch Card */}
        {lunch && (
          <div className="bg-surface-container-lowest rounded-[24px] p-5 custom-shadow border border-surface-container-highest">
            <div className="flex items-center justify-between mb-3 border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed-dim/60 flex items-center justify-center text-primary shadow-sm">
                  <Sun className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">중식 (Lunch)</h3>
              </div>
              <span className="text-primary font-bold text-sm font-mono tracking-wide">{lunch.totalCalories} kcal</span>
            </div>

            {/* Allergy warn hit banner */}
            {userPrefs.allergyNotification && lunchAllergyHits.length > 0 && (
              <div className="mb-3 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-xs text-red-700 font-medium">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">알레르기 경보! </span>
                  내 알레르기 유발인자 <strong className="underline font-bold">({lunchAllergyHits.join(', ')})</strong> 가 중식에 포함되어 있습니다. 주의하세요!
                </div>
              </div>
            )}

            <div className="bg-surface-container-low rounded-2xl p-4 mb-4 border border-surface-container">
              <p className="text-on-surface text-[15px] font-medium leading-relaxed tracking-wide text-stone-700">
                {lunch.dishes.join(', ')}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {lunch.allergens.map((aller, idx) => {
                const isHit = userPrefs.allergies.includes(aller);
                return (
                  <span 
                    key={idx} 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isHit 
                        ? 'bg-red-500 text-white font-bold shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'
                    }`}
                  >
                    {aller}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Dinner Card */}
        {dinner && (
          <div className="bg-surface-container-lowest rounded-[24px] p-5 custom-shadow border border-surface-container-highest">
            <div className="flex items-center justify-between mb-3 border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/60 flex items-center justify-center text-tertiary shadow-sm">
                  <Moon className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">석식 (Dinner)</h3>
              </div>
              <span className="text-tertiary font-bold text-sm font-mono tracking-wide">{dinner.totalCalories} kcal</span>
            </div>

            {/* Allergy warn hit banner */}
            {userPrefs.allergyNotification && dinnerAllergyHits.length > 0 && (
              <div className="mb-3 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-xs text-red-700 font-medium">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">알레르기 경보! </span>
                  내 알레르기 유발인자 <strong className="underline font-bold">({dinnerAllergyHits.join(', ')})</strong> 가 석식에 포함되어 있습니다. 주의하세요!
                </div>
              </div>
            )}

            <div className="bg-surface-container-low rounded-2xl p-4 mb-4 border border-surface-container">
              <p className="text-on-surface text-[15px] font-medium leading-relaxed tracking-wide text-stone-700">
                {dinner.dishes.join(', ')}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {dinner.allergens.map((aller, idx) => {
                const isHit = userPrefs.allergies.includes(aller);
                return (
                  <span 
                    key={idx} 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isHit 
                        ? 'bg-red-500 text-white font-bold shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'
                    }`}
                  >
                    {aller}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Profile quick allergy navigation button */}
      <section className="mb-4">
        <button 
          onClick={onNavigateToProfile}
          className="w-full bg-primary text-on-primary rounded-[24px] p-5 flex items-center justify-between shadow-md active:scale-[0.98] transition-all text-left hover:opacity-95"
        >
          <div className="pr-4">
            <h4 className="font-bold text-md mb-1 flex items-center gap-1.5">
              <span>우리 학교 알러지 정보</span>
              {userPrefs.allergies.length > 0 && (
                <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-black px-1.5 py-0.5 rounded-md">
                  {userPrefs.allergies.length}개 설정됨
                </span>
              )}
            </h4>
            <p className="text-xs opacity-85 leading-relaxed">
              개인 프로필에서 설정한 알레르기 요인이 식단에 포함되면 홈 화면에서 즉시 알려드리고 있어요. 설정 페이지로 이동하세요.
            </p>
          </div>
          <div className="bg-primary-fixed text-on-primary-fixed w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
            <ArrowRight className="w-5 h-5 text-primary stroke-[2.5]" />
          </div>
        </button>
      </section>
    </motion.div>
  );
}
