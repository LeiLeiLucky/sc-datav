import { Route, Routes } from "react-router";
import SCDataV from "./pages/SCDataV";
import Demo1 from "./pages/Demo1";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SCDataV />} />
      <Route path="/demo1" element={<Demo1 />} />
    </Routes>
  );
}

export default App;
