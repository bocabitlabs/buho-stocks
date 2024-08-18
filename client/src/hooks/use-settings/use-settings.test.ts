import { useSettings } from "./use-settings";
import { renderHook, wrapper, waitFor } from "test-utils";

describe("useSettings", () => {
  it("should call useSettings and return expected response", async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    // {"companyDisplayMode":"","companySortBy":"","displayWelcome":false,"language":"es","id":1,"lastUpdated":"2024-08-13T17:38:03.707843Z","mainPortfolio":"","portfolioSortBy":"","portfolioDisplayMode":"","timezone":"Europe/Zurich","sentryDsn":"https://863c26cf130741e594cb5d93e3339568@o301826.ingest.sentry.io/1727901","sentryEnabled":true}
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const user = result.current.data;
    expect(user).toHaveProperty("language");
    expect(user).toHaveProperty("timezone");
    expect(user).toHaveProperty("portfolioSortBy");
    expect(user).toHaveProperty("companySortBy");
    expect(user).toHaveProperty("mainPortfolio");
    expect(user).toHaveProperty("portfolioDisplayMode");
    expect(user).toHaveProperty("companyDisplayMode");
    expect(user).toHaveProperty("sentryDsn");
    expect(user).toHaveProperty("sentryEnabled");
    expect(user).toHaveProperty("lastUpdated");
  });
});
//   it("should call useMutation with the correct arguments", () => {
//     renderHook(() => useUpdateSettings());

//     expect(useMutation).toHaveBeenCalledWith(expect.any(Function), {
//       onSuccess: expect.any(Function),
//       onError: expect.any(Function),
//     });
//   });

//   it("should call fetchSettings when useQuery is called", async () => {
//     useQuery.mockImplementationOnce(() => ({
//       data: null,
//       isLoading: false,
//       isError: false,
//       refetch: vi.fn(),
//     }));

//     await act(async () => {
//       renderHook(() => useSettings());
//     });

//     expect(fetchSettings).toHaveBeenCalled();
//   });

//   it("should call showNotification with the success message when updateSettings mutation succeeds", async () => {
//     const successMessage = "Settings updated successfully";

//     useMutation.mockImplementationOnce(() => ({
//       mutate: vi.fn(),
//     }));

//     await act(async () => {
//       renderHook(() => useUpdateSettings());
//     });

//     const onSuccess = useMutation.mock.calls[0][1].onSuccess;

//     await act(async () => {
//       onSuccess();
//     });

//     expect(notifications.showNotification).toHaveBeenCalledWith({
//       title: "Success",
//       message: successMessage,
//       color: "green",
//     });
//   });

//   it("should call showNotification with the error message when updateSettings mutation fails", async () => {
//     const errorMessage = "Failed to update settings";

//     useMutation.mockImplementationOnce(() => ({
//       mutate: vi.fn(),
//     }));

//     await act(async () => {
//       renderHook(() => useUpdateSettings());
//     });

//     const onError = useMutation.mock.calls[0][1].onError;

//     await act(async () => {
//       onError();
//     });

//     expect(notifications.showNotification).toHaveBeenCalledWith({
//       title: "Error",
//       message: errorMessage,
//       color: "red",
//     });
//   });
