

import { leetcodeApi } from "../common/api";
import { get } from "../common/apiService";

export interface LeetCodeStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  calendarArray: {
    date: string;
    count: number;
  }[];
}

export const fetchLeetCodeStats = async (
  username: string
): Promise<{
  stats: LeetCodeStats;
  heatmap: { date: string; count: number }[];
}> => {
  const response = await get(leetcodeApi.getCalendar(username));

  const data = response?.data || {};

  const heatmap = data?.calendarArray || [];

  return {
    stats: data,
    heatmap,
  };
};