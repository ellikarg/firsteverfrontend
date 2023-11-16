import React from 'react'
import styles from '../../styles/Post.module.css'
import appStyles from "../../App.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Avatar from '../../components/Avatar';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';

const Post = (props) => {

    const {
        id,
        owner,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        title,
        description,
        content,
        image,
        category_name,
        updated_at,
        postPage,
        postsPage,
        setPosts,
        } = props;

    const CurrentUser = useCurrentUser();
    const is_owner = CurrentUser?.username === owner;
    const history = useHistory();

    const handleEdit = () => {
        history.push(`/posts/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/posts/${id}/`);
            history.goBack();
        } catch(err){
            console.log(err)
        };
    };

    const handleLike = async () => {
        try {
            const { data } = await axiosRes.post("/likes/", { post: id });
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post,
                        likes_count: post.likes_count + 1,
                        like_id: data.id}
                    : post;
                }),
            }));
        } catch(err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try {
            await axiosRes.delete(`/likes/${like_id}/`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post,
                        likes_count: post.likes_count - 1,
                        like_id: null}
                    : post;
                }),
            }));
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <>
        <Card>
            <div className={styles.Container}>
                <Card.Img src={image} alt={title}
                    className={appStyles.Image}/>
                <div className={styles.Likes}>
                    <div className={styles.Bubble}>
                        {is_owner ? (
                            <OverlayTrigger
                                placement='top'
                                overlay=
                                {<Tooltip>
                                    You can't like your own post!
                                </Tooltip>}>
                                <i className="far fa-heart" />
                            </OverlayTrigger>
                        ) : like_id ? (
                            <span onClick={handleUnlike}>
                                <i className={`fas fa-heart ${styles.Heart}`}/>
                            </span>
                        ) : CurrentUser ? (
                            <span onClick={handleLike}>
                                <i className={`far fa-heart
                                    ${styles.HeartOutline}`}
                                />
                            </span>
                        ) : (
                            <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip>Log in to like Posts!</Tooltip>}>
                                <i className='far fa-heart' />
                            </OverlayTrigger>
                        )}
                        {likes_count}
                    </div>
                </div>
            </div>
            {postPage && 
            <Card.Body>
                <Media
                    className='align-items-center
                    justify-content-between'>
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profile_image} height={55} />
                        {owner}
                    </Link>
                    <div className='d-flex align-items-center'>
                        <span>{updated_at}</span>
                        {is_owner && postPage &&
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete} 
                            />}
                    </div>
                </Media>
            </Card.Body>}
            <Card.Body className='text-center'>
                    {postPage &&
                    <>
                        {title && 
                            <Card.Title
                                className={styles.CardItems}>
                                    {title}
                            </Card.Title>}
                        {description &&
                            <Card.Subtitle
                                className="mb-2 text-muted">
                                    {description}
                            </Card.Subtitle>}
                        {content &&
                            <Card.Text
                                className={styles.CardItems}>
                                    {content}
                            </Card.Text>}
                        <i className="fa-solid fa-feather"></i>
                    </>
                    }
                    {postsPage &&
                    <>
                        <Link to={`/posts/${id}`} className={styles.CardLink}>
                            {title && 
                                <Card.Title>{title}</Card.Title>}
                            {description &&
                            <Card.Subtitle
                                className="mb-2 text-muted">
                                    {description}
                            </Card.Subtitle>}
                        </Link>
                        <Link to={`/posts/${id}`} className={styles.CardLink}>
                            <i className="fa-solid fa-feather"></i>
                        </Link>
                    </>
                    }
                    {comments_count}
                    {category_name === null? (
                        <p>No category yet</p>
                    ) : (
                        <p 
                            className={styles.CardItems}>
                                Category: {category_name}
                        </p>
                    )}
            </Card.Body>
        </Card>
        </>
    )
}

export default Post