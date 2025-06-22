import {create} from 'zustand';

export const usePassReset = create((set) => ({
    user: null,
  resetPass: async ({pass, token }) => {
    try {
      const res = await fetch(`/api/resetting-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
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

export default usePassReset;