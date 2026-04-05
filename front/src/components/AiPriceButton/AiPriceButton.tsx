// components/AiPriceButton.tsx
import { useState } from 'react';
import { Button, Space, Tooltip, message } from 'antd';
import {
  BulbOutlined,
  LoadingOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { aiService } from '../../services/ai.service';

const AiPriceButton = ({
  formData,
  onApply,
}: {
  formData: any;
  onApply: (price: number) => void;
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<{ title: string; suggestions: string[] } | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClick = async () => {
    if (!formData) return;

    setStatus('loading');
    setTooltipOpen(false);

    try {
      const res = await aiService.getMarketPrice(formData.title, formData.params);
      setResponse(res);
      setStatus('success');
      setTooltipOpen(true);
    } catch {
      setStatus('error');
      setResponse(null);
      setTooltipOpen(true);
    }
  };

  const handleApply = () => {
    if (response?.suggestions?.[0]) {
      // Ищем первую цену в первом предложении
      const match = response.suggestions[0].match(/(\d[\d\s]*)\s*–\s*(\d[\d\s]*)\s*₽/);
      if (match) {
        const price = parseInt(match[2].replace(/\s/g, ''), 10);
        if (!isNaN(price)) {
          onApply(price);
          message.success('Цена применена');
          setTooltipOpen(false);
        }
      } else {
        // Альтернативный поиск цены
        const altMatch = response.suggestions[0].match(/(\d[\d\s]*)\s*₽/);
        if (altMatch) {
          const price = parseInt(altMatch[1].replace(/\s/g, ''), 10);
          if (!isNaN(price)) {
            onApply(price);
            message.success('Цена применена');
            setTooltipOpen(false);
          }
        }
      }
    }
  };

  const getButtonText = () => {
    if (status === 'loading') return 'Выполняется запрос';
    if (status === 'error') return 'Повторить запрос';
    if (status === 'success') return 'Запросить снова';
    return 'Узнать рыночную цену';
  };

  const getButtonIcon = () => {
    if (status === 'loading') {
      return <LoadingOutlined className="!text-[#FFA940] animate-spin" />;
    }
    if (status === 'success') {
      return <ReloadOutlined className="!text-[#FFA940]" />;
    }
    return <BulbOutlined className="!text-[#FFA940]" />;
  };

  const tooltipContent =
    status === 'error' ? (
      <div style={{ maxWidth: 300 }}>
        <div style={{ color: 'red', marginBottom: 8 }}>Произошла ошибка при запросе к AI</div>
        <Button size="small" onClick={() => setTooltipOpen(false)}>
          Закрыть
        </Button>
      </div>
    ) : (
      <div style={{ maxWidth: 400 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{response?.title}</div>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          {response?.suggestions?.map((s, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {s}
            </li>
          ))}
        </ul>
        <Space style={{ marginTop: 12 }}>
          <Button size="small" type="primary" onClick={handleApply}>
            Применить цену
          </Button>
          <Button size="small" onClick={() => setTooltipOpen(false)}>
            Закрыть
          </Button>
        </Space>
      </div>
    );

  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={setTooltipOpen}
      title={tooltipContent}
      trigger="click"
      color="white"
      overlayInnerStyle={{
        color: '#000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
      }}
    >
      <Button
        onClick={handleClick}
        loading={status === 'loading'}
        icon={getButtonIcon()}
        className={`
          !h-[38px] !rounded-[8px] !font-family-inter !text-[16px] !font-medium
          ${status === 'loading' ? '!bg-[#F9F1E6] !text-[#FFA940]' : '!bg-[#F9F1E6] !text-[#FFA940]'}
          hover:!opacity-80 transition-opacity
        `}
        style={{
          backgroundColor: '#F9F1E6',
          color: '#FFA940',
          border: 'none',
        }}
      >
        {getButtonText()}
      </Button>
    </Tooltip>
  );
};

export default AiPriceButton;
