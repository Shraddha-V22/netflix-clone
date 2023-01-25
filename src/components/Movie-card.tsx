import React, { useEffect, useRef, useState } from "react";
import { createImageURL } from "../commmon/utils";
import ModalCard from "./Modal-card";
import Youtube from "react-youtube";
import { fetchRequest, fetchVideoInfo, MovieVideoInfo } from "../commmon/api";
import PlayIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import LikeIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ChevronDown from "@heroicons/react/24/outline/ChevronDownIcon";
import { Position } from "../commmon/types";

const CARD_WIDTH = 200;

type MovieCardProp = {
  id: number;
  poster_path: string;
  title: string;
  uid: string;
};

export default function MovieCard({
  id,
  poster_path,
  title,
  uid,
}: MovieCardProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [videoInfo, setVideoInfo] = useState<MovieVideoInfo | null>(null);
  const [hidePoster, setHidePoster] = useState(false);
  const movieCardRef = useRef<HTMLSelectElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  async function onMouseEnter(event: any) {
    //when mouse enters the card
    const [videoInfo] = await fetchVideoInfo(id.toString()); //fetch video info
    let calculatedPosition = movieCardRef.current?.getBoundingClientRect(); //get card position
    console.log({ calculatedPosition });
    let top = (calculatedPosition?.top ?? 0) - 100; //decreasing 100 from the top position
    let left = (calculatedPosition?.left ?? 0) - 100; //decreasing 100 from the left position
    if (left < 0) {
      left = calculatedPosition?.left as number;
    }
    let totalWidth = left + 470; //total width is left position plus a little more than video's width
    if (totalWidth > document.body.clientWidth) {
      left = left - (totalWidth - document.body.clientWidth);
    }
    setPosition({ top, left }); //position
    setVideoInfo(videoInfo); //video info
    setIsOpen(true); //open video modal
  }

  useEffect(() => {
    movieCardRef.current?.addEventListener("mouseenter", onMouseEnter);
    () => movieCardRef.current?.removeEventListener("mouseenter", onMouseEnter);
  }, []);

  useEffect(() => {
    if (videoInfo?.key) {
      setTimeout(() => {
        setHidePoster(true); //if videoid is available then hide thumbnail img poster
      }, 1000);
    }
    if (!isOpen) {
      setHidePoster(false); //if modal is not open then hide the thumbnail img poster
    }
  }, [videoInfo, isOpen]); //dependent on videoinfo and isopen

  function onClose(value: boolean) {
    setIsOpen(value);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <section
        ref={movieCardRef}
        key={uid}
        className="aspect-sqaure h-[200px] w-[200px] flex-none overflow-hidden rounded-md"
      >
        <img
          className="h-full w-full"
          src={createImageURL(poster_path, CARD_WIDTH)} //movie card img
          alt={title}
        />
      </section>
      <ModalCard
        title={""}
        isOpen={isOpen}
        onClose={onClose}
        key={`${title}-${id}`}
        closeModal={closeModal}
        position={position}
      >
        <section className="transition-[height] duration-500 ease-in">
          <img
            src={createImageURL(poster_path, 400)}
            alt={title}
            className={`${
              hidePoster ? "invisible h-0" : "visible h-[300px]" //img to show as thumbnail for the video
            } w-full object-cover`}
          />
          <Youtube
            opts={{
              width: "400",
              height: "300",
              playerVars: {
                autoplay: 1,
                playsinline: 1,
                controls: 0,
              },
            }}
            videoId={videoInfo?.key}
            className={`${
              !hidePoster ? "invisible h-0" : "visible h-full" //video starts and hides the img
            } w-full`}
          />
          <section className="flex items-center justify-between p-4">
            <ul className="flex items-center justify-evenly gap-4">
              <li className="h-12 w-12">
                <button className="h-full w-full">
                  <PlayIcon />
                </button>
              </li>
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <PlusIcon />
                </button>
              </li>
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full ">
                  <LikeIcon />
                </button>
              </li>
            </ul>
            <ul className="flex items-center justify-evenly gap-4">
              <li className="h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <ChevronDown />
                </button>
              </li>
            </ul>
          </section>
        </section>
      </ModalCard>
    </>
  );
}
