import { create } from 'zustand';

export const useSubmitFAQ = create ((set) => ({
    questions: [],
    setQuestion: (questions) => set({questions}),
    createQuestion: async (newQuestion) => {
		if (!newQuestion.question) {
			return { success: false, message: "Please type in a message before submitting" };
		}
		const res = await fetch("/api/faqs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newQuestion),
		});
		const data = await res.json();
		set((state) => ({ questions: [...state.questions, data.data] }));
		return { success: true, message: "Question submitted successfully!" };
	},
}));
