type dimension = "width" | "original";

export function createImageURL(path: string, width: number, type: dimension = "width") { //function to create imageurl
  return type === "width" ? `${import.meta.env.VITE_BASE_IMG_URI}/w${width}/${path}`: `${import.meta.env.VITE_BASE_IMG_URI}/${type}/${path}`;
}