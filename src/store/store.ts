import { Store, SubmitVoteResult, User } from "@/types/store-types";
import { create } from "zustand";
import axios, { Axios, AxiosError } from "axios";
import { IdeaType } from "@/types/api-data-types";

export const useStore = create<
  Store & {
    ideas: IdeaType[];
    loading: boolean;
    hasMore: boolean;
    cursor: string | null;
    sort: "latest" | "popular";
    setSort: (sort: "latest" | "popular") => void;
    fetchIdeas: (refresh?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    updateVotes: (
      ideaId: string,
      votesCount: number,
      userVote: "UP" | "DOWN" | null
    ) => void;
    addIdea: (idea: IdeaType) => void;
  }
>((set, get) => ({
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
    image: "",
  },

  setUser: (user: User) => set(() => ({ user })),

  // Feed state
  ideas: [],
  loading: false,
  hasMore: true,
  cursor: null,
  sort: "latest" as const,

  setSort: (sort: "latest" | "popular") =>
    set((state) => ({ sort, cursor: null, ideas: [], hasMore: true })),

  fetchIdeas: async (refresh = false) => {
    const state = get();
    if (refresh) {
      set({ loading: true, cursor: null, ideas: [], hasMore: true });
    } else {
      set({ loading: true });
    }

    try {
      console.log("Fetching ideas with params:", {
        cursor: refresh ? null : state.cursor,
        sort: state.sort,
        limit: 10,
      });

      const res = await axios.get("/api/idea/get-idea", {
        params: {
          cursor: refresh ? null : state.cursor,
          sort: state.sort,
          limit: 10,
        },
      });

      if (res.status === 200) {
        // If the response is an array (old format), handle it
        const responseData = Array.isArray(res.data)
          ? {
              ideas: res.data,
              hasMore: res.data.length === 10,
            }
          : res.data;

        const ideas = responseData.ideas || [];
        const hasMore = responseData.hasMore ?? false;
        const nextCursor = ideas.length > 0 ? ideas[ideas.length - 1].id : null;

        console.log("Received ideas:", {
          count: ideas.length,
          hasMore,
          nextCursor,
        });

        set((state) => ({
          ideas: refresh ? ideas : [...state.ideas, ...ideas],
          hasMore,
          cursor: nextCursor,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
      set({ loading: false, hasMore: false });
    }
  },

  loadMore: async () => {
    const state = get();
    if (!state.hasMore || state.loading) return;
    await state.fetchIdeas();
  },

  updateVotes: (
    ideaId: string,
    votesCount: number,
    userVote: "UP" | "DOWN" | null
  ) =>
    set((state) => ({
      ideas: state.ideas.map((idea: IdeaType) =>
        idea.id === ideaId
          ? {
              ...idea,
              votesCount: votesCount,
              userVote: userVote,
            }
          : idea
      ),
    })),

 submitVote: async (
  ideaId: string,
  voteType: "UP" | "DOWN",
  previousVote: "UP" | "DOWN" | null,
  previousCount: number
): Promise<SubmitVoteResult> => {
  const controller = new AbortController();

  try {
    const response = await axios.post(
      "/api/vote",
      { ideaId, voteType },
      { signal: controller.signal }
    );

    const data = response.data;
    if (data.success) {
      set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                votesCount: data.votesCount,
                userVote: data.userVote,
              }
            : idea
        ),
      }));
      return {
        success: true,
        data: {
          votesCount: data.votesCount,
          userVote: data.userVote,
        },
      };
    }
    throw new Error("Vote failed");
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      return { success: false, error: new Error("Request aborted") };
    }
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              votesCount: previousCount,
              userVote: previousVote,
            }
          : idea
      ),
    }));
    return { success: false, error: error instanceof Error ? error : new Error("Unknown error") };
  }
},
  addIdea: (idea: IdeaType) =>
    set((state) => {
      // avoid duplicates
      const exists = state.ideas.some((i) => i.id === idea.id);
      if (exists) return state;
      return { ideas: [...state.ideas, idea] };
    }),
}));
