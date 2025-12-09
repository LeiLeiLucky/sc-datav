import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { useThree } from "@react-three/fiber";

export default function Labels() {
  const { gl, events } = useThree();

  useLayoutEffect(() => {
    const target = events.connected || gl.domElement.parentNode;
    const el = document.createElement("div");
    target?.appendChild(el);

    const currentRoot = createRoot(el);
    currentRoot?.render(<div id="test" />);
    console.log(currentRoot);

    return () => {
      target?.removeChild(el);
      currentRoot.unmount();
    };
  }, []);

  return <></>;
}
