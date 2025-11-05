"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { MealPlan, Recipe } from "../types/recipe";
import { storage } from "../lib/storage";

export function useMealPlan() {
    const [mealPlan, setMealPlan] = useState<MealPlan>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startTransition(() => {
            setMealPlan(storage.getMealPlan());
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            storage.saveMealPlan(mealPlan);
        }
    }, [mealPlan, loading]);

    const updateMealPlan = useCallback((newMealPlan: MealPlan) => {
        setMealPlan(newMealPlan);
    }, []);

    const addMeal = useCallback(
        (
            day: string,
            mealType: "breakfast" | "lunch" | "dinner",
            recipeId: string
        ) => {
            setMealPlan((prev) => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [mealType]: recipeId,
                },
            }));
        },
        []
    );

    const removeMeal = useCallback(
        (day: string, mealType: "breakfast" | "lunch" | "dinner") => {
            setMealPlan((prev) => {
                const updatedDay = { ...prev[day] };
                delete updatedDay[mealType];
                return {
                    ...prev,
                    [day]: updatedDay,
                };
            });
        },
        []
    );

    const clearDay = useCallback((day: string) => {
        setMealPlan((prev) => {
            const updated = { ...prev };
            delete updated[day];
            return updated;
        });
    }, []);

    const getAllRecipeIds = useCallback(() => {
        const recipeIds = new Set<string>();
        Object.values(mealPlan).forEach((day) => {
            Object.values(day).forEach((recipeId) => {
                if (recipeId) recipeIds.add(recipeId);
            });
        });
        return Array.from(recipeIds);
    }, [mealPlan]);

    const getIngredientsFromMealPlan = useCallback(
        (recipes: Recipe[]) => {
            const recipeIds = getAllRecipeIds();
            const allIngredients: string[] = [];

            recipeIds.forEach((recipeId) => {
                const recipe = recipes.find((r) => r.id === recipeId);
                if (recipe) {
                    allIngredients.push(...recipe.ingredients);
                }
            });

            return allIngredients;
        },
        [getAllRecipeIds]
    );

    return {
        mealPlan,
        loading,
        updateMealPlan,
        addMeal,
        removeMeal,
        clearDay,
        getAllRecipeIds,
        getIngredientsFromMealPlan,
    };
}
