import { post } from "../common/apiService";

export interface FetchProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 1 | -1;
  searchFields?: string[];
}

export const fetchProjects = async (
  params: FetchProjectsParams = {}
) => {
  const payload = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search ?? "",
    filters: params.filters ?? {},
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? -1,
    searchFields: params.searchFields ?? [
      "name",
      "description",
      "technologies",
    ],
  };

  const res = await post("/projects/fetch", payload);

  console.log("SERVICE RESPONSE:", res);

  return {
    success: res?.success,
    message: res?.message,
    data: res?.data || [],
    pagination: res?.pagination || null,
  };
};