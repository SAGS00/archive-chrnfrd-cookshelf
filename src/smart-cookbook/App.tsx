"use client";

import { useState, useEffect, startTransition } from "react";
import { Recipe, MealPlan, ShoppingListItem } from "./types/recipe";
import { storage } from "./lib/storage";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeDetail } from "./components/RecipeDetail";
import { CookingMode } from "./components/CookingMode";
import { MealPlanner } from "./components/MealPlanner";
import { ShoppingList } from "./components/ShoppingList";
import { DiscoverMode } from "./components/DiscoverMode";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";
import {
    ChefHat,
    Plus,
    Search,
    Heart,
    Shuffle,
    Calendar,
    ShoppingCart,
    Sparkles,
} from "lucide-react";

export default function App() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealPlan, setMealPlan] = useState<MealPlan>({});
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
    const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
    const [activeTab, setActiveTab] = useState("recipes");

    // Load data on mount
    useEffect(() => {
        startTransition(() => {
            setRecipes(storage.getRecipes());
            setMealPlan(storage.getMealPlan());
            setShoppingList(storage.getShoppingList());
        });
    }, []);

    // Save data when it changes
    useEffect(() => {
        storage.saveRecipes(recipes);
    }, [recipes]);

    useEffect(() => {
        storage.saveMealPlan(mealPlan);
    }, [mealPlan]);

    useEffect(() => {
        storage.saveShoppingList(shoppingList);
    }, [shoppingList]);

    const handleSaveRecipe = (
        recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">
    ) => {
        if (editingRecipe) {
            // Update existing recipe
            setRecipes(
                recipes.map((r) =>
                    r.id === editingRecipe.id
                        ? {
                              ...recipeData,
                              id: editingRecipe.id,
                              createdAt: editingRecipe.createdAt,
                              updatedAt: new Date().toISOString(),
                          }
                        : r
                )
            );
            setEditingRecipe(null);
        } else {
            // Create new recipe
            const newRecipe: Recipe = {
                ...recipeData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setRecipes([newRecipe, ...recipes]);
        }
    };

    const handleDeleteRecipe = (id: string) => {
        if (confirm("Are you sure you want to delete this recipe?")) {
            setRecipes(recipes.filter((r) => r.id !== id));
        }
    };

    const handleToggleFavorite = (id: string) => {
        setRecipes(
            recipes.map((r) =>
                r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
            )
        );
    };

    const handleAddToShoppingList = (ingredients: string[]) => {
        const newItems: ShoppingListItem[] = ingredients.map((ingredient) => ({
            id: `${Date.now()}-${Math.random()}`,
            ingredient,
            checked: false,
        }));
        setShoppingList([...shoppingList, ...newItems]);
        setActiveTab("shopping");
    };

    const handleGenerateShoppingList = () => {
        const allRecipeIds = new Set<string>();
        Object.values(mealPlan).forEach((day) => {
            Object.values(day).forEach((recipeId) => {
                if (recipeId) allRecipeIds.add(recipeId);
            });
        });

        const allIngredients: string[] = [];
        allRecipeIds.forEach((recipeId) => {
            const recipe = recipes.find((r) => r.id === recipeId);
            if (recipe) {
                allIngredients.push(...recipe.ingredients);
            }
        });

        const newItems: ShoppingListItem[] = allIngredients.map(
            (ingredient) => ({
                id: `${Date.now()}-${Math.random()}`,
                ingredient,
                checked: false,
            })
        );

        setShoppingList([...shoppingList, ...newItems]);
        setActiveTab("shopping");
    };

    const handleRandomRecipe = () => {
        if (recipes.length === 0) return;
        const randomIndex = Math.floor(Math.random() * recipes.length);
        setViewingRecipe(recipes[randomIndex]);
    };

    const handleImportRecipe = (
        recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
    ) => {
        const newRecipe: Recipe = {
            ...recipe,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setRecipes([newRecipe, ...recipes]);
        setActiveTab("recipes");
    };

    // Filter recipes
    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch =
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.ingredients.some((i) =>
                i.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            recipe.tags.some((t) =>
                t.toLowerCase().includes(searchQuery.toLowerCase())
            );

        const matchesCategory =
            categoryFilter === "all" || recipe.category === categoryFilter;
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

    const categories = ["all", ...new Set(recipes.map((r) => r.category))];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl">Smart Cookbook</h1>
                                <p className="text-sm text-gray-600">
                                    Your Personal & Social Recipe Vault
                                </p>
                            </div>
                        </div>
                        <Button onClick={() => setFormOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Recipe
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="recipes" className="gap-2">
                            <ChefHat className="h-4 w-4" />
                            Recipes
                        </TabsTrigger>
                        <TabsTrigger value="planner" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Meal Planner
                        </TabsTrigger>
                        <TabsTrigger value="shopping" className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Shopping List
                        </TabsTrigger>
                        <TabsTrigger value="discover" className="gap-2">
                            <Sparkles className="h-4 w-4" />
                            Discover
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="recipes" className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search recipes, ingredients, or tags..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat}
                                            value={cat}
                                            className="capitalize"
                                        >
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={difficultyFilter}
                                onValueChange={setDifficultyFilter}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant={
                                    showFavoritesOnly ? "default" : "outline"
                                }
                                onClick={() =>
                                    setShowFavoritesOnly(!showFavoritesOnly)
                                }
                            >
                                <Heart
                                    className={`h-4 w-4 ${
                                        showFavoritesOnly ? "fill-white" : ""
                                    }`}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleRandomRecipe}
                            >
                                <Shuffle className="h-4 w-4" />
                            </Button>
                        </div>

                        {recipes.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-lg border">
                                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="mb-2">No Recipes Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Start building your personal cookbook
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => setFormOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Recipe
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab("discover")}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Discover Recipes
                                    </Button>
                                </div>
                            </div>
                        ) : filteredRecipes.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-lg border">
                                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="mb-2">No Recipes Found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search terms
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCategoryFilter("all");
                                        setDifficultyFilter("all");
                                        setShowFavoritesOnly(false);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        {filteredRecipes.length}{" "}
                                        {filteredRecipes.length === 1
                                            ? "recipe"
                                            : "recipes"}
                                    </p>
                                    {(searchQuery ||
                                        categoryFilter !== "all" ||
                                        difficultyFilter !== "all" ||
                                        showFavoritesOnly) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setCategoryFilter("all");
                                                setDifficultyFilter("all");
                                                setShowFavoritesOnly(false);
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRecipes.map((recipe) => (
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onView={setViewingRecipe}
                                            onEdit={(r) => {
                                                setEditingRecipe(r);
                                                setFormOpen(true);
                                            }}
                                            onDelete={handleDeleteRecipe}
                                            onToggleFavorite={
                                                handleToggleFavorite
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="planner">
                        <MealPlanner
                            mealPlan={mealPlan}
                            recipes={recipes}
                            onUpdateMealPlan={setMealPlan}
                            onGenerateShoppingList={handleGenerateShoppingList}
                        />
                    </TabsContent>

                    <TabsContent value="shopping">
                        <ShoppingList
                            items={shoppingList}
                            onUpdateItems={setShoppingList}
                        />
                    </TabsContent>

                    <TabsContent value="discover">
                        <DiscoverMode onImportRecipe={handleImportRecipe} />
                    </TabsContent>
                </Tabs>
            </main>

            <RecipeForm
                recipe={editingRecipe}
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingRecipe(null);
                }}
                onSave={handleSaveRecipe}
            />

            <RecipeDetail
                recipe={viewingRecipe}
                open={!!viewingRecipe}
                onClose={() => setViewingRecipe(null)}
                onEdit={(r) => {
                    setEditingRecipe(r);
                    setFormOpen(true);
                    setViewingRecipe(null);
                }}
                onDelete={handleDeleteRecipe}
                onToggleFavorite={handleToggleFavorite}
                onAddToShoppingList={handleAddToShoppingList}
                onStartCooking={(r) => {
                    setCookingRecipe(r);
                    setViewingRecipe(null);
                }}
            />

            <CookingMode
                recipe={cookingRecipe}
                open={!!cookingRecipe}
                onClose={() => setCookingRecipe(null)}
            />
        </div>
    );
}
