import { useState } from "react";
import { Recipe } from "../types/recipe";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CookingModeProps {
    recipe: Recipe | null;
    open: boolean;
    onClose: () => void;
}

export function CookingMode({ recipe, open, onClose }: CookingModeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(
        new Set()
    );

    if (!recipe) return null;

    const totalSteps = recipe.steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleStepComplete = () => {
        const newCompleted = new Set(completedSteps);
        if (completedSteps.has(currentStep)) {
            newCompleted.delete(currentStep);
        } else {
            newCompleted.add(currentStep);
        }
        setCompletedSteps(newCompleted);
    };

    const handleClose = () => {
        setCurrentStep(0);
        setCompletedSteps(new Set());
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <VisuallyHidden>
                    <DialogTitle>Cooking Mode - {recipe.title}</DialogTitle>
                </VisuallyHidden>
                <div className="space-y-6">
                    <div>
                        <h2 className="mb-2">{recipe.title}</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                    Step {currentStep + 1} of {totalSteps}
                                </span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 min-h-[200px] flex items-center">
                        <div className="w-full">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                                    {currentStep + 1}
                                </div>
                                <p className="flex-1 text-lg leading-relaxed pt-2">
                                    {recipe.steps[currentStep]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {recipe.ingredients.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="mb-2 text-sm">
                                Ingredients Needed:
                            </h4>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                {recipe.ingredients
                                    .slice(0, 6)
                                    .map((ingredient, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="text-blue-600 mt-1">
                                                •
                                            </span>
                                            <span className="text-gray-700">
                                                {ingredient}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                            {recipe.ingredients.length > 6 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    +{recipe.ingredients.length - 6} more
                                    ingredients
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        <Button
                            variant={
                                completedSteps.has(currentStep)
                                    ? "default"
                                    : "outline"
                            }
                            onClick={toggleStepComplete}
                            className="flex-1 max-w-xs"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            {completedSteps.has(currentStep)
                                ? "Completed"
                                : "Mark Complete"}
                        </Button>

                        {currentStep < totalSteps - 1 ? (
                            <Button onClick={handleNext}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={handleClose} variant="default">
                                Finish
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
