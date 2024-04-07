import React, { useState, useEffect, useRef } from "react";
import NavBanner from "./NavBanner";
import TutorialMiniCard from "./TutorialMiniCard";
import SiteFooter from "./SiteFooter";
import { EmptyProps, assertNever } from "../utils";
import { useStoreActions, useStoreState } from "../store";
import { urlWithinApp } from "../env-utils";
import { Link } from "./LinkWithinApp";
import { useSetActiveUiVersionFun } from "./hooks/active-ui-version";
import { EditorKindThumbnail } from "./EditorKindThumbnail";



const TutorialCarousel: React.FC<EmptyProps> = () => {
  const [windowPosition, setWindowPosition] = useState(0);
  const [currentWindowSize, setCurrentWindowSize] = useState(3); // Default window size
  const cards: React.ReactNode[] = [];

  cards.push(
    <TutorialMiniCard
      key="catch"
      title="Catch a star"
      slug="chase"
      screenshotBasename="screenshot.png"
    >
      <p>
        In this introduction to coding in Pytch, you control a bird using
        the keyboard, and your job is to catch the star.
      </p>
    </TutorialMiniCard>
  );

  cards.push(
    <TutorialMiniCard
      key="boing"
      title="Boing"
      slug="boing"
      screenshotBasename="summary-screenshot.png"
    >
      <p>
        In the game <i>Pong</i> from 1972, players hit a ball back and
        forth. Our <i>Boing</i> game, adapted from one in{" "}
        <a href="https://wireframe.raspberrypi.org/books/code-the-classics1">
          Code the Classics
        </a>
        , lets you play against the computer.
      </p>
    </TutorialMiniCard>
  );

  cards.push(
    <TutorialMiniCard
      key="qbert"
      title="Q*bert"
      slug="qbert"
      screenshotBasename="screenshot.png"
    >
      <p>
        Jump around a pyramid of blocks, trying to change the whole stack
        yellow without falling off! Our version is adapted from one in{" "}
        <a href="https://wireframe.raspberrypi.org/issues/42">
          Wireframe magazine
        </a>
        , inspired by the 1982 arcade classic.
      </p>
    </TutorialMiniCard>
  );

  cards.push(
    <TutorialMiniCard
      key="splat"
      title="Splat the moles"
      slug="splat-the-moles"
      screenshotBasename="screenshot-w360.jpg"
    >
      <p>
        A game where the player has to splat moles to score points. But if they miss, they lose all their points!
      </p>
    </TutorialMiniCard>
  );


  const handleArrowKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      setWindowPosition((prevPosition) => (prevPosition - 1 + cards.length) % cards.length);
    } else if (event.key === 'ArrowRight') {
      setWindowPosition((prevPosition) => (prevPosition + 1) % cards.length);
    }
  };

  const handleArrowClick = (direction) => {
    if (direction === 'right') {
      handleArrowKeyPress({ key: 'ArrowRight' });
    } else if (direction === 'left') {
      handleArrowKeyPress({ key: 'ArrowLeft' });
      console.log(" left press! ");
      console.log(cards);
    }
  };



  useEffect(() => {
    const screenSmall = window.matchMedia('(max-width: 800px)');
    const screenMedium = window.matchMedia('(max-width: 1100px)');

    const updateWindowSize = () => {
      if (screenSmall.matches) {
        setCurrentWindowSize(1);
      } else if (screenMedium.matches) {
        setCurrentWindowSize(2);
        console.log(" useeffect window update! ");
      } else {
        setCurrentWindowSize(3);
      }
    };

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []); // Empty dependency array, as we don't depend on any props or state

  return (
    <div id="TutorialCarousel">

      {/* Your left and right arrow buttons go here */}


      <div className="outer-container">
        Prev
        <div className="left-arrow" onClick={() => handleArrowClick('left')}>&lt; moo</div>

        {/* Render cards based on window position and size */}
        {cards
          .slice(windowPosition)
          .concat(cards.slice(0, windowPosition))
          .map((card, index) => card)} 
        <div className="right-arrow" onClick={() => handleArrowClick('right')}>&gt; boo</div>

      </div>
    </div>
  );
};


export default TutorialCarousel;
