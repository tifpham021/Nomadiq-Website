import { create } from 'zustand';

export const useCreateUser = create ((set) => ({
    user_info: [],
    setInfo: (user_info) => set({user_info}),
    createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.confirmpass) {
            return { success: false, message: "Please fill out all fields" };
        }
        else if (newUser.confirmpass !== newUser.password) {
            return { success: false, message: "Your confirm password didn't match with your password" };
        }
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        });
        const data = await res.json();
        set((state) => ({ user_info: [...state.user_info, data.data] }));
        return { success: true, message: "User created successfully!" };
    },
}));

export default useCreateUser;