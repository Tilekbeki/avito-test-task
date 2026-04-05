// pages/AdviewPage/AdViewPage.tsx
import { Alert, Button, Spin } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import img from '../../assets/cover-big.png';
import { useAd } from '../../shared/hooks/useAd';
import {
  PARAM_LABELS,
  formatValue,
  getMissingFields,
  needsAttention,
} from '../../shared/types/ad.types';

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdViewPage = () => {
  const { id } = useParams();
  const { data: ad, isLoading, isError, refetchAd } = useAd(id);

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Spin size="large" tip="Загрузка объявления..." />
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <Alert
        message="Ошибка загрузки"
        description="Не удалось загрузить объявление. Попробуйте позже."
        type="error"
        showIcon
        className="m-6"
      />
    );
  }

  // 📭 Empty
  if (!ad) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Alert message="Объявление не найдено" type="info" showIcon />
      </div>
    );
  }

  const missingFields = getMissingFields(ad);
  const showAttention = needsAttention(ad);

  return (
    <div className="container mx-auto px-4 lg:px-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h1 className="font-family-roboto text-[28px] sm:text-[32px] font-medium">{ad.title}</h1>
        <div className="flex items-center gap-2">
          <div className="text-[28px] sm:text-[30px] font-family-roboto font-medium text-black/85">
            {ad.price} ₽
          </div>
        </div>
      </div>

      {/* ACTIONS & DATES */}
      <div className="flex flex-col sm:flex-row justify-between mb-8 items-start sm:items-center gap-4">
        <Link to={`/ads/${id}/edit`}>
          <Button
            type="primary"
            icon={<EditOutlined className="!text-[18px] !w-[18px] !h-[18px]" />}
            iconPlacement="end"
            className="!py-2 !h-[38px] font-family-inter !text-[16px] !rounded-[8px]"
          >
            Редактировать
          </Button>
        </Link>
        <div className="text-[#848388] flex flex-col text-left sm:text-right text-[16px] font-family-inter">
          <div>Опубликовано: {formatDate(ad.createdAt)}</div>
          <div>Обновлено: {formatDate(ad.updatedAt)}</div>
        </div>
      </div>

      <hr className="mb-8 border-[#F0F0F0]" />

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="w-full lg:w-[480px] lg:h-[360px] flex-shrink-0">
          <img src={img} alt="товар" className="w-full h-auto lg:h-full object-cover rounded" />
        </div>

        <div className="flex flex-col gap-6 w-full">
          {showAttention && (
            <Alert
              title="Требуются доработки"
              description={
                <div>
                  <p>У объявления не заполнены поля:</p>
                  <ul className="list-disc pl-6 [&_li::marker]:!text-[10px]">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              }
              type="warning"
              showIcon
              className="w-full lg:!max-w-[512px] animate-pulse"
            />
          )}

          <div>
            <div className="mb-2 text-[22px] font-family-roboto font-medium">Характеристики</div>
            {ad.params && Object.keys(ad.params).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-8 gap-y-2">
                {Object.entries(ad.params).map(([key, value]) => {
                  const label = PARAM_LABELS[key] || key;
                  const displayValue = formatValue(key, value);

                  return (
                    <div key={key} className="flex gap-3">
                      <div className="w-[180px] font-semibold text-black/45 font-family-inter text-[16px]">
                        {label}
                      </div>
                      <div className="text-[#1E1E1E] font-family-inter text-[16px]">
                        {displayValue || <span className="text-red-400">Не заполнено</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[#6e6e6e] font-family-roboto leading-[140%] text-[16px]">
                Нет характеристик. Добавьте их, чтобы повысить отклик.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:max-w-[480px]">
        <div className="mb-2 text-[22px] font-family-roboto font-medium">Описание</div>
        <div className="text-[#1E1E1E] font-family-roboto leading-[140%] text-[16px] leading-relaxed">
          {ad.description?.trim() || (
            <span className="text-[#6e6e6e] font-family-roboto leading-[140%] text-[16px]">
              Описание отсутствует. Добавьте описание, чтобы повысить отклик.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdViewPage;
