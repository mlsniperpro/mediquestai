'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserFoodRecords, getNutritionSummary, FoodRecord } from '@/services/foodTrackingService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { 
  ChartBarIcon,
  FireIcon,
  BeakerIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { userProfile } = useAuth();
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    totalSugar: number;
    totalSodium: number;
    recordCount: number;
    averageCaloriesPerDay: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [error, setError] = useState<string | null>(null);

  const loadAnalyticsData = useCallback(async () => {
    if (!userProfile?.uid) return;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      let startDate: Date;

      switch (selectedPeriod) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
        default:
          startDate = new Date(0); // Beginning of time
          break;
      }

      const [records, summary] = await Promise.all([
        getUserFoodRecords(userProfile.uid, startDate, now),
        getNutritionSummary(userProfile.uid, startDate, now)
      ]);

      setFoodRecords(records);
      setNutritionSummary(summary);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.uid, selectedPeriod]);

  useEffect(() => {
    if (userProfile?.uid) {
      loadAnalyticsData();
    }
  }, [userProfile, selectedPeriod, loadAnalyticsData]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMealTypeColor = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'lunch': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'snack': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadAnalyticsData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Food Analytics</h1>
          <p className="text-muted-foreground">Track your nutrition and food consumption patterns</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' ? 'Last 7 Days' : period === 'month' ? 'Last 30 Days' : 'All Time'}
            </Button>
          ))}
        </div>
      </div>

      {foodRecords.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Food Records Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your food to see detailed analytics and insights.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back to Dashboard
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {nutritionSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Calories</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{nutritionSummary.totalCalories.toLocaleString()}</p>
                  </div>
                  <FireIcon className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  Avg: {nutritionSummary.averageCaloriesPerDay}/day
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Protein</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{nutritionSummary.totalProtein}g</p>
                  </div>
                  <BeakerIcon className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Food Items</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{nutritionSummary.recordCount}</p>
                  </div>
                  <TrophyIcon className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Carbs & Fat</p>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{nutritionSummary.totalCarbs}g / {nutritionSummary.totalFat}g</p>
                  </div>
                  <ChartBarIcon className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          )}

          {/* Macronutrient Breakdown */}
          {nutritionSummary && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nutritional Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{nutritionSummary.totalProtein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{nutritionSummary.totalCarbs}g</div>
                  <div className="text-sm text-muted-foreground">Carbohydrates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{nutritionSummary.totalFat}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{nutritionSummary.totalFiber}g</div>
                  <div className="text-sm text-muted-foreground">Fiber</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{nutritionSummary.totalSugar}g</div>
                  <div className="text-sm text-muted-foreground">Sugar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{nutritionSummary.totalSodium}mg</div>
                  <div className="text-sm text-muted-foreground">Sodium</div>
                </div>
              </div>
            </div>
          )}

          {/* Food Records List */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Food Records</h3>
            <div className="space-y-4">
              {foodRecords.map((record) => (
                <div key={record.id} className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={record.imageUrl}
                      alt={record.foodName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{record.foodName}</h4>
                      {record.mealType && (
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getMealTypeColor(record.mealType)}`}>
                          {record.mealType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        {record.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>P: {record.protein}g</span>
                      <span>C: {record.carbs}g</span>
                      <span>F: {record.fat}g</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{record.servingSize}</div>
                    <div className="text-xs text-muted-foreground">{record.confidence}% confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}