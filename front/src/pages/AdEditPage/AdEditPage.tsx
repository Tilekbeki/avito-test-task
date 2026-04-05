// pages/ads/AdEditPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin, Alert } from 'antd';
import { adsService } from '../../services/ads.service';
import { useAdDraft } from './hooks';
import AdForm from '../../components/AdForm';
import { requiredFieldsByCategory } from './constants';
import { transformParamsForSubmit, validateAdForm } from '../../shared/utils/formUtils';
import { useState } from 'react';

const AdEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, formData, setFormData, clearDraft } = useAdDraft(id);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData || !id) return;

    // Валидация
    const { isValid, errors } = validateAdForm(formData);
    if (!isValid) {
      Object.values(errors).forEach((error) => message.error(error));
      return;
    }

    setSaving(true);
    try {
      const transformedParams = transformParamsForSubmit(formData.category, formData.params);
      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description || '',
        price: Number(formData.price),
        params: transformedParams,
      };

      await adsService.updateAd(id, payload);
      clearDraft();
      message.success('✅ Изменения сохранены');
      navigate(`/ads/${id}`);
    } catch (error) {
      message.error('❌ Ошибка сохранения. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    clearDraft();
    navigate(`/ads/${id}`);
  };

  if (loading || !formData) {
    return <Spin tip="Загрузка..." className="mt-20" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <AdForm
      formData={formData}
      onChange={setFormData}
      onSave={handleSave}
      onCancel={handleCancel}
      saving={saving}
    />
  );
};

export default AdEditPage;
