import type { Project } from "./types";

const SOLAURA_README = `# Solaura: Spatial Audio AR for the Visually Impaired

> **Built in 24 hours at Hack for Humanity 2026 (Santa Clara University).**

## 👥 The Team
This project was developed during a 24-hour hackathon.
* **Peter Guan** - Lead AR & Systems Engineer (Core iOS, Python Backend, UDP Architecture)
* **[Daniel Park](https://github.com/NokYongKim)** - Frontend Developer (Live Dashboard Visualization)
* **[Jonathan Aung](https://github.com/Aung-Khant)** - Product Pitch & Documentation
* **[Andrew Pan](https://github.com/1965428761pan-commits)** - Concept Ideation & Strategy

## 💡 The Concept: Giving Objects a Voice
Current accessibility tools for the visually impaired—such as guide dogs, smart canes, or video-call assistance apps—rely on natural language or physical pulls to guide the user. They tell the user *what* to do, rather than allowing the user to perceive the space themselves.

**Solaura** flips this paradigm by letting physical objects "speak." It creates a real-time, 3D spatial audio environment, allowing users to mentally map their surroundings and build independent spatial awareness. Instead of a robotic voice saying "move your hand left," the user hears a radar-like audio beacon emanating directly from the target object, acting as a sonar that guides their hand to the exact location.

## 🎯 The MVP: The "Grab" Scenario
For the 24-hour prototype, we focused on a vital micro-interaction: independently finding and grabbing a water bottle on a table.

## 🛠 Tech Stack
* **AI Brain**: Google Gemini 3 Flash (Multimodal Function Calling)
* **Mobile (AR)**: iOS, Swift, ARKit (LiDAR Scene Depth), CoreML (YOLOv8)
* **Backend (Audio)**: Python, UDP Sockets, \`sounddevice\`, NumPy
* **Web (Dashboard)**: Next.js, React, Tailwind CSS

## 🧠 How It Works (The Spatial Pipeline)

**1. The "Smart Switch" (Intent Recognition)**
Running high-frequency Object Detection (YOLO) and LiDAR continuously drains a phone's battery in minutes. Solaura solves this by running in a low-power "chat" mode by default. When the user says, "Where is my water bottle?", Gemini processes the camera feed and voice, executing an \`activate_radar\` function call to wake up the heavy AR tracking.

**2. Dual-Track Spatial Detection (iOS)**
Once the radar is active, the app runs two parallel asynchronous tracks:
* **Object Tracking (2.5Hz)**: A CoreML YOLOv8 model detects the water bottle.
* **Hand Tracking (15Hz)**: Apple's native Vision framework tracks the user's hand joints.
* *LiDAR Mapping*: 2D screen coordinates are projected against the raw LiDAR depth map to extract highly accurate 3D world coordinates.

**3. Zero-Latency Telemetry (UDP)**
The iOS device streams the 6-DOF camera pose, hand 3D coordinates, and object 3D coordinates via a lightweight UDP stream to the Python backend to avoid TCP overhead.

**4. Dual-Mode Spatial Audio (Python)**
The Python engine calculates relative vectors and dynamically generates audio:
* **Camera Mode (Macro Navigation)**: If no hand is visible, the audio pans based on the camera's azimuth relative to the bottle, guiding the user to face the object.
* **Hand Cursor Mode (Micro Precision)**: Once the user's hand enters the frame, the reference frame immediately shifts. The audio now maps the *hand-to-bottle* distance. A highly sensitive algorithm increases the pitch (up to 1500Hz) and frequency as the hand closes in, with a 5mm "dead zone" confirming a successful grab.

**5. The "God's Eye" Dashboard (Web)**
A Next.js frontend polls the backend state to render a real-time, web-based 3D visualization dashboard. It displays the active sound source, camera position, hand position, and bottle position, serving as a live telemetry monitor during presentations.
`;

