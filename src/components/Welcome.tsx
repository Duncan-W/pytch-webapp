import React, { useState,useEffect, useRef } from "react";
import NavBanner from "./NavBanner";
import TutorialMiniCard from "./TutorialMiniCard";
import TutorialCarousel from "./TutorialCarousel";
import SiteFooter from "./SiteFooter";
import { EmptyProps, assertNever } from "../utils";
import { useStoreActions, useStoreState } from "../store";
import { urlWithinApp } from "../env-utils";
import { Link } from "./LinkWithinApp";
import { useSetActiveUiVersionFun } from "./hooks/active-ui-version";
import { EditorKindThumbnail } from "./EditorKindThumbnail";


const ToggleUiStylePanel_v1: React.FC<EmptyProps> = () => {
  const setUiVersion2 = useSetActiveUiVersionFun("v2");
  return (
    <aside className="ToggleUiStylePanel">
      <div className="summary">
        <EditorKindThumbnail programKind="per-method" size="lg" />
        <div className="content">
          <p>
            We’re excited to invite you to try a new way of writing Pytch
            programs — script by script.
          </p>
        </div>
      </div>
      <div className="explanation">
        <p className="welcome-change-ui-style">
          <span className="pseudo-link" onClick={setUiVersion2}>
            Try it!
          </span>
        </p>
      </div>
    </aside>
  );
};

const ToggleUiStylePanel_v2: React.FC<EmptyProps> = () => {
  const setUiVersion1 = useSetActiveUiVersionFun("v1");
  const createNewProjectAndNavigate = useStoreActions(
    (actions) => actions.projectCollection.createNewProjectAndNavigate
  );
  const createProjectFromTutorialAction = useStoreActions(
    (actions) => actions.tutorialCollection.createProjectFromTutorial
  );
  const setOperationState = useStoreActions(
    (actions) => actions.versionOptIn.setV2OperationState
  );

  // Bit of a fudge to manage the "operation in progress" state in the
  // next two functions, but it's likely to be temporary and so not
  // really worth making general.

  const createProject = async () => {
    setOperationState("in-progress");
    await createNewProjectAndNavigate({
      name: "Untitled script-by-script project",
      template: "simple-example-per-method",
    });
    setOperationState("idle");
  };

  const createProjectFromTutorial = async () => {
    setOperationState("in-progress");
    await createProjectFromTutorialAction("script-by-script-catch-apple");
    setOperationState("idle");
  };






  return (
    <div className="ToggleUiStylePanel">
      <div className="summary">
        <EditorKindThumbnail programKind="per-method" size="lg" />
        <div className="content">
          <p>
            Thanks for trying the <em>script by script</em> way of writing Pytch
            programs. Let us know what you think!
          </p>
        </div>
      </div>
      <div className="explanation">
        <p>You can try the new version by:</p>
        <ul>
          <li>
            <span className="pseudo-link" onClick={createProject}>
              Creating a project
            </span>{" "}
            which you edit as sprites and scripts.
          </li>
          <li>
            <span className="pseudo-link" onClick={createProjectFromTutorial}>
              Working with a tutorial
            </span>{" "}
            which leads you through writing a game as sprites and scripts.
          </li>
        </ul>
        <p>
          (Or you can{" "}
          <span className="pseudo-link" onClick={setUiVersion1}>
            go back to classic Pytch
          </span>
          .)
        </p>
      </div>
    </div>
  );
};

const ToggleUiStylePanel: React.FC<EmptyProps> = () => {
  const activeUiVersion = useStoreState(
    (state) => state.versionOptIn.activeUiVersion
  );

  switch (activeUiVersion) {
    case "v1":
      return <ToggleUiStylePanel_v1 />;
    case "v2":
      return <ToggleUiStylePanel_v2 />;
    default:
      return assertNever(activeUiVersion);
  }
};





