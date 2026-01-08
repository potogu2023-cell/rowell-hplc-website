import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle2, XCircle, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Progress } from "../components/ui/progress";

export default function AdminImageUpdate() {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const updateMutation = trpc.admin.updateProductImages.useMutation();
  const verifyQuery = trpc.admin.verifyImageUpdates.useQuery(undefined, {
    enabled: false,
  });

  // 检查用户是否为管理员
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            您没有权限访问此页面。仅管理员可以执行批量更新操作。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!confirm("确定要批量更新55张产品图片吗?此操作将覆盖现有的图片URL。")) {
      return;
    }

    setIsUpdating(true);
    setUpdateResult(null);
    
    try {
      const result = await updateMutation.mutateAsync();
      setUpdateResult(result);
      
      // 更新成功后自动验证
      if (result.updated > 0) {
        setTimeout(() => {
          verifyQuery.refetch();
        }, 1000);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setUpdateResult({
        total: 55,
        updated: 0,
        failed: 55,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerify = async () => {
    const result = await verifyQuery.refetch();
    setVerifyResult(result.data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">产品图片批量更新</h1>
        <p className="text-muted-foreground">
          将55张AI生成的产品图片URL批量更新到数据库
        </p>
      </div>

      {/* 更新操作卡片 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            批量更新操作
          </CardTitle>
          <CardDescription>
            点击下方按钮开始更新55张产品图片的URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                size="lg"
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在更新...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    开始批量更新
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleVerify}
                variant="outline"
                size="lg"
                disabled={verifyQuery.isFetching}
              >
                {verifyQuery.isFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    验证中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    验证更新结果
                  </>
                )}
              </Button>
            </div>

            {isUpdating && (
              <div className="space-y-2">
                <Progress value={33} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  正在更新数据库...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 更新结果 */}
      {updateResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {updateResult.failed === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              更新结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {updateResult.total}
                  </div>
                  <div className="text-sm text-muted-foreground">总数</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {updateResult.updated}
                  </div>
                  <div className="text-sm text-muted-foreground">成功</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {updateResult.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">失败</div>
                </div>
              </div>

              {updateResult.errors && updateResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">错误信息:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {updateResult.errors.map((error: string, index: number) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {updateResult.failed === 0 && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    所有产品图片URL已成功更新!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 验证结果 */}
      {verifyResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              验证结果
            </CardTitle>
            <CardDescription>
              数据库中产品图片的当前状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    找到的产品数
                  </div>
                  <div className="text-2xl font-bold">
                    {verifyResult.found} / {verifyResult.total}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    已有图片的产品
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {verifyResult.withImages}
                  </div>
                </div>
              </div>

              {verifyResult.withoutImages > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    还有 {verifyResult.withoutImages} 个产品没有图片URL
                  </AlertDescription>
                </Alert>
              )}

              {verifyResult.withImages === verifyResult.total && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ 所有产品都已成功设置图片URL!
                  </AlertDescription>
                </Alert>
              )}

              {/* 显示部分产品详情 */}
              {verifyResult.products && verifyResult.products.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">产品详情 (前10个):</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {verifyResult.products.slice(0, 10).map((product: any) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.productId}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {product.name}
                          </div>
                        </div>
                        <div className="ml-4">
                          {product.imageUrl ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
