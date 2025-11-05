import { Recipe } from "../types/recipe";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
    Clock,
    ChefHat,
    Heart,
    Flame,
    Edit,
    Trash2,
    ShoppingCart,
    Play,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RecipeDetailProps {
    recipe: Recipe | null;
    open: boolean;
    onClose: () => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    onAddToShoppingList: (ingredients: string[]) => void;
    onStartCooking: (recipe: Recipe) => void;
}

export function RecipeDetail({
    recipe,
    open,
    onClose,
    onEdit,
    onDelete,
    onToggleFavorite,
    onAddToShoppingList,
    onStartCooking,
}: RecipeDetailProps) {
    if (!recipe) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <VisuallyHidden>
                    <DialogTitle>{recipe.title}</DialogTitle>
                </VisuallyHidden>
                <div className="relative h-64 bg-gray-100">
                    {recipe.image ? (
                        <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-pink-100">
                            <ChefHat className="w-24 h-24 text-gray-300" />
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h2>{recipe.title}</h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge
                                        variant="secondary"
                                        className="capitalize"
                                    >
                                        {recipe.category}
                                    </Badge>
                                    {recipe.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Button
                                size="icon"
                                variant={
                                    recipe.isFavorite ? "default" : "outline"
                                }
                                onClick={() => onToggleFavorite(recipe.id)}
                            >
                                <Heart
                                    className={`h-4 w-4 ${
                                        recipe.isFavorite ? "fill-white" : ""
                                    }`}
                                />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            {recipe.prepTime && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <div>
                                        <div className="text-gray-500">
                                            Prep
                                        </div>
                                        <div>{recipe.prepTime} min</div>
                                    </div>
                                </div>
                            )}
                            {recipe.cookTime && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <div>
                                        <div className="text-gray-500">
                                            Cook
                                        </div>
                                        <div>{recipe.cookTime} min</div>
                                    </div>
                                </div>
                            )}
                            {recipe.difficulty && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <ChefHat className="h-4 w-4" />
                                    <div>
                                        <div className="text-gray-500">
                                            Difficulty
                                        </div>
                                        <div className="capitalize">
                                            {recipe.difficulty}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {recipe.calories && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Flame className="h-4 w-4" />
                                    <div>
                                        <div className="text-gray-500">
                                            Calories
                                        </div>
                                        <div>{recipe.calories}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="mb-3">Ingredients</h3>
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-orange-500 mt-1">
                                        •
                                    </span>
                                    <span>{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="mb-3">Instructions</h3>
                        <ol className="space-y-4">
                            {recipe.steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 pt-0.5">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() => onStartCooking(recipe)}
                            className="flex-1"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Start Cooking Mode
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                onAddToShoppingList(recipe.ingredients)
                            }
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to List
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onEdit(recipe)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                onDelete(recipe.id);
                                onClose();
                            }}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
