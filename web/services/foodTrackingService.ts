import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FoodRecord {
  id?: string;
  userId: string;
  imageUrl: string;
  foodName: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  servingSize: string;
  confidence: number; // 0-100
  createdAt: Date;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Fake food data for random generation
const FAKE_FOODS = [
  { name: 'Grilled Chicken Breast', caloriesPerServing: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, serving: '100g' },
  { name: 'Caesar Salad', caloriesPerServing: 470, protein: 37, carbs: 7, fat: 40, fiber: 4, sugar: 4, sodium: 1326, serving: '1 serving' },
  { name: 'Spaghetti Bolognese', caloriesPerServing: 350, protein: 18, carbs: 45, fat: 12, fiber: 3, sugar: 8, sodium: 680, serving: '1 cup' },
  { name: 'Chocolate Chip Cookie', caloriesPerServing: 78, protein: 1, carbs: 11, fat: 4, fiber: 0.4, sugar: 6, sodium: 58, serving: '1 cookie' },
  { name: 'Greek Yogurt with Berries', caloriesPerServing: 150, protein: 15, carbs: 20, fat: 0, fiber: 3, sugar: 15, sodium: 65, serving: '1 cup' },
  { name: 'Avocado Toast', caloriesPerServing: 300, protein: 10, carbs: 30, fat: 18, fiber: 12, sugar: 3, sodium: 400, serving: '2 slices' },
  { name: 'Banana Smoothie', caloriesPerServing: 220, protein: 8, carbs: 45, fat: 2, fiber: 4, sugar: 35, sodium: 120, serving: '1 glass' },
  { name: 'Grilled Salmon', caloriesPerServing: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59, serving: '100g' },
  { name: 'Quinoa Bowl', caloriesPerServing: 380, protein: 14, carbs: 58, fat: 12, fiber: 8, sugar: 6, sodium: 320, serving: '1 bowl' },
  { name: 'Apple with Peanut Butter', caloriesPerServing: 267, protein: 8, carbs: 25, fat: 16, fiber: 5, sugar: 19, sodium: 147, serving: '1 apple + 2 tbsp PB' },
  { name: 'Vegetable Stir Fry', caloriesPerServing: 180, protein: 6, carbs: 25, fat: 8, fiber: 6, sugar: 12, sodium: 580, serving: '1 cup' },
  { name: 'Oatmeal with Fruits', caloriesPerServing: 250, protein: 8, carbs: 45, fat: 5, fiber: 8, sugar: 15, sodium: 200, serving: '1 bowl' },
  { name: 'Turkey Sandwich', caloriesPerServing: 320, protein: 25, carbs: 35, fat: 10, fiber: 4, sugar: 5, sodium: 890, serving: '1 sandwich' },
  { name: 'Mixed Green Salad', caloriesPerServing: 120, protein: 3, carbs: 8, fat: 9, fiber: 3, sugar: 4, sodium: 180, serving: '1 serving' },
  { name: 'Beef Burger', caloriesPerServing: 540, protein: 25, carbs: 40, fat: 31, fiber: 3, sugar: 5, sodium: 1040, serving: '1 burger' }
];

// Generate fake calorie data for an uploaded food image
export function generateFakeCalorieData(): Omit<FoodRecord, 'id' | 'userId' | 'imageUrl' | 'createdAt'> {
  const randomFood = FAKE_FOODS[Math.floor(Math.random() * FAKE_FOODS.length)];
  
  // Add some randomness to the values (±20%)
  const variance = 0.2;
  const randomize = (value: number) => Math.round(value * (1 + (Math.random() - 0.5) * variance));
  
  return {
    foodName: randomFood.name,
    calories: randomize(randomFood.caloriesPerServing),
    protein: randomize(randomFood.protein),
    carbs: randomize(randomFood.carbs),
    fat: randomize(randomFood.fat),
    fiber: randomize(randomFood.fiber),
    sugar: randomize(randomFood.sugar),
    sodium: randomize(randomFood.sodium),
    servingSize: randomFood.serving,
    confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
    mealType: getCurrentMealType()
  };
}

// Determine meal type based on current time
function getCurrentMealType(): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 22) return 'dinner';
  return 'snack';
}

// Save food record to Firestore
export async function saveFoodRecord(foodRecord: Omit<FoodRecord, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'foodRecords'), {
      ...foodRecord,
      createdAt: Timestamp.fromDate(foodRecord.createdAt)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving food record:', error);
    throw error;
  }
}

// Get food records for a user
export async function getUserFoodRecords(
  userId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<FoodRecord[]> {
  try {
    let q = query(
      collection(db, 'foodRecords'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const records: FoodRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as FoodRecord);
    });

    // Filter by date range if provided
    if (startDate || endDate) {
      return records.filter(record => {
        const recordDate = record.createdAt;
        if (startDate && recordDate < startDate) return false;
        if (endDate && recordDate > endDate) return false;
        return true;
      });
    }

    return records;
  } catch (error) {
    console.error('Error fetching food records:', error);
    throw error;
  }
}

// Get nutrition summary for a date range
export async function getNutritionSummary(
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<{
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  recordCount: number;
  averageCaloriesPerDay: number;
}> {
  const records = await getUserFoodRecords(userId, startDate, endDate);
  
  const summary = records.reduce(
    (acc, record) => ({
      totalCalories: acc.totalCalories + record.calories,
      totalProtein: acc.totalProtein + record.protein,
      totalCarbs: acc.totalCarbs + record.carbs,
      totalFat: acc.totalFat + record.fat,
      totalFiber: acc.totalFiber + record.fiber,
      totalSugar: acc.totalSugar + record.sugar,
      totalSodium: acc.totalSodium + record.sodium,
      recordCount: acc.recordCount + 1
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      recordCount: 0
    }
  );

  const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  return {
    ...summary,
    averageCaloriesPerDay: summary.recordCount > 0 ? Math.round(summary.totalCalories / daysDiff) : 0
  };
}