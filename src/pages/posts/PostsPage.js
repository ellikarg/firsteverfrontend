import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import Buttons from "../../styles/Button.module.css";
import {useLocation} from "react-router-dom/cjs/react-router-dom.min";
import {axiosReq} from "../../api/axiosDefaults";
import Post from "./Post";
import NoResults from "../../assets/no_results.PNG"
import Asset from "../../components/Assets";
import {Form} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchMoreData} from "../../utils/utils";
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import Masonry from 'react-masonry-css';


function PostsPage({
    message,
    filter = ""
}) {
    const [posts, setPosts] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const {pathname} = useLocation();
    const [query, setQuery] = useState("");
    const currentUser = useCurrentUser();
    const [cats, setCats] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState({results: []});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const {data} = await axiosReq.get(
                    `/posts/?${filter}search=${query}`
                );
                setPosts(data);
                setFilteredPosts(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        setHasLoaded(false);

        const getCats = async () => {
            try {
                const res = await axiosReq.get("/categories");
                setCats(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getCats();

        const timer = setTimeout(() => {
            fetchPosts();
        }, 1000);

        return() => {
            clearTimeout(timer);
        };
    }, [filter, query, pathname, currentUser]);

    const filterResult = (catItem) => {
        const result = posts.results.filter(
            curData => curData.category === catItem
        );
        setFilteredPosts((prevFilteredPosts) => ({
            ...prevFilteredPosts,
            results: result
        }));
    };

    return (
        <Container>
            <Row className="h-100">
                <Col className="py-2 p-0 p-lg-2"
                    md={6}>
                    <i className={`fas fa-search ${styles.SearchIcon}`}/>
                    <Form 
                        className={styles.SearchBar}
                        onSubmit={(event) => event.preventDefault()}>
                        <Form.Control value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            type="text"
                            className="mr-sm-2"
                            placeholder="Search Posts"/>
                    </Form>
                </Col>
            </Row>
            <Row className={styles.PostsContent}>
                <Col md={2}
                    className="d-lg-block">
                    <div className={styles.Categories}>
                        <h1>Categories:</h1>
                        <div className={styles.Catflex}>
                            {hasLoaded && (cats.results.map((c) => (
                                <button
                                    className={Buttons.buttonLight}
                                    key={c.id}
                                    onClick={() => filterResult(c.id)}>
                                    {c.name}
                                </button>
                            )))}
                        </div>
                    </div>
                </Col>
                <Col md={10}
                    className={styles.Posts}>
                    {hasLoaded ? (
                        <> {
                            filteredPosts.results.length ? (
                                <InfiniteScroll
                                    dataLength={filteredPosts.results.length}
                                    hasMore={!!filteredPosts.next}
                                    next={() => fetchMoreData(
                                        filteredPosts,
                                        setFilteredPosts
                                        )}>
                                    <Masonry 
                                        breakpointCols={
                                            {
                                                default: 3,
                                                1000: 2,
                                                800: 1
                                            }
                                        }
                                        className={styles.MyMasonryGrid}
                                        columnClassName={
                                            styles.MyMasonryGridColumn
                                        }>
                                        {filteredPosts.results.map((post) => (
                                            <div key={post.id}>
                                                <Post {...post}
                                                    setPosts={setFilteredPosts}
                                                    postsPage/>
                                            </div>
                                        ))} 
                                    </Masonry>
                                </InfiniteScroll>
                            ) : (
                                <Container className={appStyles.Content}>
                                    <Asset src={NoResults} message={message}/>
                                </Container>
                            )
                        } </>
                    ) : (
                        <div>
                            <Container className={appStyles.Content}>
                                <Asset spinner/>
                            </Container>
                        </div>
                    )
                } </Col>
            </Row>
        </Container>
    );
}

export default PostsPage;
