import { useState } from "react";
import { aiService } from "../../services/ai.service";

export const useAiDescription = () => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const generate = async (title: string, params: Record<string, any>, description?: string) => {
    setLoading(true);
    setFailed(false);

    try {
      const res = await aiService.generateDescription(title, params, description);
      setResponse(res);
      return res;
    } catch {
      setFailed(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, failed, response, generate };
};