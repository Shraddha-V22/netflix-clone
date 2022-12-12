import React, { useEffect } from "react";
import { fetchRequest, MovieResponse, MovieResult } from "../commmon/api";
import { ENDPOINT } from "../commmon/endpoints";
import Banner from "../components/Banner";
import ContentRows from "../components/Content-rows";

export default function Browse() {
  return (
    <section className="absolute top-0 w-full">
      <Banner />
      <ContentRows endpoint={ENDPOINT.MOVIES_POPULAR} title="New & Popular" />
      <ContentRows endpoint={ENDPOINT.TOP_RATED} title="Top Rated" />
      <ContentRows endpoint={ENDPOINT.NOW_PLAYING} title="Now Playing" />
    </section>
  );
}
