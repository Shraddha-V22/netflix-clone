import React from "react";

type Page = {
  pagesCount: number;
  currentPage: number;
  className: string;
};

export default function PageMarker({
  pagesCount,
  currentPage,
  className,
}: Page) {
  return isFinite(pagesCount) ? (
    <ul className={`flex items-center justify-end gap-1 pr-4 ${className}`}>
      {Array(pagesCount)
        .fill(0)
        .map((page, index) => {
          return (
            <li
              className={`h-[2px] w-3 ${
                currentPage === index ? "bg-gray-100" : "bg-gray-600"
              }`}
              key={index}
            ></li>
          );
        })}
    </ul>
  ) : null;
}
