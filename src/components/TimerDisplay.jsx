import PropTypes from "prop-types";

const TimerDisplay = ({ totalSeconds }) => {
  // Calculate minutes and seconds from totalSeconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="w-[80px] bg-[#3c4d5c] text-white text-2xl p-3 flex justify-center rounded-md">
      {totalSeconds === 60
        ? "1:00"
        : `${minutes < 10 ? "0" + minutes : minutes}:${
            seconds < 10 ? "0" + seconds : seconds
          }`}
    </div>
  );
};

TimerDisplay.propTypes = {
  totalSeconds: PropTypes.number.isRequired,
};

export default TimerDisplay;
