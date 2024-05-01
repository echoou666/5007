import React, { useState, createContext } from "react";

// create context
export const FeedContext = createContext(null);

// provider component
export const FeedProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);

  return (
    <FeedContext.Provider value={{ feed, setFeed }}>
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;

