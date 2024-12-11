// src/context/IndexingContext.js
import { createContext, useState } from "react";

export const IndexingContext = createContext();

export const IndexingProvider = ({ children }) => {
  const [isIndexing, setIsIndexing] = useState(false);

  return (
    <IndexingContext.Provider value={{ isIndexing, setIsIndexing }}>
      {children}
    </IndexingContext.Provider>
  );
};
