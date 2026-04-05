import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdCard from '../components/adCard/AdCard';
import type { ItemWithRevision, Category } from '../shared/types/ad.types';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const createMockAd = (overrides: Partial<ItemWithRevision> = {}): ItemWithRevision => ({
  id: '1',
  category: 'auto' as Category,
  title: 'Toyota Camry 2022',
  price: 1500000,
  description: 'Отличный автомобиль',
  needsRevision: false,
  params: {
    brand: 'Toyota',
    model: 'Camry',
    yearOfManufacture: 2022,
  },
  ...overrides,
});

describe('AdCard', () => {
  it('должен рендерить название объявления', () => {
    const ad = createMockAd({ title: 'Test Car' });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('Test Car')).toBeInTheDocument();
  });

  it('должен рендерить цену с форматированием', () => {
    const ad = createMockAd({ price: 1500000 });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('1 500 000 ₽')).toBeInTheDocument();
  });

  it('должен рендерить метку категории для auto', () => {
    const ad = createMockAd({ category: 'auto' });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('Транспорт')).toBeInTheDocument();
  });

  it('должен рендерить метку категории для electronics', () => {
    const ad = createMockAd({ category: 'electronics' });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('должен рендерить метку категории для real_estate', () => {
    const ad = createMockAd({ category: 'real_estate' });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('Недвижимость')).toBeInTheDocument();
  });

  it('должен рендерить тег "Требует доработок" когда needsRevision=true', () => {
    const ad = createMockAd({ needsRevision: true });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.getByText('Требует доработок')).toBeInTheDocument();
  });

  it('не должен рендерить тег "Требует доработок" когда needsRevision=false', () => {
    const ad = createMockAd({ needsRevision: false });
    renderWithRouter(<AdCard ad={ad} />);

    expect(screen.queryByText('Требует доработок')).not.toBeInTheDocument();
  });

  it('должен рендерить в режиме grid по умолчанию', () => {
    const ad = createMockAd();
    const { container } = renderWithRouter(<AdCard ad={ad} />);

    // В grid режиме ссылка имеет фиксированную ширину
    const link = container.querySelector('a');
    expect(link).toHaveClass('w-[200px]');
  });

  it('должен рендерить в режиме list', () => {
    const ad = createMockAd();
    const { container } = renderWithRouter(<AdCard ad={ad} viewMode="list" />);

    // В list режиме Card имеет класс w-full
    const card = container.querySelector('.ant-card');
    expect(card).toHaveClass('w-full');
  });

  it('должен содержать ссылку на страницу объявления', () => {
    const ad = createMockAd({ id: '123' });
    const { container } = renderWithRouter(<AdCard ad={ad} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/ads/123');
  });
});
