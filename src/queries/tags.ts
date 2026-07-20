import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { tagKeys } from "./keys";
import { Tag } from "../types/tagTypes";

const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await api.get("/tags");
  return Array.isArray(data) ? data : (data?.data ?? []);
};

/** Tags barely change and the endpoint is slow (~1.8s), so cache them hard.
 *  Mirrors the backend's Cache-Control: max-age=600. */
export const useTags = () =>
  useQuery({
    queryKey: tagKeys.all,
    queryFn: fetchTags,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });
