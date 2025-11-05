import {
    Recipe,
    MealPlan,
    ShoppingListItem,
    Collection,
} from "../types/recipe";

const RECIPES_KEY = "smart_cookbook_recipes";
const MEAL_PLAN_KEY = "smart_cookbook_meal_plan";
const SHOPPING_LIST_KEY = "smart_cookbook_shopping_list";
const COLLECTIONS_KEY = "smart_cookbook_collections";

// Storage utility with error handling and validation
class StorageManager {
    private isAvailable(): boolean {
        return (
            typeof window !== "undefined" && typeof localStorage !== "undefined"
        );
    }

    private safeGet<T>(key: string, defaultValue: T): T {
        if (!this.isAvailable()) return defaultValue;

        try {
            const data = localStorage.getItem(key);
            if (!data) return defaultValue;

            const parsed = JSON.parse(data);
            return parsed ?? defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    private safeSet<T>(key: string, value: T): boolean {
        if (!this.isAvailable()) return false;

        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            if (error instanceof Error && error.name === "QuotaExceededError") {
                console.error(
                    "Storage quota exceeded. Consider clearing old data."
                );
            } else {
                console.error(`Error writing to localStorage (${key}):`, error);
            }
            return false;
        }
    }

    // Recipes
    getRecipes(): Recipe[] {
        return this.safeGet<Recipe[]>(RECIPES_KEY, []);
    }

    saveRecipes(recipes: Recipe[]): boolean {
        return this.safeSet(RECIPES_KEY, recipes);
    }

    // Meal Plan
    getMealPlan(): MealPlan {
        return this.safeGet<MealPlan>(MEAL_PLAN_KEY, {});
    }

    saveMealPlan(mealPlan: MealPlan): boolean {
        return this.safeSet(MEAL_PLAN_KEY, mealPlan);
    }

    // Shopping List
    getShoppingList(): ShoppingListItem[] {
        return this.safeGet<ShoppingListItem[]>(SHOPPING_LIST_KEY, []);
    }

    saveShoppingList(items: ShoppingListItem[]): boolean {
        return this.safeSet(SHOPPING_LIST_KEY, items);
    }

    // Collections
    getCollections(): Collection[] {
        return this.safeGet<Collection[]>(COLLECTIONS_KEY, []);
    }

    saveCollections(collections: Collection[]): boolean {
        return this.safeSet(COLLECTIONS_KEY, collections);
    }

    // Utility methods
    clear(): void {
        if (!this.isAvailable()) return;

        try {
            localStorage.removeItem(RECIPES_KEY);
            localStorage.removeItem(MEAL_PLAN_KEY);
            localStorage.removeItem(SHOPPING_LIST_KEY);
            localStorage.removeItem(COLLECTIONS_KEY);
        } catch (error) {
            console.error("Error clearing storage:", error);
        }
    }

    exportData(): string | null {
        try {
            const data = {
                recipes: this.getRecipes(),
                mealPlan: this.getMealPlan(),
                shoppingList: this.getShoppingList(),
                collections: this.getCollections(),
                exportedAt: new Date().toISOString(),
            };
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error("Error exporting data:", error);
            return null;
        }
    }

    importData(jsonData: string): boolean {
        try {
            const data = JSON.parse(jsonData);

            if (data.recipes && Array.isArray(data.recipes)) {
                this.saveRecipes(data.recipes);
            }
            if (data.mealPlan && typeof data.mealPlan === "object") {
                this.saveMealPlan(data.mealPlan);
            }
            if (data.shoppingList && Array.isArray(data.shoppingList)) {
                this.saveShoppingList(data.shoppingList);
            }
            if (data.collections && Array.isArray(data.collections)) {
                this.saveCollections(data.collections);
            }

            return true;
        } catch (error) {
            console.error("Error importing data:", error);
            return false;
        }
    }
}

export const storage = new StorageManager();
