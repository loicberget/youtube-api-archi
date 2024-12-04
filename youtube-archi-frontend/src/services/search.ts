interface SearchResponse {
    id: string;
    url: string;
    title: string;
    channel_id: string;
    channel_title: string;
    description: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    duration: number;
    days_since_published: number;
    stored_at: string;
}

export async function search(query: string): Promise<SearchResponse[]> {
    const response = await fetch(`/search?q=${query}`);
    return await response.json();
}