import { useState } from 'react';

export const useConst = <T>(initialValue: T | (() => T)): T => {
  const [value] = useState<T>(initialValue);
  return value;
};
