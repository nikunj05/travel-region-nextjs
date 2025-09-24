export function formatApiErrorMessage(error: unknown): string {
  const anyErr: any = error as any;
  const payload = anyErr?.response?.data || anyErr?.data || anyErr;

  let message: string | undefined = payload?.message || anyErr?.message;

  const fieldMessages: string[] = [];
  if (payload && typeof payload === 'object') {
    Object.keys(payload).forEach((key) => {
      if (key === 'message' || key === 'status') return;
      const value = (payload as any)[key];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string') fieldMessages.push(v);
        });
      } else if (typeof value === 'string') {
        fieldMessages.push(value);
      }
    });
  }

  const stripHtml = (text: string) => text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const cleanedMessage = message ? stripHtml(String(message)) : undefined;

  const combined = [cleanedMessage, ...fieldMessages]
    .filter(Boolean)
    .map((s) => String(s).trim());

  const unique = Array.from(new Set(combined));
  if (unique.length > 0) return unique.join(' ');

  return 'Something went wrong. Please try again.';
}

export function formatApiErrorMessages(error: unknown): string[] {
  const anyErr: any = error as any;
  const payload = anyErr?.response?.data || anyErr?.data || anyErr;

  let message: string | undefined = payload?.message || anyErr?.message;

  const fieldMessages: string[] = [];
  if (payload && typeof payload === 'object') {
    Object.keys(payload).forEach((key) => {
      if (key === 'message' || key === 'status') return;
      const value = (payload as any)[key];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string') fieldMessages.push(v);
        });
      } else if (typeof value === 'string') {
        fieldMessages.push(value);
      }
    });
  }

  const stripHtml = (text: string) => text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const cleanedMessage = message ? stripHtml(String(message)) : undefined;

  const allMessages = [cleanedMessage, ...fieldMessages]
    .filter(Boolean)
    .map((s) => String(s).trim());

  const unique = Array.from(new Set(allMessages));
  
  if (unique.length > 0) return unique;
  
  return ['Something went wrong. Please try again.'];
}
