import React from 'react';

// Компонент Label со звездочкой (для основных полей)
export const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <label className="block font-family-inter mb-2 font-semibold text-[16px]">
    {required && <span className="text-red-500 mr-1">*</span>}
    {text}
  </label>
);

// Компонент для обычного текста (не жирный)
export const RegularLabel = ({ text, required }: { text: string; required?: boolean }) => (
  <div className="block text-black/85 text-[14px] font-family-roboto mb-2">
    {required && <span className="text-red-500 mr-1">*</span>}
    {text}
  </div>
);
