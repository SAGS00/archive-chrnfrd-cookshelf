import { useState } from "react";
import { Recipe, MealPlan } from "../types/recipe";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Plus, X, ShoppingCart } from "lucide-react";

interface MealPlannerProps {
    mealPlan: MealPlan;
    recipes: Recipe[];
    onUpdateMealPlan: (mealPlan: MealPlan) => void;
    onGenerateShoppingList: () => void;
}

const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];
const MEALS = ["breakfast", "lunch", "dinner"] as const;

export function MealPlanner({
    mealPlan,
    recipes,
    onUpdateMealPlan,
    onGenerateShoppingList,
}: MealPlannerProps) {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<
        (typeof MEALS)[number] | null
    >(null);

    const addRecipeToMeal = (
        day: string,
        meal: (typeof MEALS)[number],
        recipeId: string
    ) => {
        const newMealPlan = { ...mealPlan };
        if (!newMealPlan[day]) {
            newMealPlan[day] = {};
        }
        newMealPlan[day][meal] = recipeId;
        onUpdateMealPlan(newMealPlan);
        setSelectedDay(null);
        setSelectedMeal(null);
    };

    const removeRecipeFromMeal = (
        day: string,
        meal: (typeof MEALS)[number]
    ) => {
        const newMealPlan = { ...mealPlan };
        if (newMealPlan[day]) {
            delete newMealPlan[day][meal];
        }
        onUpdateMealPlan(newMealPlan);
    };

    const getRecipeById = (id: string) => recipes.find((r) => r.id === id);

    const openMealSelector = (day: string, meal: (typeof MEALS)[number]) => {
        setSelectedDay(day);
        setSelectedMeal(meal);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <h2>Weekly Meal Plan</h2>
                </div>
                <Button onClick={onGenerateShoppingList} variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Generate Shopping List
                </Button>
            </div>

            <div className="grid gap-4">
                {DAYS.map((day) => (
                    <Card key={day} className="p-4">
                        <h3 className="mb-3 capitalize">{day}</h3>
                        <div className="grid md:grid-cols-3 gap-3">
                            {MEALS.map((meal) => {
                                const recipeId = mealPlan[day]?.[meal];
                                const recipe = recipeId
                                    ? getRecipeById(recipeId)
                                    : null;

                                return (
                                    <div
                                        key={meal}
                                        className="border rounded-lg p-3 min-h-[100px] flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                            >
                                                {meal}
                                            </Badge>
                                            {recipe && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        removeRecipeFromMeal(
                                                            day,
                                                            meal
                                                        )
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                        {recipe ? (
                                            <div className="flex-1">
                                                <p className="text-sm line-clamp-2">
                                                    {recipe.title}
                                                </p>
                                                {recipe.prepTime &&
                                                    recipe.cookTime && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {recipe.prepTime +
                                                                recipe.cookTime}{" "}
                                                            min
                                                        </p>
                                                    )}
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                className="flex-1 h-auto text-gray-400 hover:text-gray-600"
                                                onClick={() =>
                                                    openMealSelector(day, meal)
                                                }
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Recipe
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            {selectedDay && selectedMeal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3>
                                Select Recipe for {selectedDay} - {selectedMeal}
                            </h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    setSelectedDay(null);
                                    setSelectedMeal(null);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            {recipes
                                .filter(
                                    (r) =>
                                        !selectedMeal ||
                                        r.category === selectedMeal ||
                                        r.category === "any"
                                )
                                .map((recipe) => (
                                    <Button
                                        key={recipe.id}
                                        variant="outline"
                                        className="justify-start h-auto py-3"
                                        onClick={() =>
                                            addRecipeToMeal(
                                                selectedDay,
                                                selectedMeal,
                                                recipe.id
                                            )
                                        }
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span>{recipe.title}</span>
                                            <span className="text-xs text-gray-500">
                                                {recipe.category} •{" "}
                                                {recipe.prepTime &&
                                                recipe.cookTime
                                                    ? `${
                                                          recipe.prepTime +
                                                          recipe.cookTime
                                                      } min`
                                                    : "Time not set"}
                                            </span>
                                        </div>
                                    </Button>
                                ))}
                            {recipes.filter(
                                (r) =>
                                    !selectedMeal || r.category === selectedMeal
                            ).length === 0 && (
                                <p className="text-center text-gray-500 py-8">
                                    No recipes found for this meal type
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
