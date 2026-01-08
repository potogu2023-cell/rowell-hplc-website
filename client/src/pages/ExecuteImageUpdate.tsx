import { useEffect, useState } from 'react';
import { trpc } from '../trpc';

export default function ExecuteImageUpdate() {
  const [status, setStatus] = useState<string>('准备执行更新...');
  const [results, setResults] = useState<any>(null);
  
  const updateMutation = trpc.updateProductImages.useMutation();
  const verifyMutation = trpc.verifyImageUpdates.useMutation();

  useEffect(() => {
    // 自动执行更新
    const executeUpdate = async () => {
      try {
        setStatus('正在更新产品图片...');
        const updateResult = await updateMutation.mutateAsync();
        setStatus('更新完成!正在验证...');
        
        const verifyResult = await verifyMutation.mutateAsync();
        setResults({
          update: updateResult,
          verify: verifyResult
        });
        setStatus('所有操作完成!');
      } catch (error: any) {
        setStatus(`错误: ${error.message}`);
      }
    };

    executeUpdate();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>产品图片批量更新</h1>
      <div style={{ 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>执行状态</h2>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
      </div>

      {results && (
        <div style={{ marginTop: '30px' }}>
          <h2>执行结果</h2>
          <div style={{ 
            padding: '20px', 
            background: '#e8f5e9', 
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            <h3>更新结果</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(results.update, null, 2)}
            </pre>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#e3f2fd', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3>验证结果</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(results.verify, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