const Welcome: React.FC<EmptyProps> = () => {
  // TODO: Replace the hard-coded list of tutorial mini-cards with something
  // driven by the pytch-tutorials repo.

  useEffect(() => {
    document.title = "Pytch";

    function toggleNav() {
      const navUl = document.querySelector("nav ul");
      navUl.classList.toggle("show");
    }

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener("click", toggleNav);
    }





    // Get references to both modals and buttons. If we have more than 2 this should be changed.
    let modal = document.getElementById("myModal");
    let modal1 = document.getElementById("myModal1");


    // Get references to both buttons
    let btn = document.getElementById("myBtn");
    let btn1 = document.getElementById("myBtn1");

    // Get references to close buttons for both modals
    let closeButtons = document.querySelectorAll('.close');

    // Function to open the modal
    function openModal(modal) {
      modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal(modal) {
      modal.style.display = "none";
    }

    // Add event listeners to buttons to open modals
    btn.addEventListener("click", function () {
      openModal(modal);
    });

    btn1.addEventListener("click", function () {
      openModal(modal1);
    });



    // Add click event listener to each close button
    closeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        // Run the provided code when the close button is clicked
        modal.style.display = "none";
        modal1.style.display = "none";
      });
    });

    // Close modals when clicking outside
    document.addEventListener("click", function (event) {
      if (event.target === modal) {
        console.log(event);
      } else if (event.target === modal1) {
        closeModal(modal1);
      }
    });




    return () => {
      if (hamburgerMenu) {
        hamburgerMenu.removeEventListener("click", toggleNav);
      }
    };





  });

  const logosUrl = urlWithinApp("/assets/Icon-02.png");
  const pytchUrl = urlWithinApp("/assets/normal-editor-preview-1024x693.png");
  const pytchjrUrl = urlWithinApp("/assets/script-by-script-preview-1-1024x693.png");
  const invadersUrl = urlWithinApp("/assets/invaders.png");


  const videoUrl = urlWithinApp("/assets/Overview.mp4");
  const launchCreate = useStoreActions(
    (actions) => actions.userConfirmations.createProjectInteraction.launch
  );
  const showCreateModal = () => launchCreate();



  return (

    <div className="welcometsx">
      <NavBanner />
      <header>
        <section>
          <h1>Welcome to Pytch!</h1>
          <p>Pytch is a bridge from Scratch to Python.</p>
          <p>
            It helps people to learn Python by building on skills they have developed
            in Scratch.
          </p>
        </section>
        <section className="subgrid-video">
          <div id="myBtn" aria-label="Video overview of Pytch">
            <svg
              fill="#fff"
              height="200px"
              width="200px"
              version="1.1"
              id="play_button"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 60 60"
              style={{ width: 200 }}
            >
              <g>
                <title>Click here for an overview of Pytch!</title>
                <path
                  d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
              c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
              C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
                />
                <path
                  d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
              S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
                />
              </g>
            </svg>
            {/* svgrepo */}
          </div>
        </section>

      </header>
      <button id="myBtn1" style={{ zIndex: 0 }} className="rounded-button divider">
        &gt;&gt;&gt; Start your <br /> coding journey
      </button>
      <main>
        <ToggleUiStylePanel />


        


 
          <TutorialCarousel></TutorialCarousel>
   



      </main>
        <section className="easy">
          <div className="section-heading">
            <img src={logosUrl} alt="" className="section-logo" />
            <h2>
              Learn Python <br /> with Pytch<span role="presentation">_</span>
            </h2>
          </div>
          <div className="section-content">
            <div className="section-buttons">
              <p>
                Here you can see what the Pytch environment looks like - providing a
                single screen where students can code, run their programs, and choose
                resources from our media library.
              </p>
            </div>
            <div className="cbody">
              <div className="cmain">
                <div className="ccontentwrap">
                  <div className="ccontent">
                    <img className="ccont" src={invadersUrl} alt="" />
                  </div>
                </div>
              </div>
              <div className="cbottom"></div>
              <div className="cleg"></div>
            </div>
          </div>
          <h2>Two ways of writing code</h2>
          <div className="section-content">
            <div>
              <img
                className="pytch_images"
                src={pytchjrUrl}
                width={512}
                height={360}
                alt="Pytch can be coded with script blocks"
              />
              <p>Script by script</p>
            </div>
            <div>
              <img
                className="pytch_images"
                src={pytchUrl}
                width={512}
                height={360}
                alt="Pytch can be coded as a single program"
              />
              <p>One big program</p>
            </div>
          </div>
        </section>
        <div className="section-buttons contact">
          <span style={{ paddingLeft: "10%" }}>
            <a className="mail" href="mailto:info@pytch.org">
              ✉
            </a>
          </span>
          <p className="large-text" style={{ paddingRight: "10%" }}>
            Please email us at{" "}
            <a style={{ color: "#000"}} href="mailto:info@pytch.org">
              info@pytch.org
            </a>{" "}
            with any feedback or suggestions
          </p>
        </div>
<SiteFooter></SiteFooter>
        <>
          <div id="myModal" className="i_cant_believe_its_not_modal">
            {/* Modal content */}
            <div className="i_cant_believe_its_not_modal-content">
              <button aria-label="Close" className="close">
                ×
              </button>
              <video className="ccont" controls data-toggle="lightbox">
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
          <div id="myModal1" className="i_cant_believe_its_not_modal">
            {/* Modal content */}
            <h1 id="myModal1_header"> I want to ... </h1>
            <div className="i_cant_believe_its_not_modal-content">
              <button aria-label="Close" className="close">
                ×
              </button>
              <div style={{ display: "flex" }}>
                <Link to="/tutorials/"><button className="square">
                  Start learning from basics with guided help and tutorials
                </button></Link>
                <button onClick={showCreateModal} className="square">
                  Start a new project and work on my own
                </button>
                {/*
        <div class="square">
           <p>View sample projects and learn from them</p>
        </div>
        */}
              </div>
            </div>
          </div>
        </>
    </div>

  );
};



export default Welcome;
