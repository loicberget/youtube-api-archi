export interface IEvaluatedComment {
    author: string;
    publishedAt: string;
    sentiment: {
        label: "positive" | "negative" | "neutral";
        score: number;
    };
    text: string;
    id: number;
}

export async function evaluate_channel(query: string): Promise<IEvaluatedComment[]> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/evaluate_channel/${query}`);
    return await response.json();
}