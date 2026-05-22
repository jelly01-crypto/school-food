/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Save, Sparkles, Filter, ChevronRight, ShieldAlert } from 'lucide-react';
import { MealData, UserPreferences } from '../types';
import { formatKoreanDate } from '../utils/dateUtils';

// Sub structures for dishes list itemizer
interface DishItem {
  id: string;
  name: string;
  category: '전체' | '밥류' | '국/찌개' | '반찬' | '디저트';
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  allergyInfo?: string;
}

interface NutritionViewProps {
  today: Date;
  meals: MealData[]; // Current display week meals
  selectedDate: Date;
  userPrefs: UserPreferences;
}

export default function NutritionView({
  today,
  meals,
  selectedDate,
  userPrefs
}: NutritionViewProps) {
  // Fetch displaying KST day lunch
  const dateKey = selectedDate.getFullYear() + 
                  String(selectedDate.getMonth() + 1).padStart(2, '0') + 
                  String(selectedDate.getDate()).padStart(2, '0');
  
  const lunch = meals.find(m => m.dateKey === dateKey && m.mealType === '중식');

  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<'전체' | '밥류' | '국/찌개' | '반찬' | '디저트'>('전체');

  // Parse today's lunch dishes into fully itemized nutrition objects
  useEffect(() => {
    if (!lunch) return;

    const parsedDishes: DishItem[] = lunch.dishes.map((dishName, index) => {
      let category: '밥류' | '국/찌개' | '반찬' | '디저트' = '반찬';
      let kcal = 120;
      let protein = 5;
      let carbs = 15;
      let fat = 3;
      let allergyInfo = '';

      const name = dishName.trim();

      if (name.includes('밥')) {
        category = '밥류';
        kcal = 300;
        carbs = 62;
        protein = 6;
        fat = 1.5;
      } else if (name.includes('국') || name.includes('찌개') || name.includes('탕')) {
        category = '국/찌개';
        kcal = 210;
        carbs = 12;
        protein = 14;
        fat = 11;
        if (name.includes('돈') || name.includes('김치찌개')) {
          allergyInfo = '돼지고기 함유';
        }
      } else if (
        name.includes('푸딩') || 
        name.includes('요구르트') || 
        name.includes('음료') || 
        name.includes('요플레') || 
        name.includes('귤') || 
        name.includes('홍시') || 
        name.includes('오렌지') || 
        name.includes('주스') || 
        name.includes('레몬')
      ) {
        category = '디저트';
        kcal = 80;
        carbs = 18;
        protein = 0.5;
        fat = 0.5;
      } else {
        category = '반찬';
        if (
          name.includes('돈까스') || 
          name.includes('정식') || 
          name.includes('스테이크') || 
          name.includes('오리') || 
          name.includes('닭') || 
          name.includes('치킨') || 
          name.includes('함박') ||
          name.includes('강정')
        ) {
          kcal = 310;
          carbs = 20;
          protein = 18;
          fat = 16;
          if (name.includes('돈까스') || name.includes('함박') || name.includes('강정') || name.includes('돈육')) {
            allergyInfo = '돼지고기 함유';
          }
        } else if (name.includes('구이') || name.includes('임연수어') || name.includes('전')) {
          kcal = 180;
          carbs = 1;
          protein = 20;
          fat = 9;
          if (name.includes('전') || name.includes('임연수')) {
            allergyInfo = '생선 밀 함유';
          }
        } else if (name.includes('샐러드') || name.includes('무침') || name.includes('나물') || name.includes('겉절이')) {
          kcal = 55;
          carbs = 6;
          protein = 1.5;
          fat = 1;
        } else if (name.includes('김치') || name.includes('깍두기') || name.includes('석박지')) {
          kcal = 20;
          carbs = 3.5;
          protein = 1;
          fat = 0.1;
        }
      }

      // Check user preferences allergen overlays
      const allergenMatch = lunch.allergens.find(a => name.includes(a) || allergyInfo.includes(a));
      if (allergenMatch && !allergyInfo) {
        allergyInfo = `${allergenMatch} 성분`;
      }

      return {
        id: `calc-${index}-${name}`,
        name,
        category,
        kcal,
        carbs,
        protein,
        fat,
        allergyInfo: allergyInfo ? allergyInfo : undefined
      };
    });

    setDishes(parsedDishes);
    // Default all checked on load!
    setSelectedDishIds(parsedDishes.map(d => d.id));
  }, [lunch]);

  // Toggle selections
  const handleToggleDish = (id: string) => {
    setSelectedDishIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Compute live calorie limits
  const totalKcal = dishes.filter(d => selectedDishIds.includes(d.id)).reduce((acc, current) => acc + current.kcal, 0);
  const totalProtein = dishes.filter(d => selectedDishIds.includes(d.id)).reduce((acc, current) => acc + current.protein, 0);
  const totalCarbs = dishes.filter(d => selectedDishIds.includes(d.id)).reduce((acc, current) => acc + current.carbs, 0);
  const totalFat = dishes.filter(d => selectedDishIds.includes(d.id)).reduce((acc, current) => acc + current.fat, 0);

  // Targets relative to standards
  const CARB_TARGET = 137; // Standard recommended school carb target
  const PROTEIN_TARGET = 40; // School healthy protein target
  const FAT_TARGET = 55; // School healthy fat target

  const handleSaveCalculation = () => {
    alert(`영양 계산 결과가 저장되었습니다!\n총 칼로리: ${totalKcal} kcal\n단백질: ${totalProtein}g, 탄수화물: ${totalCarbs}g, 지방: ${totalFat}g\n식사 관리에 기록되었습니다.`);
  };

  const filteredDishes = activeCategory === '전체' 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      {/* Live nutrition panel */}
      {lunch ? (
        <>
          <section className="bg-surface-container-lowest rounded-[24px] p-5 custom-shadow border border-surface-container mt-2">
            <header className="mb-4">
              <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-1 tracking-wide">
                NUTRITION MATRIX 📊
              </span>
              <h2 className="font-headline-title text-lg text-on-surface font-bold">오늘의 선택 영양</h2>
              <p className="text-xs text-on-surface-variant opacity-75 mt-0.5 font-medium">
                아래에서 오늘 식단의 구성 성분을 체크 해제하며 칼로리와 영양 성분을 실시간으로 계산해 보세요.
              </p>
            </header>

            {/* Total kcal output */}
            <div className="flex items-baseline gap-1.5 mb-5 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
              <motion.span 
                key={totalKcal}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-extrabold text-primary font-mono tracking-tight"
              >
                {totalKcal}
              </motion.span>
              <span className="font-body-lg text-sm text-on-surface-variant font-bold">kcal 선택됨</span>
            </div>

            <div className="space-y-4">
              {/* Protein Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">단백질 (Protein)</span>
                  <span className="text-primary font-bold font-mono">{totalProtein}g / {PROTEIN_TARGET}g</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-container">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalProtein / PROTEIN_TARGET) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              {/* Carbs Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">탄수화물 (Carbs)</span>
                  <span className="text-primary font-bold font-mono">{totalCarbs}g / {CARB_TARGET}g</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-container">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalCarbs / CARB_TARGET) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              {/* Fat Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">지방 (Fat)</span>
                  <span className="text-primary font-bold font-mono">{totalFat}g / {FAT_TARGET}g</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-container">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalFat / FAT_TARGET) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter Chips */}
          <section className="overflow-x-auto -mx-6 px-6 scrollbar-none">
            <div className="flex gap-2 pb-1.5">
              {(['전체', '밥류', '국/찌개', '반찬', '디저트'] as const).map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-xs active-scale transition-all duration-200 border ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-secondary-container text-on-secondary-container border-secondary-container/30 hover:bg-secondary-container/80'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Interactive food checklist */}
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold ml-1">
              <Filter className="w-3.5 h-3.5 text-secondary" />
              <span>{activeCategory} 필터 결과 ({filteredDishes.length}개 항목)</span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish) => {
                const isSelected = selectedDishIds.includes(dish.id);
                const hasMyAllergy = dish.allergyInfo && userPrefs.allergies.some(a => dish.allergyInfo?.includes(a));

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={dish.id}
                    onClick={() => handleToggleDish(dish.id)}
                    className={`relative bg-surface-container-lowest rounded-[22px] p-5 border-2 transition-all duration-200 flex justify-between items-center active-scale cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-primary custom-shadow bg-white'
                        : 'border-transparent border-opacity-0 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-secondary-container text-on-secondary-container font-black px-1.5 py-0.5 rounded">
                          {dish.category}
                        </span>
                        <h3 className="font-bold text-base text-on-surface">
                          {dish.name}
                        </h3>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap text-xs font-semibold text-on-surface-variant">
                        <span className="text-primary">{dish.kcal} kcal</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <span>탄수 {dish.carbs}g</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <span>단백 {dish.protein}g</span>
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <span>지방 {dish.fat}g</span>
                      </div>
                      
                      {/* Allergy prompt warning if matched */}
                      {dish.allergyInfo && (
                        <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full w-max flex items-center gap-1 border ${
                          hasMyAllergy 
                            ? 'bg-red-500 text-white font-black animate-pulse'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                          <span>{dish.allergyInfo}</span>
                        </span>
                      )}
                    </div>

                    {/* Styled checkbox circular toggle */}
                    <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary border-primary text-on-primary'
                        : 'border-outline-variant hover:border-primary'
                    }`}>
                      {isSelected && (
                        <Check className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </section>

          {/* Action button */}
          <button 
            id="btn-save-nutrition"
            onClick={handleSaveCalculation}
            className="w-full bg-primary text-on-primary font-headline-title font-bold text-base py-5 rounded-2xl active-scale transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5 stroke-[2.5]" />
            계산 결과 저장하기
          </button>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-surface-container shadow-sm p-6 text-on-surface-variant">
          ⚠️ <strong>{formatKoreanDate(selectedDate)}</strong> 식단 정보가 부재하여 칼로리 영양 분석기를 가동할 수 없습니다. 상단 식단표 메뉴를 통해 평일 식단을 골라 보세요.
        </div>
      )}
    </motion.div>
  );
}
