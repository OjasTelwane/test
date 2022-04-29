/*******************************************************************************************************
 * useSessionStorage file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 29/09/2021 Ojas Telwane	Created 
 *******************************************************************************************************/

import { useState, useEffect } from 'react';

export function getSessionStorageOrDefault(key, defaultValue) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export function setSessionStrage(key, values) {
  sessionStorage.setItem(key, JSON.stringify(values));
}

export function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}

export function useSessionStorage(key, defaultValue) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
