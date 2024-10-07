# Mouse Path Smoothing Application

This is a Vite-based React application that visualizes and smooths mouse movement paths. The application processes raw mouse data and smooths it using Gaussian filtering and easing functions to simulate more realistic cursor movement. The control panel allows users to adjust various settings, including time thresholds, easing curves, and smoothing parameters. The application plays two animations: the original mouse path and the smoothed mouse path, simultaneously.

## Features

- **Play and Reset**: Control the playback of both the original and smoothed mouse paths.
- **Time Threshold (T)**: Define how the algorithm segments mouse movements based on time.
- **Easing Percentages**: Set how much acceleration and deceleration occur during smoothing. The sum of the acceleration and deceleration percentages must be 100.
- **Easing Curves**: Choose different types of easing curves for acceleration and deceleration. The available options can be expanded by modifying `utils/easing`.
- **File Loader**: Load multiple mouse path JSON files into the system.
- **Smoothing Process**: Click the `PROCESS DATA` button to apply the smoothing and easing algorithm. If you change any settings, make sure to click the `PROCESS DATA` button again.

## Smoothing Algorithm Steps

1. **Segment Creation**: Based on the `Time Threshold (T)` value, mouse movements are split into segments.
2. **Gaussian Filtering**: Smooths each segment by applying Gaussian filtering to the mouse movement data.
3. **Equal Distribution**: Within each segment, points are redistributed to be equally spaced.
4. **Easing Algorithm**:
   - Calculate the distance for each segment.
   - Apply the percentage of acceleration and deceleration to the segment.
   - Identify the points affected by easing and adjust their timestamps using the easing function.
   - Normalize the adjusted values back into the time coordinates to achieve smooth acceleration and deceleration in cursor movement.

## Installation

To set up the project, follow these steps:

1. Install the required dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

This will launch the app locally, usually at `http://localhost:5173`.

## Usage

1. **Control Panel**: Use the control panel to adjust the parameters:

   - **Time Threshold**: Drag the slider to change the threshold for segmenting the movement path.
   - **Easing Percentage**: Set the percentage of acceleration and deceleration. The sum must be 100%.
   - **Acceleration/Deceleration Curves**: Choose an easing curve from the dropdown to determine how smoothly the cursor accelerates and decelerates.
   - **Load Mouse Path Files**: Click the `LOAD MOUSE_PATH.JSON` buttons to upload mouse path data.
   - **Process Data**: Once all parameters are set, click `PROCESS DATA` to apply smoothing to the loaded mouse path.

2. **Play and Reset**:

   - Click **PLAY** to start playing both the original and smoothed mouse paths simultaneously.
   - Click **RESET** to reset the timer and return the cursors to their starting positions.

3. **File Loading**: You can load multiple JSON files containing mouse path data by using the `LOAD MOUSE_PATH_1.JSON`, `LOAD MOUSE_PATH_2.JSON`, and similar buttons.

## Customizing Easing Curves

To add or modify easing curves, navigate to the `utils/easing` file, where you can define new easing functions that will be available in the control panel.

## License

This project is licensed under the MIT License.
