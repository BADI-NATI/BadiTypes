import PropTypes from "prop-types";

const Word = ({ word, active, correct }) => {
  if (correct === true) {
    return <span className="text-[green]">{word}</span>;
  }
  if (correct === false) {
    return <span className="text-[red]">{word}</span>;
  }
  if (active) {
    return <span className="border p-2 rounded-md bg-gray-300">{word}</span>;
  }

  // Default case when none of the conditions are met
  return <span>{word}</span>;
};

Word.propTypes = {
  word: PropTypes.string.isRequired, // 'word' prop is required and should be a string
  active: PropTypes.bool.isRequired, // 'active' prop is required and should be a boolean
  correct: PropTypes.bool, // 'correct' prop is optional and should be a boolean if provided
};

export default Word;
