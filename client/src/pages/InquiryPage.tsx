import { useInquiryCart } from '@/contexts/InquiryCartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function InquiryPage() {
  const { items, removeItem, clearCart } = useInquiryCart();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createInquiry = trpc.inquiries.create.useMutation({
    onSuccess: (data) => {
      clearCart();
      toast.success(data.message);
      setLocation(`/inquiry/success?number=${data.inquiryNumber}`);
    },
    onError: (error) => {
      toast.error(error.message || '提交询价失败，请稍后重试');
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = '姓名长度应在 2-50 个字符之间';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (formData.message && formData.message.length > 500) {
      newErrors.message = '留言最多 500 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('请至少选择一个产品');
      return;
    }

    if (!validateForm()) {
      return;
    }

    createInquiry.mutate({
      productIds: items.map(item => item.productId),
      userInfo: {
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        message: formData.message || undefined,
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">询价车为空</h2>
          <p className="text-muted-foreground mb-6">
            您还没有添加任何产品到询价车
          </p>
          <Button onClick={() => setLocation('/products')}>
            浏览产品
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">询价单</h1>

        <div className="space-y-6">
          {/* Selected Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              已选产品 ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Part: {item.partNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
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
          </Card>

          {/* Contact Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">联系信息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入您的姓名"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  邮箱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入您的邮箱"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">公司</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="请输入您的公司名称（可选）"
                />
              </div>

              <div>
                <Label htmlFor="phone">电话</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入您的联系电话（可选）"
                />
              </div>

              <div>
                <Label htmlFor="message">留言</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="请输入您的留言或特殊要求（可选，最多500字）"
                  rows={4}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.message.length}/500
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createInquiry.isPending}
              >
                {createInquiry.isPending ? '提交中...' : '提交询价'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
