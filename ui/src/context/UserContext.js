import React, { useState, createContext } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const localSt = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localSt ? true : false;
  const [user, setUser] = useState(localSt ? localSt : null);

  // console.log(isLoggedIn);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
