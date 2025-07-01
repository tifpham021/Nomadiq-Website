import {create} from 'zustand';

export const useSaveInfo = create((set) => ({
    userPlan: null,
  saveInfo: async ({ destination, date, transportation }) => {
    try {
      const res = await fetch("/api/choose-destination-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, date, transportation}),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        set({ userPlan: data.userPlan });
        return {
            success: true,
            message: data.message || "Plan info saved",
            plan: data.userPlan
        }
      }

      return {
        success: false,
        message: data.message || "You didn't fill everything out",
      };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
},
}))

export default useSaveInfo;