import React from "react";
import PropTypes from "prop-types";

const Word = React.memo(({ word, active, correct }) => {
  let className = "";

  if (correct === true) {
    className = "text-[green]";
  } else if (correct === false) {
    className = "text-[red]";
  } else if (active) {
    className = "border p-2 rounded-md bg-gray-300";
  }

  return <span className={className}>{word}</span>;
});

// Define propTypes for the Word component
Word.propTypes = {
  word: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  correct: PropTypes.bool,
};

// Set the display name for the memoized component
Word.displayName = "Word";

export default Word;
