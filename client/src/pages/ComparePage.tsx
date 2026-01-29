import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

type Product = {
  id: number;
  partNumber: string;
  name: string;
  brand: string;
  category: string | null;
  particleSize: string | null;
  poreSize: string | null;
  length: string | null;
  innerDiameter: string | null;
  phRange: string | null;
  maxPressure: string | null;
  maxTemperature: string | null;
  description: string | null;
  imageUrl: string | null;
};

// Helper function to check if values are different
function shouldHighlight(values: (string | null)[]): boolean {
  const uniqueValues = new Set(values.filter(v => v !== null));
  return uniqueValues.size > 1;
}

// Get highlight class based on parameter type
function getHighlightClass(paramName: string, values: (string | null)[]): string {
  if (!shouldHighlight(values)) {
    return '';
  }

  const numericParams = ['particleSize', 'poreSize', 'length', 'innerDiameter', 'maxPressure', 'maxTemperature'];
  const textParams = ['brand', 'name', 'category', 'description'];
  const rangeParams = ['phRange'];

  if (numericParams.includes(paramName)) {
    return 'bg-yellow-100 dark:bg-yellow-900/30';
  } else if (textParams.includes(paramName)) {
    return 'bg-blue-100 dark:bg-blue-900/30';
  } else if (rangeParams.includes(paramName)) {
    return 'bg-green-100 dark:bg-green-900/30';
  }

  return '';
}

export default function ComparePage() {
  const { items, clearItems } = useCompare();
  const [, setLocation] = useLocation();

  const { data: products, isLoading } = trpc.products.getByIds.useQuery(
    { productIds: items.map(item => item.productId) },
    { enabled: items.length > 0 }
  );

  useEffect(() => {
    if (items.length < 2) {
      setLocation('/products');
    }
  }, [items.length, setLocation]);

  const handleExportPDF = () => {
    window.print();
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
          <h2 className="text-2xl font-bold mb-4">无法加载产品信息</h2>
          <Button onClick={() => setLocation('/products')}>
            返回产品列表
          </Button>
        </Card>
      </div>
    );
  }

  const compareParams = [
    { key: 'imageUrl', label: '图片', type: 'image' },
    { key: 'brand', label: '品牌', type: 'text' },
    { key: 'name', label: '型号', type: 'text' },
    { key: 'partNumber', label: '零件号', type: 'text' },
    { key: 'category', label: '分类', type: 'text' },
    { key: 'particleSize', label: '粒径', type: 'numeric' },
    { key: 'poreSize', label: '孔径', type: 'numeric' },
    { key: 'length', label: '长度', type: 'numeric' },
    { key: 'innerDiameter', label: '内径', type: 'numeric' },
    { key: 'phRange', label: 'pH范围', type: 'range' },
    { key: 'maxPressure', label: '最大压力', type: 'numeric' },
    { key: 'maxTemperature', label: '最高温度', type: 'numeric' },
    { key: 'description', label: '描述', type: 'text' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回产品列表
            </Button>
            <h1 className="text-3xl font-bold">产品对比</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearItems}
            >
              清空对比
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              导出为PDF
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold bg-muted/50 sticky left-0 z-10">
                  参数
                </th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-left font-semibold min-w-[200px]">
                    <div className="space-y-2">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      <p className="font-semibold">{product.brand}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareParams.map((param) => {
                const values = products.map(p => (p as any)[param.key]);
                const highlightClass = param.type !== 'image' 
                  ? getHighlightClass(param.key, values)
                  : '';

                return (
                  <tr key={param.key} className="border-b">
                    <td className="p-4 font-medium bg-muted/30 sticky left-0 z-10">
                      {param.label}
                    </td>
                    {products.map((product, index) => {
                      const value = (product as any)[param.key];
                      
                      if (param.type === 'image') {
                        return (
                          <td key={product.id} className="p-4">
                            {/* Image already shown in header */}
                          </td>
                        );
                      }

                      return (
                        <td 
                          key={product.id} 
                          className={`p-4 ${highlightClass}`}
                        >
                          {value || '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Legend */}
        <Card className="mt-6 p-4 no-print">
          <h3 className="font-semibold mb-3">高亮说明</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border rounded"></div>
              <span>数值参数差异</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border rounded"></div>
              <span>文本参数差异</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border rounded"></div>
              <span>范围参数差异</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            font-size: 12pt;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          .bg-muted\\/30,
          .bg-muted\\/50 {
            background-color: #f5f5f5 !important;
          }
        }
      `}</style>
    </div>
  );
}
