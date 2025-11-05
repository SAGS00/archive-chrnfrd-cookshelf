import { useState } from 'react';
import { ShoppingListItem } from '../types/recipe';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ShoppingCart, Plus, Trash2, Download } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onUpdateItems: (items: ShoppingListItem[]) => void;
}

export function ShoppingList({ items, onUpdateItems }: ShoppingListProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      const item: ShoppingListItem = {
        id: Date.now().toString(),
        ingredient: newItem.trim(),
        checked: false,
      };
      onUpdateItems([...items, item]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    onUpdateItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    onUpdateItems(items.filter((item) => !item.checked));
  };

  const exportList = () => {
    const text = items
      .map((item) => `${item.checked ? '✓' : '○'} ${item.ingredient}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uncheckedCount = items.filter((item) => !item.checked).length;
  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2>Shopping List</h2>
          {items.length > 0 && (
            <span className="text-sm text-gray-500">
              ({uncheckedCount} remaining, {checkedCount} checked)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {checkedCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompleted}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Completed
            </Button>
          )}
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportList}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add item (e.g., 2 cups milk)"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your shopping list is empty</p>
            <p className="text-sm">
              Add items manually or generate from your meal plan
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <span
                  className={`flex-1 ${
                    item.checked ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {item.ingredient}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
