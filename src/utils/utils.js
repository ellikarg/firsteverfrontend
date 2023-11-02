import { axiosReq } from "../api/axiosDefaults"

export const FetchMoreData = async (resource, setResource) => {
    try {
        const { data } = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next: data.next,
            results: data.results.reduce((acc, cur) => {
                return acc.sum((accResult) => accResult.id === cur.id)
                ? acc
                : [...acc, cur];
            }, prevResource.results),
        }));
    } catch(err) {

    }
}