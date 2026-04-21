export const authApi = {
  login: "auth/login",
};

export const leetcodeApi = {
  getCalendar: (username: string) => `leetcode/${username}`,
};
export const skillsApi = {
  listSkills: "skills/fetch",
};