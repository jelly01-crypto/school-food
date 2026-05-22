/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NutritionInfo {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealData {
  id: string;
  schoolName: string;
  date: Date;
  dateKey: string; // YYYYMMDD
  dayOfWeek: string; // 월, 화, 수, 목, 금
  mealType: '중식' | '석식';
  title: string;
  dishes: string[];
  totalCalories: number;
  nutrition: NutritionInfo;
  allergens: string[];
  proteinRate?: number; // e.g., 85 for 85%
}

export interface RecommendationInfo {
  title: string;
  description: string;
  image: string;
  calories: number;
}

export interface UserPreferences {
  name: string;
  gradeClass: string;
  allergies: string[];
  allergyNotification: boolean;
  dailyNotification: boolean;
}
