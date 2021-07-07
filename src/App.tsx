import React from "react";
import { Router } from "@reach/router";
import Welcome from "./components/Welcome";
import ProjectList from "./components/ProjectList";
import TutorialList from "./components/TutorialList";
import IDE from "./components/IDE";

import "./pytch.scss";
import "./pytch-ide.scss";
import "./help-sidebar.scss";
import "./font-awesome-lib";

import { AllModals } from "./components/AllModals";
import { SingleTutorial } from "./components/SingleTutorial";

function App() {
  const basepath = process.env.PUBLIC_URL || "/";
  console.log(`PUBLIC_URL "${process.env.PUBLIC_URL}"; basepath "${basepath}"`);
  return (
    <>
      <Router className="App" basepath={basepath}>
        <Welcome path="/" />
        <ProjectList path="/my-projects/" />
        <TutorialList path="/tutorials/" />
        <IDE path="/ide/:projectIdString" />
        <SingleTutorial path="/suggested-tutorial/:slug" />
      </Router>
      <AllModals />
    </>
  );
}

export default App;
