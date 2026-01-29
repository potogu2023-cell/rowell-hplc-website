import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useLocation, useSearch } from 'wouter';

export default function InquirySuccessPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const inquiryNumber = searchParams.get('number');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">询价提交成功！</h1>

          {inquiryNumber && (
            <div className="bg-muted p-6 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-2">您的询价单号</p>
              <p className="text-2xl font-mono font-bold text-primary">
                {inquiryNumber}
              </p>
            </div>
          )}

          <div className="space-y-4 text-left mb-8">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                📧 请查收确认邮件
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                我们已向您的邮箱发送了询价确认邮件，请注意查收。
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                💾 请保存询价单号
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                建议您保存询价单号以便后续查询。
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                ⏰ 我们会尽快联系您
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                我们的销售团队将在 1-2 个工作日内与您联系，为您提供详细的产品报价和交货期信息。
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setLocation('/products')}
            >
              继续浏览产品
            </Button>
            <Button onClick={() => setLocation('/')}>
              返回首页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
