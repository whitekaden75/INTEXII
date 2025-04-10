export interface SubmitRatingPayload {
  userId: number;
  showId: string;
  rating: number;
}

const API_BASE_URL = "https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net/api/Movies";

export const postRatingAPI = async (
  payload: SubmitRatingPayload
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to submit rating:", err);
    return false;
  }
};
