/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealData, RecommendationInfo } from '../types';
import { getWeekDates, formatDateKey, getKoreanDayOfWeek } from './dateUtils';

// Template menu structures to dynamically map to dates.
const mealTemplates = [
  // Day 0: Monday (월요일)
  {
    dayIndex: 0,
    lunch: {
      title: "꼬꼬닭곰탕 & 대구전 정식",
      dishes: ["칼슘찹쌀밥", "꼬꼬닭곰탕", "동태대구전", "브로콜리초장무침", "석박지", "우리사과푸딩"],
      totalCalories: 810,
      nutrition: { kcal: 810, protein: 34, carbs: 105, fat: 21 },
      allergens: ["대두", "밀", "닭고기"],
      proteinRate: 80
    },
    dinner: {
      title: "치킨마요덮밥 정식",
      dishes: ["치킨마요덮밥", "팽이버섯된장국", "꽃맛살샐러드", "배추김치", "아이스홍시"],
      totalCalories: 740,
      nutrition: { kcal: 740, protein: 25, carbs: 98, fat: 19 },
      allergens: ["난류", "우유", "대두", "밀", "닭고기"],
      proteinRate: 65
    },
    recommendation: {
      title: "꼬꼬닭곰탕 & 대구전 정식",
      description: "정성을 다해 우려낸 고소하고 따뜻한 닭곰탕과 아삭아삭한 석박지로 힘찬 한 주를 열어줄 든든한 아카데믹 집밥 정식입니다.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
      calories: 810
    }
  },
  // Day 1: Tuesday (화요일)
  {
    dayIndex: 1,
    lunch: {
      title: "매콤 오리불고기 웰빙밥상",
      dishes: ["기장밥", "해물순두부찌개", "오리불고기", "무쌈", "부추겉절이", "총각김치"],
      totalCalories: 830,
      nutrition: { kcal: 830, protein: 30, carbs: 102, fat: 26 },
      allergens: ["대두", "밀", "새우", "조개류"],
      proteinRate: 85
    },
    dinner: {
      title: "가쓰오우동 & 스팸컵밥",
      dishes: ["스팸 계란 컵밥", "가쓰오 미니우동", "국물 떡볶이", "야채튀김 & 만두", "단무지", "쿨피스"],
      totalCalories: 710,
      nutrition: { kcal: 710, protein: 18, carbs: 110, fat: 22 },
      allergens: ["대두", "밀", "돼지고기", "난류"],
      proteinRate: 55
    },
    recommendation: {
      title: "매콤 오리불고기 웰빙밥상",
      description: "매콤하고 부드럽게 볶아낸 최고급 오리불고기에 시원하고 얼큰한 해물순두부찌개의 절묘한 궁합으로 영양을 고루 채웁니다.",
      image: "https://images.unsplash.com/photo-1514516317522-f97b6b4d7674?auto=format&fit=crop&q=80&w=600",
      calories: 830
    }
  },
  // Day 2: Wednesday (수요일)
  {
    dayIndex: 2,
    lunch: {
      title: "등심돈까스 & 김치볶음밥",
      dishes: ["날치알김치볶음밥", "계란파국", "수제 등심돈까스", "양배추샐러드 & 아일랜드소스", "깍두기", "망고요구르트"],
      totalCalories: 820,
      nutrition: { kcal: 820, protein: 28, carbs: 112, fat: 24 },
      allergens: ["난류", "대두", "밀", "돼지고기"],
      proteinRate: 75
    },
    dinner: {
      title: "마파두부덮밥 & 묵사발",
      dishes: ["정통 마파두부덮밥", "김가루 탱글묵사발", "달콤마요치킨볼", "배추김치", "싱싱한오렌지"],
      totalCalories: 750,
      nutrition: { kcal: 750, protein: 22, carbs: 106, fat: 18 },
      allergens: ["대두", "밀", "닭고기", "돼지고기"],
      proteinRate: 60
    },
    recommendation: {
      title: "수제 등심돈까스 & 김치볶음밥",
      description: "수요일 최고의 인기 특식! 톡톡 터지는 날치알 김치볶음밥에 직접 두드려 바삭하게 구워 낸 등심돈까스가 입안을 황홀하게 채웁니다.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
      calories: 820
    }
  },
  // Day 3: Thursday (목요일)
  {
    dayIndex: 3,
    lunch: {
      title: "수제함박스테이크 정식",
      dishes: ["혼합잡곡밥", "돈육김치찌개", "수제함박스테이크", "숙주미나리무침", "깍두기", "콘드레싱 샐러드"],
      totalCalories: 850,
      nutrition: { kcal: 850, protein: 35, carbs: 108, fat: 25 },
      allergens: ["돼지고기", "쇠고기", "대두", "밀"],
      proteinRate: 85
    },
    dinner: {
      title: "참치마요덮밥 & 미니우동",
      dishes: ["참치마요덮밥", "미니우동", "단무지무침", "배추김치", "요구르트"],
      totalCalories: 720,
      nutrition: { kcal: 720, protein: 21, carbs: 102, fat: 16 },
      allergens: ["난류", "우유", "대두", "밀"],
      proteinRate: 60
    },
    recommendation: {
      title: "수제함박스테이크 정식",
      description: "철판에 고르게 익혀 육즙이 터지는 육중한 함박스테이크에 칼칼한 돈육김치찌개를 조화시켜 환상적인 맛의 발란스를 만들어 냅니다.",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600",
      calories: 850
    }
  },
  // Day 4: Friday (금요일)
  {
    dayIndex: 4,
    lunch: {
      title: "치즈돈까스 정식",
      dishes: ["친환경현미밥", "쇠고기미역국", "매콤돈육강정", "숙주미나리무침", "배추김치"],
      totalCalories: 845,
      nutrition: { kcal: 845, protein: 32, carbs: 110, fat: 25 },
      allergens: ["대두", "밀", "쇠고기", "돼지고기"],
      proteinRate: 85
    },
    dinner: {
      title: "참치마요덮밥 정식",
      dishes: ["참치마요덮밥", "유부장국", "매콤떡볶이", "깍두기", "요구르트"],
      totalCalories: 720,
      nutrition: { kcal: 720, protein: 20, carbs: 99, fat: 18 },
      allergens: ["난류", "우유", "대두", "밀"],
      proteinRate: 60
    },
    recommendation: {
      title: "치즈돈까스 정식",
      description: "바삭한 수제 치즈 돈까스와 신선한 샐러드가 포함된 든든한 한 끼입니다.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9vTsrvFahQ0YPJ1z41HPAZKaqyNUFBxOsN0VVrHxdQ1p7NaoxKsgsN8V75eQ9x1GLEwrSEqenBptvuPUCbj0KEY19ji5BLF0HUu5yxzz0hOUvq6ofjk39B4Tha6KkfCMyMuI_RC8I99tPMMND99yT2E-2cOJbLayONqQCYQMUIzJr1bsxKO-zbWniyKeZ-M5S_D2y1IwnjM-_wmAMji3XSYvb2GK4W0A5uUQcT2dxSkK7x-YLgR3JKIKyk7pZZtC7Tq3Wp90IaA",
      calories: 845
    }
  }
];

