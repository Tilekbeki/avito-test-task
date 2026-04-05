// components/AiDescriptionButton.tsx
import { Button, Tooltip, Space, message } from 'antd';
import { useState } from 'react';
import { BulbOutlined, LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { aiService } from '../../services/ai.service';

const AiDescriptionButton = ({
  formData,
  onApply,
}: {
  formData: any;
  onApply: (description: string) => void;
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClick = async () => {
    if (!formData) return;

    setStatus('loading');
    setTooltipOpen(false);

    try {
      const res = await aiService.generateDescription(
        formData.title,
        formData.params,
        formData.description
      );
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
    if (response) {
      onApply(response);
      message.success('Описание применено');
      setTooltipOpen(false);
    }
  };

  const getButtonText = () => {
    if (status === 'loading') return 'Выполняется запрос';
    if (status === 'error') return 'Повторить запрос';
    if (status === 'success') return 'Запросить снова';
    return formData?.description ? 'Улучшить описание' : 'Придумать описание';
  };

  const getButtonIcon = () => {
    if (status === 'loading') {
      return <LoadingOutlined className="!text-[#FFA940] animate-spin" />;
    }
    if (status === 'success') {
      return <ArrowRightOutlined className="!text-[#FFA940]" />;
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
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Ответ от AI:</div>
        <div style={{ marginBottom: 12, lineHeight: 1.5 }}>{response}</div>
        <Space style={{ marginTop: 12 }}>
          <Button size="small" type="primary" onClick={handleApply}>
            Применить описание
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
          !bg-[#F9F1E6] !text-[#FFA940]
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

export default AiDescriptionButton;
