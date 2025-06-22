import {create} from 'zustand';

export const useEmailReset = create((set) => ({
    user: null,
  resetEmail: async ({ email }) => {
    try {
      const res = await fetch("/api/resetting-pass-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email}),
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
}))

export default useEmailReset;