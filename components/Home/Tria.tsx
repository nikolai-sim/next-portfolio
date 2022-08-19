import TriaSVG from "../svg/Tria_Prima.svg";
import useIntersection from "../singleComponents/Hooks/useIntersection";
import { useEffect, useRef } from "react";

export default function Tria() {
  const ref = useRef(null);
  const inView = useIntersection(ref, "90%");

  return (
    <div className="svg_animations" ref={ref}>
      {inView && <TriaSVG />}
    </div>
  );
}
