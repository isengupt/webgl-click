import React from "react";

import { Spring } from "react-spring/renderprops";
import VisibilitySensor from "./components/VisibilitySensor";
import Backdrop from "./Backdrop";
import "./App.css";

export default function App() {
  return (
    <>
      <div className="frame">
        <h1 className="frame__title">Webgl React Click</h1>
        <div className="frame__links"></div>
        <div className="frame__nav">
          <a
            className="frame__link"
            href="https://isengupt.github.io/shaders/"
          >
            Previous
          </a>
          <a className="frame__link" href="#">
            Resume
          </a>
          <a
            className="frame__link"
            href="https://github.com/isengupt/webgl-click/"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="main__item">
        <div className="text__container">
          <VisibilitySensor partialVisibility>
            {({ isVisible }) => (
              <>
                <Spring
                  delay={150}
                  to={{
                    transform: isVisible
                      ? "translateY(0px) rotate(0deg)"
                      : "translateY(300px) rotate(20deg)",
                  }}
                >
                  {(props) => (
                    <h3 className="moving__text" style={{ ...props }}>
                      Suspendisse
                    </h3>
                  )}
                </Spring>
              
              </>
            )}
          </VisibilitySensor>

        </div>
        <Backdrop />
      </div>
    </>
  );
}
