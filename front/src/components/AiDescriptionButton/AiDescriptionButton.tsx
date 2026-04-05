// components/AiDescriptionButton.tsx
import { Button, Tooltip, Space, message, Modal } from 'antd';
import { useState } from 'react';
import { BulbOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
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
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [originalDescription, setOriginalDescription] = useState<string>('');

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
      setOriginalDescription(formData.description || '');
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
      setCompareModalOpen(true);
    }
  };

  const handleConfirmApply = () => {
    if (response) {
      onApply(response);
      message.success('Описание применено');
      setTooltipOpen(false);
      setCompareModalOpen(false);
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
      return <ReloadOutlined className="!text-[#FFA940]" />;
    }
    return <BulbOutlined className="!text-[#FFA940]" />;
  };

  // Функция для подсветки различий между текстами
  const highlightDifferences = (oldText: string, newText: string) => {
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);

    // Простая подсветка - находим добавленные и удаленные слова
    const result: JSX.Element[] = [];
    let i = 0,
      j = 0;

    while (i < oldWords.length || j < newWords.length) {
      if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
        // Слова совпадают
        result.push(
          <span key={`same-${i}`} className="text-gray-700">
            {oldWords[i]}
          </span>
        );
        i++;
        j++;
      } else if (j < newWords.length && !oldWords.includes(newWords[j])) {
        // Добавленные слова
        result.push(
          <span key={`added-${j}`} className="bg-green-100 text-green-800 px-0.5 rounded">
            {newWords[j]}
          </span>
        );
        j++;
      } else if (i < oldWords.length && !newWords.includes(oldWords[i])) {
        // Удаленные слова
        result.push(
          <span
            key={`removed-${i}`}
            className="bg-red-100 text-red-800 line-through px-0.5 rounded"
          >
            {oldWords[i]}
          </span>
        );
        i++;
      } else {
        i++;
        j++;
      }
    }

    return result;
  };

  const tooltipContent =
    status === 'error' ? (
      <div style={{ maxWidth: 300 }}>
        <div style={{ color: 'red', marginBottom: 8 }}>Произошла ошибка при запросе к AI</div>
        <div style={{ marginBottom: 8 }}>Попробуйте повторить запрос или закройте уведомление</div>
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
    <>
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
            width: '200px',
          }}
        >
          {getButtonText()}
        </Button>
      </Tooltip>

      {/* Модальное окно для сравнения "Было → Стало" */}
      <Modal
        title="Визуальное сравнение описаний"
        open={compareModalOpen}
        onOk={handleConfirmApply}
        onCancel={() => setCompareModalOpen(false)}
        width={800}
        okText="Применить новое описание"
        cancelText="Отмена"
      >
        <div className="flex gap-4">
          {/* Было */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-gray-600">Было:</div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
              {originalDescription || <span className="text-gray-400">Описание отсутствовало</span>}
            </div>
          </div>

          {/* Стало */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-green-600">Стало (предложение AI):</div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 min-h-[150px]">
              {response}
            </div>
          </div>
        </div>

        {/* Подсветка изменений */}
        {originalDescription && (
          <div className="mt-4">
            <div className="font-semibold mb-2">Подсветка изменений:</div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm mr-2">
                  Зеленый
                </span>
                <span className="text-sm">— добавленный текст</span>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 line-through rounded text-sm mr-2">
                  Красный
                </span>
                <span className="text-sm">— удаленный текст</span>
              </div>
              <div className="mt-3 p-2 bg-white rounded border">
                {highlightDifferences(originalDescription, response || '')}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AiDescriptionButton;
