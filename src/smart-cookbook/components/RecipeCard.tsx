import type { MouseEvent } from "react";
import { Recipe } from "../types/recipe";
import { Clock, ChefHat, Heart, MoreVertical } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RecipeCardProps {
    recipe: Recipe;
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

export function RecipeCard({
    recipe,
    onView,
    onEdit,
    onDelete,
    onToggleFavorite,
}: RecipeCardProps) {
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div onClick={() => onView(recipe)}>
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {recipe.image ? (
                        <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-pink-100">
                            <ChefHat className="w-16 h-16 text-gray-300" />
                        </div>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            onToggleFavorite(recipe.id);
                        }}
                    >
                        <Heart
                            className={`h-4 w-4 ${
                                recipe.isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                            }`}
                        />
                    </Button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                        className="flex-1 line-clamp-2"
                        onClick={() => onView(recipe)}
                    >
                        {recipe.title}
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(event: MouseEvent<HTMLButtonElement>) =>
                                event.stopPropagation()
                            }
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(recipe)}>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(recipe)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(recipe.id)}
                                className="text-red-600"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {totalTime > 0 && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{totalTime} min</span>
                        </div>
                    )}
                    {recipe.difficulty && (
                        <Badge variant="outline" className="capitalize">
                            {recipe.difficulty}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="capitalize">
                        {recipe.category}
                    </Badge>
                    {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                    {recipe.tags.length > 2 && (
                        <Badge variant="outline">
                            +{recipe.tags.length - 2}
                        </Badge>
                    )}
                </div>
            </div>
        </Card>
    );
}
