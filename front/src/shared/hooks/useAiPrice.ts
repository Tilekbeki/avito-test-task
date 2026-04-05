import { useState } from "react";
import { aiService, type AiPriceResponse } from "../../services/ai.service";

export const useAiPrice = () => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [response, setResponse] = useState<AiPriceResponse | null>(null);

  const getPrice = async (title: string, params: Record<string, any>) => {
    setLoading(true);
    setFailed(false);

    try {
      const res = await aiService.getMarketPrice(title, params);
      setResponse(res);
      return res;
    } catch {
      setFailed(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, failed, response, getPrice };
};