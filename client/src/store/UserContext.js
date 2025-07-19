import axios from "axios";

const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) {
      const localUser = localStorage.getItem("user");
      if (!localUser) {
        axios
          .get("/profile", { withCredentials: true })
          .then(({ data }) => {
            setUser(data);
            setReady(true);
          })
          .catch((error) => {
            setReady(true);
          });
      } else {
        setUser(JSON.parse(localUser));
        setReady(true);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <UserContext.Provider value={{ user, setUser, ready, setReady, logout }}>
      {children}
    </UserContext.Provider>
  );
}
