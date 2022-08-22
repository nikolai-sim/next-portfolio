import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useIntersection from "../singleComponents/Hooks/useIntersection";
import GithubLogo from "../svg/Github.svg";
import LinkedInLogo from "../svg/linkedin.svg";

export default function SoulAether() {
  const ref = useRef(null);
  const inView = useIntersection(ref, "90%");

  useEffect(() => {
    if (inView) {
      console.log("inview");
    }
  }, [inView]);

  return (
    <div className="container">
      <div className="two_col">
        {/* <div className="container_inner"></div> */}
        <motion.div
          className="container_inner"
          ref={ref}
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 3,
            },
          }}
          viewport={{ once: false, amount: 0.8 }}
        >
          <div>
            <h1>N.Sim</h1>
            <h2>Software Developer</h2>
            {/* <a href="www.soulaether.xyz" target="_blank">
              soulaether.xyz
            </a> */}
            <div className="icon_container">
              <a
                href="https://github.com/nikolai-sim"
                target="_blank"
                rel="noreferrer"
                className="svg_link"
              >
                <GithubLogo />
              </a>
              <a
                href="https://www.linkedin.com/in/nikolai-sim-1b8838233/"
                target="_blank"
                rel="noreferrer"
                className="svg_link"
              >
                {/* <LinkedInLogo /> */}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
