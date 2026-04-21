
import { skillsApi } from "../common/api";
import { post } from "../common/apiService";


export interface TechStackItem {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  icon?: string;
  percentage?: number;
}

export interface FetchTechStackParams {
  search?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

export const fetchTechStack = async (
  params: FetchTechStackParams = {}
): Promise<{
  data: TechStackItem[];
  pagination: any;
}> => {
  const payload = {
    search: params.search ?? "",
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    filters: params.filters ?? {},
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? -1,
  };

  const response = await post(skillsApi?.listSkills, payload);

  const apiData = response?.data || response?.data?.data || [];

  return {
    data: (Array.isArray(apiData) ? apiData : []).map((item: any) => ({
      id: item._id || item.id,
      name: item.name,
      category: item.category || "General",
      proficiency: item.proficiency || "Intermediate",
      icon: item.icon || "",
      percentage: item.percentage || (item.proficiency === "Advanced" ? 90 : item.proficiency === "Expert" ? 95 : 75),
    })),
    pagination: response?.pagination || response?.data?.pagination,
  };
};