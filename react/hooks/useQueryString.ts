import   { useLocation } from 'react-router-dom';

export default function useQueryString(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}