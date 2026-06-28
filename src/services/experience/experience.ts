import { experienceApi } from "../common/api";
import { post, get, remove, put } from "../common/apiService";

export interface ExperienceItem {
  _id?: string;
  id?: string;
  title?: any;
  position?: string;
  company: any;
  location?: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  description: string;
  currentlyWorking?: boolean;
}

export interface FetchExperiencesParams {
  search?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

export interface FetchExperiencesResponse {
  data: ExperienceItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const fetchExperiences = async (
  params: FetchExperiencesParams
): Promise<FetchExperiencesResponse> => {
  try {
    const response = await post(experienceApi.fetch, params);
    const apiData = response?.data || [];

    return {
      data: Array.isArray(apiData) ? apiData : [],
      pagination: response?.pagination || {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

export const saveExperience = async (data: Partial<ExperienceItem>): Promise<ExperienceItem> => {
  const payload = { ...data };
  if (payload._id && !payload.id) {
    (payload as any).id = payload._id;
  }
  const response = await post(experienceApi.save, payload);
  return response.data || response;
};

export const getExperienceById = async (id: string): Promise<ExperienceItem> => {
  try {
    const response = await get(experienceApi.getById(id));
    const data = response?.data;
    if (Array.isArray(data)) {
      return data[0];
    }
    return data || response;
  } catch (error) {
    console.error("Error fetching experience by ID:", error);
    throw error;
  }
};

export const deleteExperience = async (id: string): Promise<any> => {
  const response = await remove(experienceApi.delete(id));
  return response;
};
