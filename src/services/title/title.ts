import { titleApi } from "../common/api";
import { post, get, remove } from "../common/apiService";

export interface Title {
  _id?: string;
  code?: string;
  name: string;
  description?: string;
}

export const fetchTitles = async (): Promise<{ data: Title[] }> => {
  try {
    const response = await get(titleApi.fetch);
    // Handle both { data: [...] } and direct array responses
    const data = response?.data ? response.data : Array.isArray(response) ? response : [];
    return { data };
  } catch (error) {
    console.error("Error fetching titles", error);
    return { data: [] };
  }
};

export const createTitle = async (data: { name: string; description: string }): Promise<Title> => {
  const response = await post(titleApi.save, data);
  return response.data || response;
};

export const deleteTitle = async (id: string): Promise<any> => {
  const response = await remove(titleApi.delete(id));
  return response;
};
