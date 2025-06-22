import { create } from 'zustand';

export const useLoginUser = create((set) => ({
  user: null,
  loginUser: async ({ username, password }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        set({ user: data.user });
      }

      return data;
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },
}));

export default useLoginUser;