import { useEffect, useState } from "react";
import { gsap } from "gsap";

export interface NumberAnimationProps {
  value: number;
  duration?: number;
  delay?: number;
  options?: Intl.NumberFormatOptions;
  className?: string;
  style?: React.CSSProperties;
}

export default function NumberAnimation(props: NumberAnimationProps) {
  const { value, duration = 2, delay, options, className, style } = props;
  const [curVal, setCurVal] = useState(0);

  useEffect(() => {
    const v = { curVal };
    const tween = gsap.to(v, {
      curVal: value,
      duration,
      delay,
      onUpdate: function () {
        setCurVal(this.targets()[0].curVal.toLocaleString("zh-CN", options));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, delay, options]);

  return (
    <div className={className} style={style}>
      {curVal}
    </div>
  );
}
