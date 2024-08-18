import { useUpdateSettings } from "./use-settings";
import { renderHook, waitFor } from "test-utils";
// https://github.com/TanStack/query/discussions/1650
vi.mock("./use-settings", async () => {
  return {
    useSettings: vi.fn(),
    useUpdateSettings: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
    })),
  };
});

describe("useUpdateSettings", () => {
  it("should call useUpdateSettings and return expected response", async () => {
    renderHook(() => useUpdateSettings());
    const mutateMock = vi.fn();
    vi.mocked(useUpdateSettings).mockReturnValue({
      mutate: mutateMock,
    } as any);

    const { mutate } = useUpdateSettings();
    mutate({
      newSettings: {
        language: "en",
      },
    });

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({
        newSettings: {
          language: "en",
        },
      });
    });
  });
});
