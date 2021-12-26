import { useLocation } from "react-router-dom";

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQueryParameters() {
  const currentSearch = useLocation().search;
  return new URLSearchParams(currentSearch);
}

export default useQueryParameters;
