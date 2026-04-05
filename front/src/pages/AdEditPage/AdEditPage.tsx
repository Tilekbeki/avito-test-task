import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin, Alert } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { adsService } from '../../services/ads.service';
import { useAdDraft } from '../../shared/hooks/useAdDraft';
import AdForm from '../../components/AdForm';
import { validateAdForm, transformParamsForSubmit } from '../../shared/utils/formUtils';
import { useState } from 'react';

const AdEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loading, error, formData, setFormData, clearDraft } = useAdDraft(id);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData || !id) return;

    const { isValid, errors } = validateAdForm(formData);
    if (!isValid) {
      Object.values(errors).forEach((errorMsg) => {
        message.error(errorMsg);
      });
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

      const previousAd = queryClient.getQueryData(['ad', id]);

      const updatedAd = {
        ...previousAd,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(['ad', id], updatedAd);

      await adsService.updateAd(id, payload);

      await queryClient.invalidateQueries({ queryKey: ['ad', id] });
      await queryClient.invalidateQueries({ queryKey: ['ads'] });

      clearDraft();
      message.success('Изменения сохранены');

      navigate(`/ads/${id}`);
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);

      queryClient.invalidateQueries({ queryKey: ['ad', id] });

      message.error('Ошибка сохранения. Проверьте правильность заполнения полей.');
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
