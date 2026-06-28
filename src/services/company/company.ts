import { companyApi } from "../common/api";
import { post, get, remove } from "../common/apiService";

export interface Company {
  _id: string;
  name: string;
  description?: string;
}

export const fetchCompanies = async (): Promise<{ data: Company[] }> => {
  try {
    const response = await get(companyApi.fetch);
    // Handle both { data: [...] } and direct array responses
    const data = response?.data ? response.data : Array.isArray(response) ? response : [];
    return { data };
  } catch (error) {
    console.error("Error fetching companies", error);
    return { data: [] };
  }
};

export const createCompany = async (data: { name: string; description: string }): Promise<Company> => {
  const response = await post(companyApi.save, data);
  return response.data || response;
};

export const deleteCompany = async (id: string): Promise<any> => {
  const response = await remove(companyApi.delete(id));
  return response;
};
