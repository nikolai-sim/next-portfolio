import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Card(props: {
  title?: string;
  description?: string;
  link?: string;
  subtitle?: string;
  rightCol?: any;
}) {
  return (
    <div className="container">
      <div className="two_col">
        {/* <div className="container_inner"></div> */}
        <motion.div
          className="container_inner"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 3,
            },
          }}
          viewport={{ once: false, amount: 0.25 }}
        >
          <div>
            <h1>{props.title}</h1>

            <div className="container_description">
              <h3>{props.description}</h3>
            </div>
            <div className="container_subtitle">
              <h4>{props.subtitle}</h4>
            </div>
            <div className="container_subtitle">
              <h4>
                <a href={props.link} target="_blank" rel="noreferrer">
                  {props.link}
                </a>
              </h4>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="container_right"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 3,
            },
          }}
          viewport={{ once: false, amount: 0.25 }}
        >
          {props.rightCol}
        </motion.div>
      </div>
    </div>
  );
}
