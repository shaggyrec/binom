import   { useLocation } from 'react-router-dom';

function getSearch() {
    try {
        return useLocation().search;
    } catch (e) {
        return location.search;
    }
}

export default function useQueryString(): URLSearchParams {
    return new URLSearchParams(getSearch());
}