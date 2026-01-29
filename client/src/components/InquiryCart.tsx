import { useInquiryCart } from '@/contexts/InquiryCartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

export function InquiryCart() {
  const { items, removeItem } = useInquiryCart();
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating cart button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full shadow-lg h-14 w-14 p-0"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
            {items.length}
          </span>
        </Button>
      </div>

      {/* Cart panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96">
          <Card className="p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">询价车 ({items.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-2 border rounded-lg"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Part: {item.partNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  setLocation('/inquiry');
                }}
              >
                前往询价
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