const SOLAURA_CASE_STUDY = `# Case Study: Engineering Solaura

> **Role**: Lead AR & Systems Engineer
> **Stack**: Swift (ARKit/CoreML), Python (UDP/Math), Next.js
> **Timeline**: 24 Hours (Hack for Humanity 2026)

## 1. The HCI Challenge: "Object Permanence" and Panic

### The Chest-Mount Blind Spot
During early testing, I discovered a critical flaw in our interaction design. Because the phone is typically held or mounted near the chest, reaching for a water bottle on a table meant the user's arm would almost 100% occlude (block) the bottle from the camera's view.

**The Problem**: In version 1.0, the moment the bottle was occluded, the audio beacon stopped. From a Human-Computer Interaction (HCI) perspective for the visually impaired, **sudden silence equals panic**. If the guide audio disappears right as they are about to grab the object, the entire system loses user trust.

**The Solution: Anti-Penetration & Memory**
1. **LiDAR Anti-Penetration Grid**: I implemented a massive sampling window (11x11 for hands, 5x5 for bottles) on the raw LiDAR depth map, finding the minimum valid depth to prevent ARKit's raycast from piercing through the table and grabbing coordinates from the floor.
2. **State Freezing (Object Permanence)**: I engineered a state machine in the Python backend. When the camera detects a hand but loses the bottle, it instantly "freezes" the bottle's last known 3D coordinate. The audio engine seamlessly transitions from tracking the bottle visually to calculating the vector between the *hand's live position* and the *bottle's memorized position*, ensuring uninterrupted audio feedback until the grab is completed.

---

## 2. The Math Behind the Magic: 2D to 3D Spatial Audio

Transforming a flat camera feed into a hyper-accurate 3D audio landscape required rigorous mathematical modeling. I had to bridge the gap between CoreML's 2D bounding boxes, LiDAR's depth map, and Apple's ARKit world tracking.

### The Spatial Pipeline
1. **Coordinate Transformation**: I extracted the camera's 6-DOF pose as a Quaternion $(x, y, z, w)$ and converted it into a $3 \\times 3$ Rotation Matrix. This allowed me to transform global world vectors $(v_w)$ into the camera's local coordinate space $(v_c = R^T \\cdot v_w)$, which is essential for determining if the object is to the left or right of the user's head.
2. **Constant-Power Panning**: To prevent the volume from dropping when the sound crosses the center of the stereo field, I implemented a Constant-Power Panning law using trigonometric functions ($Gain_{Left} = \\cos(\\theta)$, $Gain_{Right} = \\sin(\\theta)$).
3. **Exponential Smoothing (EMA)**: Raw LiDAR and CV tracking data can be jittery. I applied an Exponential Moving Average (EMA) with an alpha of 0.15 to the coordinates. This completely eliminated audio stutter, resulting in a buttery-smooth sonar experience.

---

## 3. Architecture & Execution in 24 Hours

### Decoupling for Speed
Hackathons are a battle against the clock. Due to severe resource constraints within the team, I had to single-handedly architect and implement the entire core system: the iOS AR frontend, the AI reasoning layer, and the Python UDP audio backend.

To ensure we could still deliver a polished presentation, I designed a strictly decoupled architecture. I established a robust UDP telemetry stream from the phone to the Python backend, which then exposed a clean HTTP JSON endpoint. This allowed my teammate, Daniel, to build the Next.js Live Dashboard completely independently. We didn't have to waste time merging complex states; the frontend simply polled the backend's "God's Eye" state, resulting in a flawless integration.

---

## 4. Reflections & Takeaways

Delivering a multi-platform application (iOS, Python, Web) with complex HCI considerations within 24 hours was the ultimate stress test.

1. **Mastering Apple Native APIs**: This project forced me to dive deep into the lower levels of ARKit. Moving beyond simple high-level wrappers and directly manipulating raw LiDAR depth maps (\`sceneDepth\`) and Raycasts gave me a profound appreciation for spatial computing hardware.
2. **Full-Stack Resilience**: When team resources bottlenecked, I learned how to rapidly shift contexts—writing Swift UI code one minute, deriving linear algebra formulas for audio panning the next, and debugging UDP socket timeouts right after. It reinforced my belief that a strong engineer must be adaptable across the entire stack.
3. **HCI is Everything**: The most advanced AI and math mean nothing if the user interface induces anxiety. Solving the occlusion problem taught me that true engineering isn't just about making the code work; it's about deeply empathizing with the end user's physiological and emotional response to the system."
`;

