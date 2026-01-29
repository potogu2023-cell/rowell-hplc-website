import { useInquiryCart } from '@/contexts/InquiryCartContext';
import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/lib/trpc';
import { Check, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { addItem: addToInquiry, isInCart } = useInquiryCart();
  const { addItem: addToCompare, isInCompare, canAddMore, maxItems, items: compareItems } = useCompare();

  const handleAddToInquiry = (product: any) => {
    addToInquiry({
      productId: product.id,
      partNumber: product.partNumber,
      name: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
    });
    toast.success('已添加到询价车');
  };

  const handleToggleCompare = (product: any, checked: boolean) => {
    if (checked) {
      if (!canAddMore) {
        toast.error(`最多只能对比 ${maxItems} 个产品`);
        return;
      }
      addToCompare({
        productId: product.id,
        partNumber: product.partNumber,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
      });
      toast.success('已添加到对比列表');
    } else {
      // Remove from compare will be handled by CompareBar
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">暂无产品</h2>
          <p className="text-muted-foreground">
            目前还没有添加任何产品。请稍后再来查看。
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">HPLC 产品目录</h1>
          <p className="text-muted-foreground">
            浏览我们的 HPLC 色谱柱产品，您可以将产品添加到询价车或对比列表
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {/* Compare checkbox */}
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                  <Checkbox
                    id={`compare-${product.id}`}
                    checked={isInCompare(product.id)}
                    onCheckedChange={(checked) => handleToggleCompare(product, checked as boolean)}
                    disabled={!canAddMore && !isInCompare(product.id)}
                  />
                  <label
                    htmlFor={`compare-${product.id}`}
                    className="text-xs cursor-pointer"
                  >
                    对比
                  </label>
                </div>
              </div>

              {/* Product image */}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">无图片</span>
                </div>
              )}

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <p>Part: {product.partNumber}</p>
                  {product.particleSize && <p>粒径: {product.particleSize}</p>}
                  {product.length && product.innerDiameter && (
                    <p>尺寸: {product.length} × {product.innerDiameter}</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant={isInCart(product.id) ? 'secondary' : 'default'}
                  onClick={() => handleAddToInquiry(product)}
                  disabled={isInCart(product.id)}
                >
                  {isInCart(product.id) ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      已加入
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      加入询价单
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
