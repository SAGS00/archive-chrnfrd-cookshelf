import { useState, useEffect, startTransition } from "react";
import { mealDB, MealDBRecipe } from "../lib/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sparkles, Search, Plus, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Recipe } from "../types/recipe";

interface DiscoverModeProps {
    onImportRecipe: (
        recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
    ) => void;
}

export function DiscoverMode({ onImportRecipe }: DiscoverModeProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState<MealDBRecipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [randomRecipe, setRandomRecipe] = useState<MealDBRecipe | null>(null);

    const searchRecipes = async () => {
        if (!searchQuery.trim()) return;
        startTransition(() => setLoading(true));
        const results = await mealDB.searchByName(searchQuery);
        startTransition(() => {
            setRecipes(results);
            setLoading(false);
        });
    };

    const loadRandomRecipe = async () => {
        startTransition(() => setLoading(true));
        const recipe = await mealDB.getRandomRecipe();
        startTransition(() => {
            setRandomRecipe(recipe);
            setLoading(false);
        });
    };

    const handleImport = (meal: MealDBRecipe) => {
        const recipe = mealDB.convertToRecipe(meal);
        onImportRecipe(recipe);
    };

    useEffect(() => {
        loadRandomRecipe();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h2>Discover Recipes</h2>
            </div>

            <Card className="p-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search recipes (e.g., pasta, chicken)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
                    />
                    <Button onClick={searchRecipes} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </Card>

            {randomRecipe && !searchQuery && recipes.length === 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3>Random Recipe Inspiration</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadRandomRecipe}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            New Recipe
                        </Button>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2 h-64 md:h-auto relative">
                                <ImageWithFallback
                                    src={randomRecipe.strMealThumb}
                                    alt={randomRecipe.strMeal}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-6 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="mb-3">
                                        {randomRecipe.strMeal}
                                    </h3>
                                    <div className="flex gap-2 mb-4">
                                        <Badge variant="secondary">
                                            {randomRecipe.strCategory}
                                        </Badge>
                                        <Badge variant="outline">
                                            {randomRecipe.strArea}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-4">
                                        {randomRecipe.strInstructions.substring(
                                            0,
                                            200
                                        )}
                                        ...
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleImport(randomRecipe)}
                                    className="mt-4"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Import to My Recipes
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {recipes.length > 0 && (
                <div className="space-y-4">
                    <h3>Search Results ({recipes.length})</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipes.map((recipe) => (
                            <Card
                                key={recipe.idMeal}
                                className="overflow-hidden"
                            >
                                <div className="h-48 relative">
                                    <ImageWithFallback
                                        src={recipe.strMealThumb}
                                        alt={recipe.strMeal}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="mb-2 line-clamp-2">
                                        {recipe.strMeal}
                                    </h4>
                                    <div className="flex gap-2 mb-3">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {recipe.strCategory}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {recipe.strArea}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => handleImport(recipe)}
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Import
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center py-12 text-gray-500">
                    <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin" />
                    <p>Loading recipes...</p>
                </div>
            )}

            {!loading && searchQuery && recipes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No recipes found</p>
                    <p className="text-sm">Try a different search term</p>
                </div>
            )}
        </div>
    );
}
