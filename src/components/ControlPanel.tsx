import {
  Box,
  Button,
  Typography,
  Slider,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppStore } from "../store/store";
import { useDataSmoothing } from "../hooks/useDataSmoothing";
import { easingFunctions } from "../utils/easing";

const ControlPanel = () => {
  const {
    timeThreshold,
    setTimeThreshold,
    accelerationPercentage,
    decelerationPercentage,
    setAccelerationPercentage,
    setDecelerationPercentage,
    accelerationCurveType,
    decelerationCurveType,
    setAccelerationCurveType,
    setDecelerationCurveType,
    togglePlay,
    toggleResetAnimation,
    isPlaying,
    isResetAnimation,
  } = useAppStore();

  const { loadMouseDataFromFile, processSmoothing } = useDataSmoothing();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "5%",
        right: "2%",
        backgroundColor: "rgba(34, 34, 34, 0.9)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        color: "#fff",
        width: "300px",
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Control Panel
      </Typography>

      <Button
        onClick={togglePlay}
        sx={{
          mb: 1,
          color: "#fff",
          backgroundColor: isPlaying ? "#FF4081" : "#2781e7",
          width: "100%",
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <Button
        onClick={toggleResetAnimation}
        sx={{
          mb: 2,
          color: "#fff",
          backgroundColor: isResetAnimation ? "#FF4081" : "#2781e7",
          width: "100%",
        }}
      >
        {"Reset"}
      </Button>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Time Threshold (T)
      </Typography>
      <Slider
        min={100}
        max={2000}
        value={timeThreshold}
        onChange={(_, value) => setTimeThreshold(value as number)}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Acceleration Percentage
      </Typography>
      <Slider
        min={0}
        max={100}
        value={accelerationPercentage * 100}
        onChange={(_, value) => {
          const newAcc = value as number;
          const maxAllowedAcc = 100 - decelerationPercentage * 100; // Ensure sum <= 100
          if (newAcc <= maxAllowedAcc) {
            setAccelerationPercentage(newAcc / 100);
          } else {
            setAccelerationPercentage(maxAllowedAcc / 100);
          }
        }}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Acceleration Curve
      </Typography>
      <Select
        value={accelerationCurveType}
        onChange={(e) => {
          const curve = e.target.value as string;
          setAccelerationCurveType(curve);
        }}
        sx={{
          mb: 2,
          width: "100%",
          color: "#fff",
          backgroundColor: "#333",
          borderRadius: "8px",
        }}
      >
        {Object.keys(easingFunctions).map((curve, i) => (
          <MenuItem key={i} value={curve}>
            {curve}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Deceleration Percentage
      </Typography>
      <Slider
        min={0}
        max={100}
        value={decelerationPercentage * 100}
        onChange={(_, value) => {
          const newDec = value as number;
          const maxAllowedDec = 100 - accelerationPercentage * 100; // Ensure sum <= 100
          if (newDec <= maxAllowedDec) {
            setDecelerationPercentage(newDec / 100);
          } else {
            setDecelerationPercentage(maxAllowedDec / 100);
          }
        }}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Deceleration Curve
      </Typography>
      <Select
        value={decelerationCurveType}
        onChange={(e) => {
          const curve = e.target.value as string;
          setDecelerationCurveType(curve);
        }}
        sx={{
          mb: 2,
          width: "100%",
          color: "#fff",
          backgroundColor: "#333",
          borderRadius: "8px",
        }}
      >
        {Object.keys(easingFunctions).map((curve, i) => (
          <MenuItem key={i} value={curve}>
            {curve}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ mb: 2, marginTop: 2 }}>
        {[
          "mouse_path.json",
          "mouse_path_1.json",
          "mouse_path_2.json",
          "mouse_path_3.json",
        ].map((fileName) => (
          <Button
            key={fileName}
            variant="contained"
            sx={{
              backgroundColor: "#2781e7",
              color: "#fff",
              width: "100%",
              mb: 1,
            }}
            onClick={() => loadMouseDataFromFile(fileName)}
          >
            Load {fileName}
          </Button>
        ))}

        <Button
          sx={{
            backgroundColor: "#fff",
            color: "#2781e7",
            width: "100%",
            mb: 1,
          }}
          onClick={() => processSmoothing()}
        >
          Process Data
        </Button>
      </Box>
    </Box>
  );
};

export default ControlPanel;