/**
 * Dynamically maps the 5 templates of weekday menus onto Monday-Friday of the week containing
 * the provided date object.
 */
export function generateMockDataForWeek(dateInWeek: Date): MealData[] {
  const weekDates = getWeekDates(dateInWeek);
  const meals: MealData[] = [];

  weekDates.forEach((date, index) => {
    const template = mealTemplates[index];
    const dateKey = formatDateKey(date);
    const dayName = getKoreanDayOfWeek(date);

    // Add Lunch
    meals.push({
      id: `${dateKey}_lunch`,
      schoolName: "씨마스고등학교",
      date,
      dateKey,
      dayOfWeek: dayName,
      mealType: '중식',
      title: template.lunch.title,
      dishes: template.lunch.dishes,
      totalCalories: template.lunch.totalCalories,
      nutrition: template.lunch.nutrition,
      allergens: template.lunch.allergens,
      proteinRate: template.lunch.proteinRate
    });

    // Add Dinner
    meals.push({
      id: `${dateKey}_dinner`,
      schoolName: "씨마스고등학교",
      date,
      dateKey,
      dayOfWeek: dayName,
      mealType: '석식',
      title: template.dinner.title,
      dishes: template.dinner.dishes,
      totalCalories: template.dinner.totalCalories,
      nutrition: template.dinner.nutrition,
      allergens: template.dinner.allergens,
      proteinRate: template.dinner.proteinRate
    });
  });

  return meals;
}

/**
 * Dynamically gets a food recommendation recipe card for the specified day of the week.
 */
export function getRecommendationForDate(date: Date): RecommendationInfo {
  let dayNum = date.getDay(); // 0 is Sunday, 1 is Monday ...
  let idx = 0;

  // If Saturday (6) or Sunday (0), map to Friday (4) for a gorgeous display
  if (dayNum === 6 || dayNum === 0) {
    idx = 4;
  } else {
    idx = Math.min(4, Math.max(0, dayNum - 1));
  }

  return mealTemplates[idx].recommendation;
}
