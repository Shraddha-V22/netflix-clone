import React, { useEffect, useRef, useState } from "react";
import { fetchRequest, MovieResponse, MovieResult } from "../commmon/api";
import ChevronLeft from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRight from "@heroicons/react/24/outline/ChevronRightIcon";
import PageMarker from "./PageMarker";
import MovieCard from "./Movie-card";

type RowProp = {
  endpoint: string;
  title: string;
};

export default function ContentRows({ title, endpoint }: RowProp) {
  const [rowData, setRowData] = useState<MovieResult[]>([]);
  const sliderRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLSelectElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = useRef(0);
  const disablePrev = currentPage === 0;
  const disableNext = currentPage + 1 === pagesCount;

  async function fetchRowData() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(endpoint); //give endpoint and fetch the movie result
    setRowData(response.results.filter((res) => res.poster_path));
  }
  const CARD_WIDTH = 200;

  function onNextClick() {
    //next click function
    if (sliderRef.current) {
      //if sliderref.current is available
      let updatedTranslateX = translateX - getTranslateXValue(); //how much to translate
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`; //set transform style property
      setTranslateX(updatedTranslateX); //set tanslatex to that value
      setCurrentPage(currentPage + 1); //increasing the current page value
    }
  }
  function onPrevClick() {
    //prev click function
    if (sliderRef.current) {
      //if sliderref.current is available
      let updatedTranslateX = translateX + getTranslateXValue(); //how much to translate
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`; //set transform style property
      setTranslateX(updatedTranslateX); //set translate to that value
      setCurrentPage(currentPage - 1); //decreasing the current page value
    }
  }

  function getTranslateXValue() {
    // to get translate value
    let translateX = 0; //initially 0
    if (sliderRef.current) {
      //if sliderref available
      translateX = // multiplying cards per page width card's width and dividing it with total width of the row with cards and then multiply by 100 to get percentage value
        ((cardsPerPage.current * CARD_WIDTH) / sliderRef.current.clientWidth) *
        100;
    }
    return translateX;
  }

  useEffect(() => {
    if (rowData?.length) {
      //if there is rowdata and it has a length
      if (containerRef.current) {
        //if containerref.current is available
        cardsPerPage.current = Math.floor(
          //cards per page is containerref divided by card width
          containerRef.current.clientWidth / CARD_WIDTH
        );
        setPagesCount(Math.ceil(rowData.length / cardsPerPage.current)); //set page count to rowdata(number of movie cards) divided by cards on per page
      }
    }
  }, [rowData.length]); //when rowdata changes

  useEffect(() => {
    fetchRowData();
  }, []);

  return (
    <section className="row-container mx-12 hover:cursor-pointer">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <PageMarker
        className="mb-4 opacity-0 transition-opacity duration-300 ease-in"
        pagesCount={pagesCount}
        currentPage={currentPage}
      />
      <section
        ref={containerRef} //section with width almost equal to screen width- container width
        className="relative mb-10 flex flex-nowrap gap-2 overflow-hidden"
      >
        {!disableNext && ( //if disableNext is false then next button will show
          <button
            className="absolute right-0 z-[1] h-full w-12 bg-black/25 opacity-0 transition-opacity duration-300 ease-in"
            onClick={onNextClick}
          >
            <ChevronRight />
          </button>
        )}
        {!disablePrev && ( //if disablePrev is false then next button will show
          <button
            className="absolute z-[1] h-full w-12 bg-black/25  opacity-0 transition-opacity duration-300 ease-in"
            onClick={onPrevClick}
          >
            <ChevronLeft />
          </button>
        )}
        <section
          ref={sliderRef} //slider ref with bigger length
          className="flex gap-3 transition-transform duration-700 ease-linear"
        >
          {rowData?.map((row) => {
            return (
              <MovieCard
                uid={`${row.id}-${title}`}
                {...row}
                key={`${row.id}-${title}`}
              />
            );
          })}
        </section>
      </section>
    </section>
  );
}
