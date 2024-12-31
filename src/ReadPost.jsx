import { useLocation } from 'react-router-dom';

export function ReadPost() {

    const location = useLocation();
    const { content } = location.state || {};

    return(<>
        <h1>{content}</h1>
    </>)
}