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
    const [videoInfo] = await fetchVideoInfo(id.toString());
    let calculatedPosition = movieCardRef.current?.getBoundingClientRect();
    console.log({ calculatedPosition });
    let top = (calculatedPosition?.top ?? 0) - 100;
    let left = (calculatedPosition?.left ?? 0) - 100;
    if (left < 0) {
      left = calculatedPosition?.left as number;
    }
    let totalWidth = left + 470;
    if (totalWidth > document.body.clientWidth) {
      left = left - (totalWidth - document.body.clientWidth);
    }
    setPosition({ top, left });
    setVideoInfo(videoInfo);
    setIsOpen(true);
  }

  useEffect(() => {
    movieCardRef.current?.addEventListener("mouseenter", onMouseEnter);
    () => movieCardRef.current?.removeEventListener("mouseenter", onMouseEnter);
  }, []);

  useEffect(() => {
    if (videoInfo?.key) {
      setTimeout(() => {
        setHidePoster(true);
      }, 800);
    }
    if (!isOpen) {
      setHidePoster(false);
    }
  }, [videoInfo, isOpen]);

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
          src={createImageURL(poster_path, CARD_WIDTH)}
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
        <section className="aspect-square transition-[height] duration-500 ease-in">
          <img
            src={createImageURL(poster_path, 400)}
            alt={title}
            className={`${
              hidePoster ? "invisible h-0" : "visible h-full"
            } w-full`}
          />
          <Youtube
            opts={{
              width: "400",
              height: "400",
              playerVars: {
                autoplay: 1,
                playsinline: 1,
                controls: 0,
              },
            }}
            videoId={videoInfo?.key}
            className={`${
              !hidePoster ? "invisible h-0" : "visible h-full"
            } w-full`}
          />
          <section className="flex items-center justify-between p-6">
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
