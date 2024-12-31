import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function Profile() {
    const [myName, setMyName] = useState('')

    const [name, setName] = useState('')

    const [posts, setPosts] = useState(0)

    const credentials = localStorage.getItem("credentials")

    const [user, setuser] = useState('')

    const [userPosts, setuserPosts] = useState([])

    const [content, setContent] = useState('')

    let navigate = useNavigate();

    useEffect(() => {
        const getMe = async () => {
            try {
                const response
                    = await axios.get('http://localhost:8000/api/me', {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                setMyName(response.data.username);
                setName(response.data.full_name);
                setPosts(response.data.posts);
                console.log("myName", myName);
            } catch (error) {
                if (error.response.status === 401) {
                    alert("Please log in")
                }
            }
        };

        getMe();
    }, [credentials]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response
                    = await axios.get(`http://localhost:8000/api/users/${myName}/posts`, {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                setuserPosts(response.data);
                console.log(response.data);
            } catch (error) {
                if (error.response.status === 404) {
                    console.log(error.response.status)
                }
            }
        };

        getPosts();
    }, [myName, credentials]);

    async function Search() {
        try {
            const response
                = await axios.get(`http://localhost:8000/api/users/${user}`);
            if (response.status === 200) {
                navigate(`/${user}`, {state: {username: response.data.username,
                        full_name: response.data.full_name,
                        posts: response.data.posts}});
            }
        } catch (error) {
            if (error.response.status === 404) {
                alert("User with this name doesn't exist")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function createPost() {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/users/${myName}/posts`,
                { content: content },
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 200) {
                const postsResponse = await axios.get(
                    `http://localhost:8000/api/users/${myName}/posts`,
                    {
                        headers: {
                            'Authorization': `Basic ${credentials}`
                        }
                    }
                );
                setuserPosts(postsResponse.data);
                setContent('');
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 403) {
                alert("You are not allowed to create post")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function Likes(postId) {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/users/${myName}/posts/${postId}/like`,
                {},
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 201) {
                setuserPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: post.likes + 1,
                            is_liked: true
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function Dislikes(postId) {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/users/${myName}/posts/${postId}/like`,
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 204) {
                setuserPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: post.likes - 1,
                            is_liked: false
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function Read(postId){
        try {
            const response = await axios.get(
                `http://localhost:8000/api/users/${myName}/posts/${postId}`,
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 200) {
                navigate(`${postId}/read`, {state: {content: response.data.content}});
            }
        } catch (error) {
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    return (<>
        <input type='text'
               placeholder='Find user'
               value={user}
               onChange={(e) => setuser(e.target.value)}/>
        <button onClick={Search}>Find</button>
        <hr/>

        <div>
            <p>Username: {myName}</p>
            <p>Full Name: {name}</p>
            <p>Posts: {posts}</p>
        </div>

        <input type='text'
               placeholder='Post content'
               value={content}
               onChange={(e) => setContent(e.target.value)}/>
        <button onClick={createPost}>Create post</button>

        {userPosts.map(post => (
            <div key={post.id}>
                <hr/>
                <button onClick={() => Read(post.id)}>Read</button>
                Likes: {post.likes}
                <button
                    onClick={() => post.is_liked ? Dislikes(post.id) : Likes(post.id)}>
                    {post.is_liked ? 'Unlike' : 'Like'}
                </button>
            </div>
        ))}
    </>)
}