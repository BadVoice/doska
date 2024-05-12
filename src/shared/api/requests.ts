import type {
    Bid,
    PreSearchRequest,
    PreSearchResponses,
    SearchRequest,
    SearchResponse,
} from '@/shared/api/generated/Api';
import axios from 'axios';

async function preSearchService(data: PreSearchRequest) {
    try {
        const response = await axios.post('/qwep/api/v1/pre_search', data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getPreSearch(data: {
    search: string;
}): Promise<PreSearchResponses> {
    try {
        return await preSearchService(data);
    } catch (error) {
        throw error;
    }
}
export async function getSearchService(
    data: SearchRequest,
): Promise<SearchResponse> {
    try {
        return await axios
            .post<SearchResponse>('/qwep/api/v1/search', data)
            .then((response) => response.data );
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function createBid(
    data: Bid,
) {
    try {
        return await axios
            .post<Bid>('/core/api/v1/bids/', data)
            .then((response) => response.data );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getBids() {
    try {
        return await axios
            .get<Bid[]>('/core/api/v1/bids/')
            .then((response) => response.data );
    } catch (error) {
        console.error(error);
        throw error;
    }
}