import React, { useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import {
  fetchRequest,
  fetchVideoInfo,
  MovieResponse,
  MovieResult,
  MovieVideoInfo,
} from "../commmon/api";
import { ENDPOINT } from "../commmon/endpoints";
import { createImageURL } from "../commmon/utils";
import PlayIcon from "@heroicons/react/24/solid/PlayIcon";
import Info from "@heroicons/react/24/outline/InformationCircleIcon";
import Loader from "./Loader";

export default function Banner() {
  const [randomMovie, setRandomMovie] = useState<MovieResult>();
  const [videoInfo, setVideoInfo] = useState<MovieVideoInfo>();
  const [hidePoster, setHidePoster] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const options: YouTubeProps["opts"] = {
    width: document.body.clientWidth,
    height: "800",
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      controls: 0,
    },
  };

  function getRandomIndex(last: number) {
    return Math.floor(Math.random() * (last - 1));
  }

  async function fetchPopularMovies() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>( //fetch movies
      ENDPOINT.MOVIES_POPULAR
    );
    const filteredMovies = response.results.filter(
      //getting movies having backdrop_path properties
      (movie) => movie.backdrop_path
    );
    const randomSelection =
      filteredMovies[getRandomIndex(filteredMovies.length)]; //get random movie
    setRandomMovie(randomSelection); //set random movie as random selection
    const videoInfo = await fetchVideoInfo(randomSelection.id.toString()); //fetching video info of random movie
    setVideoInfo(videoInfo[0]); //set video info to 1st item in videoinfo
    setTimeout(() => {
      setHidePoster(true); //hiding the image banner after 800ms
    }, 1000);
  }

  useEffect(() => {
    fetchPopularMovies(); //call the fetchpopmovies function
  }, []);

  function onStateChange(event: YouTubeEvent<number>) {
    if (event.data === 0) {
      //0 - video is paused
      setHidePoster(false);
      setShowBackdrop(true);
    } else if (event.data === 1) {
      //1 - video is running
      setHidePoster(true);
      setShowBackdrop(false);
    }
  }

  return randomMovie ? ( //if there is a random movie
    <section className="relative aspect-video h-[800px] w-full">
      <img
        src={createImageURL(randomMovie?.backdrop_path ?? "", 0, "original")}
        alt={randomMovie?.title}
        className={`${hidePoster ? "invisible h-0" : "visible h-full"} w-full`}
      />
      {videoInfo ? ( //if videoinfo is available
        <YouTube //then youtube component will show
          videoId={videoInfo?.key}
          id="banner-video"
          opts={options} //some options which we have defined above
          className={`-mt-20 ${
            !hidePoster ? "invisible h-0" : "visible h-full"
          } absolute z-[1]`}
          onStateChange={onStateChange} //state change function - what to do in case of 0 and 1
        />
      ) : null}
      {showBackdrop ? ( //if showbackdrop is true
        <section className="absolute top-0 left-0 z-[1] h-full w-full bg-dark/60"></section>
      ) : null}
      {/* info about the video playing in the banner */}
      <section className="absolute bottom-56 z-[1] ml-28 flex max-w-sm flex-col gap-4">
        <h2 className="text-5xl">{randomMovie.title}</h2>
        <p className="text-sm line-clamp-3">{randomMovie.overview}</p>
        <section className="flex gap-2">
          <button className="flex w-[100px] items-center justify-center gap-1 rounded-md bg-white p-2 text-dark">
            <PlayIcon className="h-8 w-8" />
            <span>Play</span>
          </button>
          <button className="flex w-[150px] items-center justify-center gap-1 rounded-md bg-zinc-400/50 p-2 text-white">
            <Info className="h-8 w-8" />
            <span>More Info</span>
          </button>
        </section>
      </section>
    </section>
  ) : (
    <Loader />
  );
}
