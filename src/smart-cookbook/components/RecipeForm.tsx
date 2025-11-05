import { useState, useEffect, useCallback, startTransition } from "react";
import { Recipe } from "../types/recipe";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { X, Plus } from "lucide-react";
import { Badge } from "./ui/badge";

interface RecipeFormProps {
    recipe?: Recipe | null;
    open: boolean;
    onClose: () => void;
    onSave: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => void;
}

export function RecipeForm({ recipe, open, onClose, onSave }: RecipeFormProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [steps, setSteps] = useState<string[]>([""]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [difficulty, setDifficulty] = useState<
        "easy" | "medium" | "hard" | ""
    >("");
    const [calories, setCalories] = useState("");

    const resetForm = useCallback(() => {
        setTitle("");
        setCategory("");
        setImage("");
        setIngredients([""]);
        setSteps([""]);
        setTags([]);
        setTagInput("");
        setPrepTime("");
        setCookTime("");
        setDifficulty("");
        setCalories("");
    }, []);

    useEffect(() => {
        if (recipe) {
            startTransition(() => {
                setTitle(recipe.title);
                setCategory(recipe.category);
                setImage(recipe.image || "");
                setIngredients(
                    recipe.ingredients.length ? recipe.ingredients : [""]
                );
                setSteps(recipe.steps.length ? recipe.steps : [""]);
                setTags(recipe.tags);
                setPrepTime(recipe.prepTime?.toString() || "");
                setCookTime(recipe.cookTime?.toString() || "");
                setDifficulty(recipe.difficulty || "");
                setCalories(recipe.calories?.toString() || "");
            });
        } else {
            startTransition(resetForm);
        }
    }, [recipe, open, resetForm]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const recipeData = {
            title,
            category,
            image: image || undefined,
            ingredients: ingredients.filter((i) => i.trim()),
            steps: steps.filter((s) => s.trim()),
            tags,
            prepTime: prepTime ? parseInt(prepTime) : undefined,
            cookTime: cookTime ? parseInt(cookTime) : undefined,
            difficulty: difficulty || undefined,
            calories: calories ? parseInt(calories) : undefined,
            isFavorite: recipe?.isFavorite || false,
            collections: recipe?.collections || [],
        };

        onSave(recipeData);
        onClose();
    };

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, ""]);
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {recipe ? "Edit Recipe" : "Add New Recipe"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Recipe Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Grandma's Chocolate Cake"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="breakfast">
                                        Breakfast
                                    </SelectItem>
                                    <SelectItem value="lunch">Lunch</SelectItem>
                                    <SelectItem value="dinner">
                                        Dinner
                                    </SelectItem>
                                    <SelectItem value="dessert">
                                        Dessert
                                    </SelectItem>
                                    <SelectItem value="snack">Snack</SelectItem>
                                    <SelectItem value="appetizer">
                                        Appetizer
                                    </SelectItem>
                                    <SelectItem value="beverage">
                                        Beverage
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                value={difficulty}
                                onValueChange={(
                                    value: "easy" | "medium" | "hard"
                                ) => setDifficulty(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            type="url"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="prepTime">Prep Time (min)</Label>
                            <Input
                                id="prepTime"
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                placeholder="15"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cookTime">Cook Time (min)</Label>
                            <Input
                                id="cookTime"
                                type="number"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                                placeholder="30"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input
                                id="calories"
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="350"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Ingredients *</Label>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={ingredient}
                                    onChange={(e) =>
                                        updateIngredient(index, e.target.value)
                                    }
                                    placeholder="e.g., 2 cups flour"
                                    required={index === 0}
                                />
                                {ingredients.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addIngredient}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Ingredient
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Steps *</Label>
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="shrink-0 w-8 h-10 flex items-center justify-center text-gray-500">
                                    {index + 1}.
                                </div>
                                <Textarea
                                    value={step}
                                    onChange={(e) =>
                                        updateStep(index, e.target.value)
                                    }
                                    placeholder="Describe this step..."
                                    required={index === 0}
                                    rows={2}
                                />
                                {steps.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeStep(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addStep}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Step
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), addTag())
                                }
                                placeholder="e.g., vegetarian, quick"
                            />
                            <Button type="button" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="pl-2 pr-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {recipe ? "Update" : "Create"} Recipe
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
