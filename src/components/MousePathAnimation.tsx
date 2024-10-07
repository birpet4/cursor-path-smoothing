import ControlPanel from "./ControlPanel";
import MousePathDisplay from "./MousePathDisplay";

const CursorPathAnimation = () => {
  return (
    <div className="app">
      <ControlPanel />
      <MousePathDisplay />
    </div>
  );
};

export default CursorPathAnimation;
