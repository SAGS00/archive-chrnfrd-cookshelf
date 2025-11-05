export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  category: string;
  image?: string;
  prepTime?: number;
  cookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  calories?: number;
  isFavorite?: boolean;
  collections?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  [day: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  checked: boolean;
  recipeId?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  createdAt: string;
}
