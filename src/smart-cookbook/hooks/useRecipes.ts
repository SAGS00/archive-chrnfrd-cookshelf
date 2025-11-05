"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { Recipe } from "../types/recipe";
import { storage } from "../lib/storage";

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startTransition(() => {
            setRecipes(storage.getRecipes());
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            storage.saveRecipes(recipes);
        }
    }, [recipes, loading]);

    const addRecipe = useCallback(
        (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => {
            const newRecipe: Recipe = {
                ...recipeData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setRecipes((prev) => [newRecipe, ...prev]);
            return newRecipe;
        },
        []
    );

    const updateRecipe = useCallback(
        (
            id: string,
            recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">
        ) => {
            setRecipes((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? {
                              ...recipeData,
                              id,
                              createdAt: r.createdAt,
                              updatedAt: new Date().toISOString(),
                          }
                        : r
                )
            );
        },
        []
    );

    const deleteRecipe = useCallback((id: string) => {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setRecipes((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
            )
        );
    }, []);

    const getRecipeById = useCallback(
        (id: string) => {
            return recipes.find((r) => r.id === id);
        },
        [recipes]
    );

    const filterRecipes = useCallback(
        (
            searchQuery: string,
            categoryFilter: string,
            difficultyFilter: string,
            showFavoritesOnly: boolean
        ) => {
            return recipes.filter((recipe) => {
                const matchesSearch =
                    recipe.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    recipe.ingredients.some((i) =>
                        i.toLowerCase().includes(searchQuery.toLowerCase())
                    ) ||
                    recipe.tags.some((t) =>
                        t.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                const matchesCategory =
                    categoryFilter === "all" ||
                    recipe.category === categoryFilter;
                const matchesDifficulty =
                    difficultyFilter === "all" ||
                    recipe.difficulty === difficultyFilter;
                const matchesFavorite = !showFavoritesOnly || recipe.isFavorite;

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesDifficulty &&
                    matchesFavorite
                );
            });
        },
        [recipes]
    );

    const getCategories = useCallback(() => {
        return ["all", ...new Set(recipes.map((r) => r.category))];
    }, [recipes]);

    return {
        recipes,
        loading,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        getRecipeById,
        filterRecipes,
        getCategories,
    };
}
