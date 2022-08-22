import Github from "../svg/Github.svg";
import useIntersection from "../singleComponents/Hooks/useIntersection";
import { useEffect, useRef } from "react";

export default function Tria() {
  const ref = useRef(null);
  const inView = useIntersection(ref, "90%");

  return (
    // @ts-ignore
    <div className={inView && "svg_animations"} ref={ref}>
      {inView && <Github />}
    </div>
  );
}
