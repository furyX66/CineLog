import { apiFetch, apiGet, apiPost, apiPut } from "./api";

const BASE_URL = "http://192.168.100.3:5220/api";

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("API Utils", () => {
  const mockToken = "mock-jwt-token";
  const mockUrl = "http://192.168.100.3:5220/api/movies";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("apiFetch", () => {
    it("makes successful GET request with token", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ movies: [{ id: 1, title: "Test Movie" }] }),
      } as Response);

      const result = await apiFetch("/movies", { method: "GET" }, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual({ movies: [{ id: 1, title: "Test Movie" }] });
    });

    it("throws error on non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      } as Response);

      await expect(apiFetch("/auth")).rejects.toThrow("API Error: 401");
    });
  });

  describe("apiGet", () => {
    it("calls apiFetch with GET method", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      } as Response);

      await apiGet("/movies", mockToken);

      expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe("apiPost", () => {
    it("sends POST with JSON body", async () => {
      const mockBody = { title: "New Movie", year: 2026 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      } as Response);

      await apiPost(mockBody, "/movies", mockToken);

      expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockBody),
      });
    });
  });

  describe("apiPut", () => {
    it("sends PUT with JSON body", async () => {
      const mockBody = { title: "Updated Movie" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await apiPut(mockBody, "/movies/1", mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/movies/1`,
        expect.objectContaining({ method: "PUT" }),
      );
    });
  });
});
