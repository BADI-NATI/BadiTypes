import { useEffect, useRef, useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import Word from "./components/Word";

import { EnglishWordCloud } from "./components/WordCloud";
import { AmharicWordCloud } from "./components/WordCloud";

function App() {
  const [language, setLanguage] = useState(EnglishWordCloud);
  const [languageOptionsOpen, setLanguageOptionsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState(
    new Array(language.length).fill(null)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [wordsDisplay, setWordsDisplay] = useState(false);
  const inputRef = useRef(null);
  const wordsPerLine = 14; // Number of words to display per line
  const linesToShow = 2; // Number of lines to display at a time
  const [startIndex, setStartIndex] = useState(0); // Track the start index of displayed words

  useEffect(() => {
    let intervalId = null;

    if (isRunning && totalSeconds > 0) {
      intervalId = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
      setTotalSeconds(60);
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    // Update wordsDisplay when the timer reaches 0
    if (totalSeconds === 0) {
      setWordsDisplay(true);
      setUserInput("");
    }
  }, [totalSeconds]);

  const handleRestart = () => {
    setWordsDisplay(false);
    setActiveWordIndex(0);
    setStartIndex(0);
    setCorrectWordArray(new Array(language.length).fill(null));
    setTotalSeconds(60);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!wordsDisplay) {
      focusInput(); // Focus input after state updates
    }
  }, [wordsDisplay]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const processInput = (input) => {
    const trimmedInput = input.trim();

    // Check if user has started typing (i.e., input is not empty) and timer is not running
    if (trimmedInput.length > 0 && !isRunning) {
      // Start the timer
      setIsRunning(true);
    }

    setUserInput(input);

    // Check if user has completed typing a word (input ends with a space)
    if (input.endsWith(" ")) {
      setIsRunning(true);
      const isCorrect = trimmedInput === language[activeWordIndex];
      setCorrectWordArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[activeWordIndex] = isCorrect;
        return newArray;
      });
      setActiveWordIndex((prevIndex) => prevIndex + 1);

      // Check if all displayed words have been typed
      const endIndex = startIndex + linesToShow * wordsPerLine;
      if (activeWordIndex === endIndex - 1) {
        setStartIndex((prevIndex) => prevIndex + linesToShow * wordsPerLine);
      }

      setUserInput(""); // Clear input field
    }
  };

  // Calculate minutes and seconds from totalSeconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Calculate the WPM.
  const correctWordsCount = correctWordArray.filter(
    (item) => item === true
  ).length;
  const WPM = Math.floor((correctWordsCount / 60) * totalSeconds);

  const displayWords = language.slice(
    startIndex,
    startIndex + linesToShow * wordsPerLine
  );

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(
      selectedLanguage === "English" ? EnglishWordCloud : AmharicWordCloud
    );
    setLanguageOptionsOpen(false);
  };

  return (
    <div className="h-[710px] flex justify-center relative">
      {/* Language dropdown */}
      <div className="absolute top-1 right-3 z-10">
        <div className="relative">
          <button
            disabled={isRunning}
            onClick={() => setLanguageOptionsOpen(!languageOptionsOpen)}
            className="text-[15px] text-white p-1 bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Language
          </button>
          {languageOptionsOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20">
              <button
                onClick={() => handleLanguageChange("English")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("Amharic")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
              >
                Amharic
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col m-32">
        <div className="w-[1000px] h-[120px] bg-white text-black rounded-md p-3 text-2xl font-poppins leading-6 border-1 border-blue-50 line-clamp-2 tracking-wide flex flex-wrap gap-2 items-center ">
          {!wordsDisplay ? (
            displayWords.map((word, index) => (
              <Word
                key={startIndex + index}
                word={word}
                active={startIndex + index === activeWordIndex}
                correct={correctWordArray[startIndex + index]}
              />
            ))
          ) : (
            <div className="font-bold text-5xl text-gray-600">
              Words per minute: {WPM}
            </div>
          )}
        </div>
        <div className="mt-3 bg-[#A7C8E7] flex justify-center gap-4 items-center p-1 rounded-md">
          <input
            type="text"
            className="w-[700px] h-14 outline-none border rounded-md text-2xl p-3 border-y-2 border-gray-500"
            value={userInput}
            onChange={(e) => processInput(e.target.value)}
            disabled={wordsDisplay}
            ref={inputRef}
          />
          <div className="w-[80px] bg-[#3c4d5c] text-white text-2xl p-3 flex justify-center rounded-md">
            {totalSeconds === 60
              ? "1:00"
              : `${minutes < 10 ? "0" + minutes : minutes}:${
                  seconds < 10 ? "0" + seconds : seconds
                }`}
          </div>
          <button
            onClick={handleRestart}
            className="bg-[#428bca] text-white text-2xl p-4 flex justify-center rounded-md hover:bg-[#3875ab] transition-all cursor-pointer"
          >
            <VscDebugRestart />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
