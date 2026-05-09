import { useEffect, useState } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [score, setScore] = useState(0);

  const [isFinished, setIsFinished] = useState(false);

  const [history, setHistory] = useState([]);


  const subjects = [
    {
      label: "Mathematics",
      value: "Mathematics"
    },
    {
      label: "General Engineering and Applied Sciences",
      value: "GEAS"
    },
    {
      label: "Electronics",
      value: "Electronics"
    },
    {
      label: "Electronics Systems and Technologies",
      value: "EST"
    }
  ];


  async function startQuiz(subject) {
  try {
    console.log("Selected subject:", subject);

    const response = await fetch(
      `${API_URL}/quiz/${encodeURIComponent(subject)}`
    );

    const data = await response.json();

    console.log("Fetched questions:", data);

    setQuestions(data);
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  } catch (error) {
    console.error("Error starting quiz:", error);
  }
}

  async function loadHistory() {
  const response = await fetch(`${API_URL}/history`);
  const data = await response.json();
  setHistory(data);
}


  function handleAnswerClick(answerLetter) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerLetter);

    if (selectedSubject && questions.length === 0) {
      return (
        <div className="app">

          <video
            autoPlay
            loop
            muted
            playsInline
            className="background-video"
          >
            <source src="/videos/background.mp4" type="video/mp4" />
          </video>

          <div className="quiz-card">
            <h1>No questions found for {selectedSubject}</h1>

            <button className="next-button" onClick={restartQuiz}>
              Back to Subjects
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentIndex];

    if (answerLetter === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  }


  async function handleNextQuestion() {
    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);

    } else {
      setIsFinished(true);

      await fetch(
        `${API_URL}/save-score?subject=${encodeURIComponent(selectedSubject)}&score=${score}&total_questions=${questions.length}`,
        {
          method: "POST"
        }
      );

      loadHistory();
    }
  }


  function restartQuiz() {
    setSelectedSubject(null);

    setQuestions([]);

    setCurrentIndex(0);

    setSelectedAnswer(null);

    setScore(0);

    setIsFinished(false);
  }


  function getOptionClass(optionLetter) {
    if (selectedAnswer === null) {
      return "option";
    }

    const correctAnswer = questions[currentIndex].correct_answer;

    if (optionLetter === correctAnswer) {
      return "option correct";
    }

    if (
      optionLetter === selectedAnswer &&
      selectedAnswer !== correctAnswer
    ) {
      return "option wrong";
    }

    return "option disabled";
  }


  if (!selectedSubject) {
    return (
      <div className="app">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        <div className="quiz-card">

          <h1 className="start-title">Welcome to the ECE Board<br />Reviewer Platform</h1>

          <h2 className="select-title">Select Subject</h2>

          <div className="options">
            {subjects.map((subject) => (
              <button
                key={subject.value}
                className="option"
                onClick={() => startQuiz(subject.value)}
              >
                {subject.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }


  if (isFinished) {
    return (
      <div className="app">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        <div className="quiz-card">

          <h1 className="finished-title">Quiz Finished!</h1>

          <h2 className="final-score">
            Score: {score} / {questions.length}
          </h2>

          <button
            className="next-button"
            onClick={restartQuiz}
          >
            Back to Subjects
          </button>

          <h2 className="quiz-history-title">Quiz History</h2>

          {history.slice(-4).reverse().map((item) => (
            <div key={item.id} className="history-item">
              <p>
                {item.subject}: {item.score}/{item.total_questions}
              </p>
            </div>
          ))}

        </div>
      </div>
    );
  }


  if (selectedSubject && questions.length === 0) {
    return (
      <div className="app">
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        
        <div className="quiz-card">
         <h1>No questions found for {selectedSubject}</h1>

          <button className="next-button" onClick={restartQuiz}>
           Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];


  return (
    <div className="app">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="quiz-card">

        <div className="counter">
          Question {currentIndex + 1} of {questions.length}
        </div>

        <h2 className="subject-title">{selectedSubject}</h2>

        <h1 className="question">
          {currentQuestion.question_text}
        </h1>

        <div className="options">

          <button
            className={getOptionClass("A")}
            onClick={() => handleAnswerClick("A")}
          >
            A. {currentQuestion.option_a}
          </button>

          <button
            className={getOptionClass("B")}
            onClick={() => handleAnswerClick("B")}
          >
            B. {currentQuestion.option_b}
          </button>

          <button
            className={getOptionClass("C")}
            onClick={() => handleAnswerClick("C")}
          >
            C. {currentQuestion.option_c}
          </button>

          <button
            className={getOptionClass("D")}
            onClick={() => handleAnswerClick("D")}
          >
            D. {currentQuestion.option_d}
          </button>

        </div>

        {selectedAnswer !== null && (
          <button
            className="next-button"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        )}

      </div>

    </div>
  );
}


export default App;