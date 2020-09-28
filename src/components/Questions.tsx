import React from 'react';
import { AnswerObject } from '../containers/container';
import classes from './Questions.module.css';

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
};

const Questions: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className={classes.mainDiv}>
      <p className={classes.questionNumber}>
        Question: {questionNumber}/{totalQuestions}
      </p>
      <p
        className={classes.question}
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <div className={classes.answers}>
        {answers.map((answer) => (
          <div key={answer}>
            <button
              name='answers'
              style={{}}
              className={classes.answersButton}
              disabled={userAnswer ? true : false}
              value={answer}
              onClick={callback}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
