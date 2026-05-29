import { skillsApi } from "../common/api";
import { post, get, remove } from "../common/apiService";

export interface TechStackItem {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTechStackParams {
  search?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

interface FetchTechStackResponse {
  data: TechStackItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const fetchTechStack = async (
  params: FetchTechStackParams = {}
): Promise<FetchTechStackResponse> => {
  const payload = {
    search: params.search ?? "",
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    filters: params.filters ?? {},
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? -1,
  };

  const response = await post(
    skillsApi.listSkills,
    payload
  );

  const apiData = response?.data || [];

  return {
    data: Array.isArray(apiData)
      ? apiData.map((item: any) => ({
          _id: item._id,
          name: item.name || "",
          description: item.description || "",
          icon: item.icon || "",
          image: item.image || "",
          status: item.status || "active",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))
      : [],

    pagination: response?.pagination || {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};


export const createSkillStack = async (
  skillData: Partial<TechStackItem>
): Promise<TechStackItem> => {
  try {
    const response = await post(skillsApi.createSkill, skillData);
    return response.data;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
};

export const getSkillStackById = async (id: string): Promise<TechStackItem> => {
  try {
    const response = await get(`skills/${id}`);
    const data = response?.data;
    if (Array.isArray(data)) {
      return data[0];
    }
    return data || response;
  } catch (error) {
    console.error("Error fetching skill by ID:", error);
    throw error;
  }
};

export const deleteSkillStack = async (id: string): Promise<any> => {
  try {
    const response = await remove(`skills/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};