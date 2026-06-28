export const authApi = {
  login: "auth/login",
};

export const leetcodeApi = {
  getCalendar: (username: string) => `leetcode/${username}`,
};
export const skillsApi = {
  listSkills: "skills/fetch",
  createSkill: "skills/save",
  fetchOptions: "skills/skill-options",
};
export const experienceApi = {
  save: "experience/save",
  fetch: "experience/list",
  delete: (id: string) => `experience/${id}`,
  getById: (id: string) => `experience/${id}`,
  update: (id: string) => `experience/${id}`,
};
export const companyApi = {
  save: "company/save",
  fetch: "company/company-options",
  delete: (id: string) => `company/${id}`,
};

export const titleApi = {
  save: "title/save",
  fetch: "title/title-options",
  delete: (id: string) => `title/${id}`,
};