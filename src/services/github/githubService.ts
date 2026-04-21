export interface GitHubStats {
  repos: {
    total: number;
    public: number;
    private: number;
  };
  stars: number;
  commits: {
    total: number;
    public: number;
    private: number;
  };
}

export interface HeatmapCell {
  date: string;
  count: number;
}

export const fetchGitHubStats = async (): Promise<{
  stats: GitHubStats;
  heatmap: HeatmapCell[];
}> => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          user(login: "HARISANKARSL") {
            repositories {
              totalCount
            }

            publicRepos: repositories(privacy: PUBLIC) {
              totalCount
            }

            privateRepos: repositories(privacy: PRIVATE) {
              totalCount
            }

            allRepos: repositories(first: 100, ownerAffiliations: OWNER) {
              nodes {
                stargazerCount
              }
            }

            contributionsCollection {
              totalCommitContributions
              restrictedContributionsCount

              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  const user = json?.data?.user;

  // repos
  const totalRepos = user?.repositories?.totalCount || 0;
  const publicRepos = user?.publicRepos?.totalCount || 0;
  const privateRepos = user?.privateRepos?.totalCount || 0;

  // stars
  const totalStars =
    user?.allRepos?.nodes?.reduce(
      (acc: number, repo: any) => acc + repo.stargazerCount,
      0
    ) || 0;

  // commits
  const publicCommits =
    user?.contributionsCollection?.totalCommitContributions || 0;

  const privateCommits =
    user?.contributionsCollection?.restrictedContributionsCount || 0;

  // heatmap
  const weeks =
    user?.contributionsCollection?.contributionCalendar?.weeks || [];

  const heatmapData = weeks
    .flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    )
    .slice(-26 * 7);

  const stats: GitHubStats = {
    repos: {
      total: totalRepos,
      public: publicRepos,
      private: privateRepos,
    },
    stars: totalStars,
    commits: {
      total: publicCommits + privateCommits,
      public: publicCommits,
      private: privateCommits,
    },
  };

  return {
    stats,
    heatmap: heatmapData,
  };
};