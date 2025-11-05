"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { ShoppingListItem } from "../types/recipe";
import { storage } from "../lib/storage";

export function useShoppingList() {
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startTransition(() => {
            setShoppingList(storage.getShoppingList());
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            storage.saveShoppingList(shoppingList);
        }
    }, [shoppingList, loading]);

    const addItem = useCallback((ingredient: string, recipeId?: string) => {
        const newItem: ShoppingListItem = {
            id: `${Date.now()}-${Math.random()}`,
            ingredient,
            checked: false,
            recipeId,
        };
        setShoppingList((prev) => [...prev, newItem]);
    }, []);

    const addMultipleItems = useCallback(
        (ingredients: string[], recipeId?: string) => {
            const newItems: ShoppingListItem[] = ingredients.map(
                (ingredient) => ({
                    id: `${Date.now()}-${Math.random()}`,
                    ingredient,
                    checked: false,
                    recipeId,
                })
            );
            setShoppingList((prev) => [...prev, ...newItems]);
        },
        []
    );

    const toggleItem = useCallback((id: string) => {
        setShoppingList((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    }, []);

    const deleteItem = useCallback((id: string) => {
        setShoppingList((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const clearChecked = useCallback(() => {
        setShoppingList((prev) => prev.filter((item) => !item.checked));
    }, []);

    const clearAll = useCallback(() => {
        setShoppingList([]);
    }, []);

    const updateItems = useCallback((newItems: ShoppingListItem[]) => {
        setShoppingList(newItems);
    }, []);

    const getUncheckedCount = useCallback(() => {
        return shoppingList.filter((item) => !item.checked).length;
    }, [shoppingList]);

    const getCheckedCount = useCallback(() => {
        return shoppingList.filter((item) => item.checked).length;
    }, [shoppingList]);

    return {
        shoppingList,
        loading,
        addItem,
        addMultipleItems,
        toggleItem,
        deleteItem,
        clearChecked,
        clearAll,
        updateItems,
        getUncheckedCount,
        getCheckedCount,
    };
}
