const listeners = new Set();

export const subscribeToast = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const showToast = (message, type = "success", duration = 3500) => {
  const toast = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    type,
    duration,
  };
  listeners.forEach((listener) => listener(toast));
  return toast.id;
};

export const showSuccessToast = (message, duration) =>
  showToast(message, "success", duration);

export const showErrorToast = (message, duration) =>
  showToast(message, "error", duration);

