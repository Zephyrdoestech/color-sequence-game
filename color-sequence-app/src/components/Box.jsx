function Box({ assignedColor, isFlipped, isWrong, transitionDelay = 0, onBoxClick }) {
  return (
    <div className="box-wrapper" onClick={onBoxClick}>
      <div
        className={`box-inner${isFlipped ? " flipped" : ""}${isWrong ? " wrong" : ""}`}
        style={{ transitionDelay: `${transitionDelay}ms` }}
      >
        <div className="box-face box-front" />
        <div
          className="box-face box-back"
          style={{ backgroundColor: assignedColor }}
        />
      </div>
    </div>
  );
}

export default Box;