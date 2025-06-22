import { create } from 'zustand';

export const useCreateUser = create ((set) => ({
    user_info: [],
    setInfo: (user_info) => set({user_info}),
    createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.confirmpass) {
            return { success: false, message: "Please fill out all fields" };
        }
        if (newUser.confirmpass !== newUser.password) {
            return { success: false, message: "Your confirm password didn't match with your password" };
        }

        try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      // If server responded with error
      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Signup failed",
        };
      }

      // Success
      set((state) => ({
        user_info: [...state.user_info, data.data],
      }));

      return {
        success: true,
        message: data.message || "User created successfully!",
      };

    } catch (err) {
      console.error("Fetch error:", err);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
}));

export default useCreateUser;