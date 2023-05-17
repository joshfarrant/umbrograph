import { useState, useEffect } from 'react';

type TScrollingRandomString = (options: {
  duration?: number;
  interval?: number;
  finalString: string;
}) => { randomString: string; lockedString: string };

const generateRandomString = (length: number): string => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useScrollingRandomString: TScrollingRandomString = ({
  finalString,
  duration = 1400,
  interval = 80,
}) => {
  const [randomString, setRandomString] = useState('');
  const [lockedString, setLockedString] = useState('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const length = finalString.length;

  const generate = () => {
    setRandomString(generateRandomString(length));
    setLockedString('');
    let timeElapsed = 0;
    let localLockedString = '';

    const generateString = () => {
      setRandomString(generateRandomString(length));

      timeElapsed += interval;
      if (duration !== -1 && timeElapsed >= duration) {
        if (localLockedString.length === length) {
          clearInterval(intervalId);
          setIntervalId(undefined);
          return;
        }

        localLockedString += finalString[localLockedString.length];
        setLockedString(localLockedString);
      }
    };

    const id = setInterval(generateString, interval);
    setIntervalId(id);

    return { id };
  };

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const { id } = generate();

    return () => clearInterval(id);
  }, [length, duration, finalString]);

  return {
    randomString: randomString.slice(0, length - lockedString.length),
    lockedString,
  };
};
