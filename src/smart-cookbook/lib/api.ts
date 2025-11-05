import { Recipe } from "../types/recipe";

// TheMealDB API integration
export interface MealDBRecipe {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string | null;
    [key: string]: string | null;
}

interface APIResponse<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

class MealDBAPI {
    private baseURL = "https://www.themealdb.com/api/json/v1/1";
    private retryAttempts = 3;
    private retryDelay = 1000;

    private async fetchWithRetry<T>(
        url: string,
        attempt = 1
    ): Promise<APIResponse<T>> {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            if (attempt < this.retryAttempts) {
                await new Promise((resolve) =>
                    setTimeout(resolve, this.retryDelay * attempt)
                );
                return this.fetchWithRetry<T>(url, attempt + 1);
            }

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            console.error(
                `API request failed after ${attempt} attempts:`,
                errorMessage
            );
            return { success: false, data: null, error: errorMessage };
        }
    }

    async searchByName(query: string): Promise<MealDBRecipe[]> {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const encodedQuery = encodeURIComponent(query.trim());
        const response = await this.fetchWithRetry<{
            meals: MealDBRecipe[] | null;
        }>(`${this.baseURL}/search.php?s=${encodedQuery}`);

        return response.success && response.data?.meals
            ? response.data.meals
            : [];
    }

    async getRandomRecipe(): Promise<MealDBRecipe | null> {
        const response = await this.fetchWithRetry<{
            meals: MealDBRecipe[] | null;
        }>(`${this.baseURL}/random.php`);

        return response.success && response.data?.meals?.[0]
            ? response.data.meals[0]
            : null;
    }

    async filterByCategory(category: string): Promise<MealDBRecipe[]> {
        if (!category || category.trim().length === 0) {
            return [];
        }

        const encodedCategory = encodeURIComponent(category.trim());
        const response = await this.fetchWithRetry<{
            meals: MealDBRecipe[] | null;
        }>(`${this.baseURL}/filter.php?c=${encodedCategory}`);

        return response.success && response.data?.meals
            ? response.data.meals
            : [];
    }

    async getRecipeDetails(id: string): Promise<MealDBRecipe | null> {
        if (!id) {
            return null;
        }

        const response = await this.fetchWithRetry<{
            meals: MealDBRecipe[] | null;
        }>(`${this.baseURL}/lookup.php?i=${id}`);

        return response.success && response.data?.meals?.[0]
            ? response.data.meals[0]
            : null;
    }

    async getCategories(): Promise<string[]> {
        const response = await this.fetchWithRetry<{
            categories: Array<{ strCategory: string }> | null;
        }>(`${this.baseURL}/list.php?c=list`);

        return response.success && response.data?.categories
            ? response.data.categories.map((c) => c.strCategory)
            : [];
    }

    // Convert MealDB recipe to our Recipe format
    convertToRecipe(
        meal: MealDBRecipe
    ): Omit<Recipe, "id" | "createdAt" | "updatedAt"> {
        const ingredients: string[] = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                const formattedIngredient = measure?.trim()
                    ? `${measure.trim()} ${ingredient.trim()}`
                    : ingredient.trim();
                ingredients.push(formattedIngredient);
            }
        }

        const steps = meal.strInstructions
            .split(/\r?\n/)
            .map((step) => step.trim())
            .filter((step) => step.length > 0 && !step.match(/^STEP \d+$/i));

        const tags = meal.strTags
            ? meal.strTags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        return {
            title: meal.strMeal || "Untitled Recipe",
            ingredients,
            steps,
            tags,
            category: meal.strCategory?.toLowerCase() || "other",
            image: meal.strMealThumb || undefined,
        };
    }

    // Validate if a recipe has required fields
    isValidRecipe(recipe: Partial<Recipe>): boolean {
        return !!(
            recipe.title &&
            recipe.ingredients &&
            recipe.ingredients.length > 0 &&
            recipe.steps &&
            recipe.steps.length > 0
        );
    }
}

export const mealDB = new MealDBAPI();
