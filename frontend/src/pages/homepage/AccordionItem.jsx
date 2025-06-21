import React, { useState } from 'react';
import '../homepage/AccordionItem.css';
import plusIcon from '../../assets/home-img/hp-plus.png';
import minusIcon from '../../assets/home-img/hp-minus.png';
import {useSubmitFAQ} from '../../faqs/faq-linking.js';


function AccordionItem({question, answer}) {
    const[isOpen, setIsOpen] = useState(false);

    return (
        <div className={"faq-box"}>
                <div onClick={() => setIsOpen(!isOpen)}
                     className={`faq-question ${isOpen ? 'no-bottom-radius' : ''}`}>
                    <h2>{question}</h2>
                    <img src={isOpen? minusIcon : plusIcon} alt="plus-icon" className={isOpen? "minusIcon" : "plusIcon"}/>
                </div>
                <div className={`answer-wrapper ${isOpen ? 'open' : ''}`}>
                    <p className={"answer"}>{answer}</p>
                </div>
        </div>
    );
}

export default function FAQ() {
    const [inputQuestion, setInputQuestion] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const createQuestion = useSubmitFAQ(state => state.createQuestion);


    const handleSubmit= async (e) => {
        e.preventDefault();

        if (!inputQuestion.trim()) {
    setFeedback({ message: "Please type in a message before submitting", type: "error" });
    return;
  }

  const { success, message } = await createQuestion({ question: inputQuestion });

  if (success) {
    setFeedback({ message, type: "success" });
    setInputQuestion("");
  } else {
    setFeedback({ message, type: "error" });
  }
};
    return (
        <div className='all-faq-stuff'>
            <div className='faq-questions'>
                <AccordionItem
                    question="1. Is Nomadiq free to use?"
                    answer="Yes, Nomadiq is 100% free!" />
                <AccordionItem
                    question="2. How does Nomadiq create itineraries?"
                    answer="Nomadiq curates your itinerary based on your travel dates, interests, and destination information." />
                <AccordionItem
                    question="3. Does Nomadiq track flights?"
                    answer="Yes, you can add flight details to receive check-in reminders and alerts under the plan tab." />
                <AccordionItem
                    question="4. Can Nomadiq help me pack?"
                    answer="Absolutely! We generate personalized packing lists and outfit suggestions based on your trip's weather, activities, and duration." />
            </div>
            <div className='faq-submission'>
                <h2>Don't See Your Question?</h2>
                <div className='in-pink-box'>
                    <p>Send it to us and we'll get back to you shortly!</p>
                    <form onSubmit={handleSubmit}>
                        <textarea name="question"
                               placeholder="Type your question here..."
                               value={inputQuestion}
                               onChange={(e) => setInputQuestion(e.target.value)}>
                        </textarea><br/>
                    <button type="submit" className="submit-button">Submit</button>
                     </form>
                </div>
            </div>
        </div>
    )
}
