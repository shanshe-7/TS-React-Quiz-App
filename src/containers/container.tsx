import React, { ChangeEvent, useState } from 'react';
import Questions from '../components/Questions';
import { fetchQuestions, QuestionState } from '../Api';
import { categories } from '../Utils';
import classes from './container.module.css';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

export default function Container() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [questinCategory, setQuestionCategory] = useState(9);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, questinCategory);
    if (newQuestions) {
      setQuestions(newQuestions);
    }
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) {
        setScore((prevScore) => prevScore + 1);
        e.currentTarget.className = 'Questions_answersButtonGreen__2Pz_m';
      } else {
        e.currentTarget.className = 'Questions_answersButtonRed__DOeLn';
        let el = Array.from(document.getElementsByName('answers')).find(
          (i) => questions[number].correct_answer === i.innerText
        );
        el?.classList.add('Questions_answersButtonGreen__2Pz_m');
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prevSt) => [...prevSt, answerObject]);
    }
  };
  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const handleQuestionCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    let index: number = e.currentTarget.selectedIndex;
    let el = e.currentTarget.children[index];
    let option = el.getAttribute('id');
    setQuestionCategory(Number(option));
  };

  const handleQuit = () => {
    setLoading(false);
    setQuestions([]);
    setNumber(0);
    setUserAnswers([]);
    setScore(0);
    setGameOver(true);
    setQuestionCategory(9);
  };

  return (
    <div className={classes.background}>
      s<h1 className={classes.trivia}>QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <div className={classes.category}>
          <select
            className={classes.categorySelect}
            onChange={handleQuestionCategory}
            id='categories'
          >
            {categories.map((c) => (
              <option key={c.id} id={c.id.toString()} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <div className={classes.start}>
          <button className={classes.startButton} onClick={startTrivia}>
            Start
          </button>
        </div>
      ) : null}
      {loading ? (
        <div className={classes.loadingDiv}>
          <p className={classes.loading}></p>
        </div>
      ) : null}
      {!loading && !gameOver && (
        <Questions
          questionNumber={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTIONS - 1 ? (
        <div className={classes.nextQuestionDiv}>
          <button className={classes.nextQuestion} onClick={nextQuestion}>
            Next Question
          </button>
        </div>
      ) : null}
      {!gameOver && !loading ? (
        <p className={classes.score}>Score: {score} </p>
      ) : null}
      {!gameOver && !loading && userAnswers.length !== TOTAL_QUESTIONS ? (
        <div className={classes.quitDiv}>
          <button className={classes.quitButton} onClick={handleQuit}>
            Quit the quiz
          </button>
        </div>
      ) : null}
    </div>
  );
}
