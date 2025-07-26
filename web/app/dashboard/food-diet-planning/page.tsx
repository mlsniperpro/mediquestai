'use client';

import { useState } from 'react';
import { 
  PlayIcon,
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SparklesIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  ingredients: string[];
  hasVideo: boolean;
  hasAudio: boolean;
  rating: number;
  image: string;
}

interface DietPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  targetGoal: string;
  meals: number;
  recipes: Recipe[];
}

export default function FoodDietPlanningPage() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'plans' | 'chat'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Vegetarian', 'Keto', 'Low-Carb'];

  const sampleRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Mediterranean Quinoa Bowl',
      description: 'A nutritious bowl packed with quinoa, fresh vegetables, and Mediterranean flavors',
      prepTime: '15 min',
      cookTime: '20 min',
      calories: 420,
      difficulty: 'Easy',
      category: 'Lunch',
      ingredients: ['Quinoa', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olive oil', 'Lemon'],
      hasVideo: true,
      hasAudio: true,
      rating: 4.8,
      image: '🥗'
    },
    {
      id: '2',
      title: 'Grilled Salmon with Asparagus',
      description: 'Heart-healthy salmon with perfectly grilled asparagus and herbs',
      prepTime: '10 min',
      cookTime: '15 min',
      calories: 380,
      difficulty: 'Medium',
      category: 'Dinner',
      ingredients: ['Salmon fillet', 'Asparagus', 'Garlic', 'Lemon', 'Herbs', 'Olive oil'],
      hasVideo: true,
      hasAudio: true,
      rating: 4.9,
      image: '🐟'
    },
    {
      id: '3',
      title: 'Overnight Oats with Berries',
      description: 'Easy make-ahead breakfast with oats, berries, and natural sweeteners',
      prepTime: '5 min',
      cookTime: '0 min',
      calories: 290,
      difficulty: 'Easy',
      category: 'Breakfast',
      ingredients: ['Rolled oats', 'Almond milk', 'Chia seeds', 'Berries', 'Honey', 'Vanilla'],
      hasVideo: true,
      hasAudio: false,
      rating: 4.6,
      image: '🥣'
    }
  ];

  const sampleDietPlans: DietPlan[] = [
    {
      id: '1',
      name: 'Mediterranean Wellness Plan',
      description: 'A 30-day Mediterranean diet plan focused on heart health and weight management',
      duration: '30 days',
      targetGoal: 'Heart Health & Weight Loss',
      meals: 90,
      recipes: sampleRecipes
    },
    {
      id: '2',
      name: 'High-Protein Fitness Plan',
      description: 'Protein-rich meals designed for muscle building and athletic performance',
      duration: '21 days',
      targetGoal: 'Muscle Building',
      meals: 63,
      recipes: sampleRecipes
    }
  ];

  const filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
         onClick={() => setSelectedRecipe(recipe)}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl mb-2">{recipe.image}</div>
        <div className="flex items-center space-x-1">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-muted-foreground">{recipe.rating}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-card-foreground mb-2">{recipe.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            {recipe.prepTime}
          </span>
          <span className="flex items-center">
            <FireIcon className="w-3 h-3 mr-1" />
            {recipe.calories} cal
          </span>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {recipe.difficulty}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {recipe.hasVideo && (
          <div className="flex items-center text-xs text-blue-600">
            <VideoCameraIcon className="w-3 h-3 mr-1" />
            Video
          </div>
        )}
        {recipe.hasAudio && (
          <div className="flex items-center text-xs text-purple-600">
            <SpeakerWaveIcon className="w-3 h-3 mr-1" />
            Audio
          </div>
        )}
        <div className="flex items-center text-xs text-green-600">
          <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
          Chat Support
        </div>
      </div>
    </div>
  );

  const RecipeDetail = ({ recipe }: { recipe: Recipe }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedRecipe(null)}
          className="flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>
        <div className="flex items-center space-x-1">
          <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="font-medium">{recipe.rating}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{recipe.image}</div>
        <h1 className="text-2xl font-bold text-card-foreground mb-2">{recipe.title}</h1>
        <p className="text-muted-foreground">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-accent rounded-lg">
          <ClockIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="font-medium">Prep Time</div>
          <div className="text-sm text-muted-foreground">{recipe.prepTime}</div>
        </div>
        <div className="text-center p-4 bg-accent rounded-lg">
          <FireIcon className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <div className="font-medium">Calories</div>
          <div className="text-sm text-muted-foreground">{recipe.calories}</div>
        </div>
        <div className="text-center p-4 bg-accent rounded-lg">
          <HeartIcon className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="font-medium">Difficulty</div>
          <div className="text-sm text-muted-foreground">{recipe.difficulty}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipe.hasVideo && (
          <Button className="flex items-center justify-center space-x-2">
            <PlayIcon className="w-4 h-4" />
            <span>Watch Video Tutorial</span>
          </Button>
        )}
        {recipe.hasAudio && (
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <SpeakerWaveIcon className="w-4 h-4" />
            <span>Audio Instructions</span>
          </Button>
        )}
        <Button variant="outline" className="flex items-center justify-center space-x-2">
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          <span>Ask Questions</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Food & Diet Planning</h1>
          <p className="text-muted-foreground">
            Comprehensive nutrition guidance with video tutorials, audio instructions, and interactive support
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <VideoCameraIcon className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Video Walkthroughs</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">Step-by-step cooking videos</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <SpeakerWaveIcon className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">Audio Analysis</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">Voice-guided instructions</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <BookOpenIcon className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-green-900 dark:text-green-100">In-depth Explanations</h3>
          <p className="text-sm text-green-700 dark:text-green-300">Detailed preparation guides</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-orange-600 mb-2" />
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">Chat Support</h3>
          <p className="text-sm text-orange-700 dark:text-orange-300">Interactive Q&A assistance</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-accent rounded-lg p-1">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recipes' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recipes & Tutorials
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'plans' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Diet Plans
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Nutrition Chat
        </button>
      </div>

      {/* Content */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          {selectedRecipe ? (
            <RecipeDetail recipe={selectedRecipe} />
          ) : (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleDietPlans.map(plan => (
              <div key={plan.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                  </div>
                  <SparklesIcon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-card-foreground">Duration</div>
                    <div className="text-sm text-muted-foreground">{plan.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground">Total Meals</div>
                    <div className="text-sm text-muted-foreground">{plan.meals}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-card-foreground mb-1">Target Goal</div>
                  <div className="text-sm text-muted-foreground">{plan.targetGoal}</div>
                </div>
                
                <Button className="w-full">Start This Plan</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center mb-6">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Nutrition Chat Assistant</h2>
            <p className="text-muted-foreground">
              Ask questions about recipes, nutrition, dietary restrictions, or cooking techniques. 
              Our AI assistant is here to help with personalized guidance.
            </p>
          </div>
          
          <div className="bg-accent rounded-lg p-4 mb-4 min-h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MicrophoneIcon className="w-8 h-8 mx-auto mb-2" />
              <p>Chat interface will be implemented here</p>
              <p className="text-sm">Voice and text support available</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Ask about nutrition, recipes, or cooking tips..."
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button>Send</Button>
            <Button variant="outline">
              <MicrophoneIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}