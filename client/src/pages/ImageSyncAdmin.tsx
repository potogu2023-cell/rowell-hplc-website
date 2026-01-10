import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useToast } from "../hooks/useToast";

export default function ImageSyncAdmin() {
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  // 获取同步状态
  const { data: status, refetch: refetchStatus, isLoading: statusLoading } = 
    trpc.admin.imageSync.status.useQuery();

  // 同步mutation
  const syncMutation = trpc.admin.imageSync.sync.useMutation({
    onSuccess: (result) => {
      setSyncing(false);
      refetchStatus();
      toast({
        title: "同步完成!",
        description: `成功: ${result.summary.successCount}, 失败: ${result.summary.failedCount}, 耗时: ${result.summary.duration}`,
        variant: "success",
      });
    },
    onError: (error) => {
      setSyncing(false);
      toast({
        title: "同步失败",
        description: error.message,
        variant: "error",
      });
    },
  });

  const handleSync = () => {
    if (confirm("确定要同步图片吗?这将更新products表中的imageUrl字段。")) {
      setSyncing(true);
      syncMutation.mutate();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">产品图片同步管理</h1>

      {/* 同步状态卡片 */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">同步状态</h2>
        
        {statusLoading ? (
          <div className="text-gray-500">加载中...</div>
        ) : status ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">制图团队已上传</div>
                <div className="text-3xl font-bold text-blue-600">
                  {status.crawler.totalImages}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  crawler_results表
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">已同步到网站</div>
                <div className="text-3xl font-bold text-green-600">
                  {status.products.cdnInstagramImages}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  products表
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">待同步图片</div>
              <div className="text-2xl font-bold text-yellow-600">
                {status.needSync > 0 ? status.needSync : "无"}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">总体覆盖率</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold">
                  {status.products.totalWithImages} / {status.products.totalProducts}
                </div>
                <div className="text-sm text-gray-500">
                  ({status.products.coverageRate})
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500">无法加载状态</div>
        )}
      </Card>

      {/* 同步操作卡片 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">同步操作</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ 同步说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 从 crawler_results 表读取制图团队上传的图片URL</li>
              <li>• 自动匹配并更新到 products 表</li>
              <li>• 更新后网站将立即显示新图片</li>
              <li>• 同步过程安全,不会影响现有数据</li>
            </ul>
          </div>

          <Button
            onClick={handleSync}
            disabled={syncing || !status || status.needSync <= 0}
            className="w-full"
            size="lg"
          >
            {syncing ? "同步中..." : `开始同步 (${status?.needSync || 0}张图片)`}
          </Button>

          {syncMutation.data && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ 同步结果</h3>
              <div className="text-sm text-green-800 space-y-1">
                <div>总计: {syncMutation.data.summary.totalFound}张</div>
                <div>成功: {syncMutation.data.summary.successCount}张</div>
                <div>失败: {syncMutation.data.summary.failedCount}张</div>
                <div>耗时: {syncMutation.data.summary.duration}</div>
              </div>

              {syncMutation.data.failedProducts && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-red-600">
                    查看失败记录 ({syncMutation.data.failedProducts.length})
                  </summary>
                  <div className="mt-2 text-xs text-red-700 space-y-1">
                    {syncMutation.data.failedProducts.map((item: any, idx: number) => (
                      <div key={idx}>
                        {item.productId}: {item.reason}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