const SOLAURA_AUDIO_LOGIC = `import math
import numpy as np

# --- 1. Spatial Math Core ---
def quat_to_rotmat_xyzw(q):
    """Converts 4D spatial quaternion to 3x3 rotation matrix."""
    x, y, z, w = q
    xx, yy, zz = x * x, y * y, z * z
    xy, xz, yz = x * y, x * z, y * z
    wx, wy, wz = w * x, w * y, w * z
    return np.array([
        [1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy)],
        [2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx)],
        [2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy)],
    ], dtype=np.float32)

def world_to_camera(v_w, cam_quat_xyzw):
    """Transforms a world vector into the camera's local coordinate space."""
    R = quat_to_rotmat_xyzw(cam_quat_xyzw)
    return R.T @ v_w

# --- 2. Hyper-Sensitive Hand Cursor Mode ---
def pan_from_hand_offset(v_c):
    """
    Translates the lateral physical offset into a stereo pan value.
    Extremely sensitive: 2cm offset triggers max panning. 5mm deadzone for precise grabs.
    """
    x_offset = float(v_c[0])
    max_offset = 0.02 # 2 centimeters

    pan = x_offset / max_offset

    # Deadzone: 5 millimeters
    if abs(x_offset) < 0.005:
        pan = 0.0

    return max(-1.0, min(1.0, pan))

def stereo_gains(pan):
    """Constant-Power Panning law using trigonometry to prevent center volume drop."""
    pan = max(-1.0, min(1.0, pan))
    angle = (pan + 1.0) * math.pi / 4.0
    return math.cos(angle), math.sin(angle)
`;

const SOLAURA_MATH_MODEL = `# Solaura: Mathematical Audio Mapping

> **Translating 3D Physical Space into Cognitive Audio Landscapes.**
> The following models define how Solaura converts visual bounding boxes and LiDAR depth into an intuitive sonar experience.

## 1. 3D Spatial Transformation
To calculate whether an object is to the left or right of the user's head, we must transform the global world coordinates into the camera's local coordinate system.

**Quaternion to Rotation Matrix:**
Converts the 4D spatial quaternion (x, y, z, w) from ARKit into a $3 \\times 3$ rotation matrix ($R$).
$$ R = \\begin{bmatrix} 1-2(y^2+z^2) & 2(xy-wz) & 2(xz+wy) \\\\ 2(xy+wz) & 1-2(x^2+z^2) & 2(yz-wx) \\\\ 2(xz-wy) & 2(yz+wx) & 1-2(x^2+y^2) \\end{bmatrix} $$

**World to Camera Vector:**
Transforms the physical vector from the global world space ($v_w$) into the camera's local space ($v_c$).
$$ v_c = R^T \\cdot v_w $$

## 2. Psychoacoustic Panning (Constant Power)
Simple linear panning causes a perceived drop in volume when the sound crosses the center of the stereo field. Solaura uses a **Constant-Power Panning Law** to distribute volume smoothly.

$$ Angle = (Pan + 1.0) \\cdot \\frac{\\pi}{4} $$
$$ Gain_{Left} = \\cos(Angle) $$
$$ Gain_{Right} = \\sin(Angle) $$

## 3. Dynamic Pitch Mapping
The system acts as a high-precision metal detector. As the physical distance ($d$) between the hand and the bottle decreases, the frequency (pitch) of the audio beep dynamically scales from 400Hz up to 1500Hz.

$$ Ratio_{inv} = \\frac{d_{max} - d_{clamped}}{d_{max} - d_{min}} $$
$$ Frequency (Hz) = 400.0 + (Ratio_{inv} \\cdot 1100.0) $$
`;

const solaura: Project = {
  id: "solaura",
  name: "Solaura_BlindAssist",
  github: "https://github.com/Yinghao-Guan/solaura",
  devpost: "https://devpost.com/software/solaura-bouewf",
  files: [
    { name: "README.md", type: "readme", content: SOLAURA_README },
    { name: "Demo_video", type: "demo" },
    { name: "CASE_STUDY.md", type: "markdown", content: SOLAURA_CASE_STUDY },
    { name: "MATH_MODEL.md", type: "markdown", content: SOLAURA_MATH_MODEL },
    { name: "spatial_audio.py", type: "code", language: "python", content: SOLAURA_AUDIO_LOGIC },
  ],
};

export default solaura;
