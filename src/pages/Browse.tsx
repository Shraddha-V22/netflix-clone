import React, { useEffect } from "react";
import { fetchRequest, MovieResponse, MovieResult } from "../commmon/api";
import { ENDPOINT } from "../commmon/endpoints";
import Banner from "../components/Banner";
import ContentRows from "../components/Content-rows";
import Loader from "../components/Loader";

export default function Browse() {
  return (
    <React.Suspense fallback={<Loader />}>
      <section className="absolute top-0 w-full">
        <Banner />
        <section className="-mt-10">
          <ContentRows
            endpoint={ENDPOINT.MOVIES_POPULAR}
            title="New & Popular"
          />
          <ContentRows endpoint={ENDPOINT.TOP_RATED} title="Top Rated" />
          <ContentRows endpoint={ENDPOINT.NOW_PLAYING} title="Now Playing" />
        </section>
      </section>
    </React.Suspense>
  );
}
