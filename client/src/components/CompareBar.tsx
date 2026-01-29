import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GitCompare, X } from 'lucide-react';
import { useLocation } from 'wouter';

export function CompareBar() {
  const { items, removeItem, clearItems, maxItems } = useCompare();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="p-4 shadow-xl w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            <h3 className="font-semibold">
              对比 ({items.length}/{maxItems})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearItems}
          >
            清空
          </Button>
        </div>

        <div className="flex gap-2 mb-3 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.productId}
              className="relative flex-shrink-0"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">无图片</span>
                </div>
              )}
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={() => setLocation('/compare')}
          disabled={items.length < 2}
        >
          {items.length < 2 ? '至少选择2个产品' : '开始对比'}
        </Button>
      </Card>
    </div>
  );
}
