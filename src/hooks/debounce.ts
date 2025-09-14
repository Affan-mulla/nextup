export const debounce = (fn: Function, delay = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };