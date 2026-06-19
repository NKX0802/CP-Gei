import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refreshRole() {
    const res = await fetch("/api/me");
    const data = await res.json();
    setUser(data.success ? data.data : null);
    setRole(data.success ? data.data.user_role : null);
    return data.success ? data.data.user_role : null;
  }

  useEffect(() => {
    refreshRole().finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    await router.push("/");
    setRole(null);
    setUser(null);
  }

  return (
    <RoleContext.Provider value={{ role, user, loading, refreshRole, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
