import React, { useRef, useState } from 'react'
import { submitWords, server } from '../services'

const WordsForm = () => {
    const [error, setError] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const wordValue = useRef();
    const quizNameValue = useRef();
    const userNameValue = useRef();

    const handleSubmit = () => {
        setError(false);

        const { value: words } = wordValue.current;
        const { value: quizName } = quizNameValue.current;
        const { value: userName } = userNameValue.current;

        const slug = userName + "-" + quizName;

        const wordListObject = { userName, quizName, slug, words };
        console.log('wordListObject' + wordListObject);

        submitWords(wordListObject)
            .then((res) => {
                setShowSuccessMessage(true);
                let url = server + "/" + slug;
                window.open(url, "_blank");
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 10000);
            })
    }

    return ( 
        <div className="p-4 rounded-lg shadow-lg border-black">
            <h1 className="text-3xl">Enter your word list, separated by a semicolon.</h1>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <textarea ref={wordValue} className="p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-slate-300 dark:bg-gray-200 dark:text-black" 
                placeholder="aback; bacon; cabal; daddy; eager; etc."
                name="comment"
            />
            </div>

            <h1 className="text-3xl">Your user name: (no spaces, dots, backslashes, or @)</h1>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input 
                    type="text" ref={userNameValue}
                    className="p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 dark:bg-gray-200 dark:text-black"
                    placeholder="Name"
                    name="name"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
                <h1 className="text-3xl">Your quiz name: (no spaces, dots, backslashes, or @)</h1>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input 
                        type="text" ref={quizNameValue}
                        className="p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 dark:bg-gray-200 dark:text-black"
                        placeholder="Name"
                        name="name"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">

                </div>
                {error && <p className="text-xs test-red-500">All fields are required.</p>}
                <div className="mt-8 rounded-lg w-1/3 hover:cursor-pointer">
                <button type="button" onClick={handleSubmit} className="w-36 p-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 hover:underline">Create My Quiz</button>
                {showSuccessMessage && <span className="bg-orange-500 rounded-md background"><br/>Were working on your new quiz.</span>}
                </div>
            </div>
            
        </div>
        
    )
}

export default WordsForm