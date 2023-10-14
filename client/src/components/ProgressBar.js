const ProgressBar = (progress) => {

  const colors = [
    'rgb(255, 214, 161)',
    'rgb(255,175,163)',
    'rgb(108,115,148)',
    
  ]

  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div className="outer-bar">
      <div
        className="inner-bar"
        style={{ width: `${progress.progress}%`, backgroundColor: 'rgb(141, 181, 145)' }}
      >
      </div>

    </div>
  );
}

export default ProgressBar;
