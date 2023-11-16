import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";

import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";


function PostEditForm() {
    useRedirect('loggedOut');

    const [errors, setErrors] = useState({});
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        content: "",
        image: "",
        category: "",
    })
    const { title, description, content, image, category, } = postData;
    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}/`);
                const {
                    title,
                    description,
                    content,
                    image,
                    category,
                    is_owner,
                } = data;

                is_owner ? setPostData(
                    {
                        title,
                        description,
                        content,
                        image,
                        category,
                    }) : history.push(`/`);
            } catch(err) {
                console.log(err);
            }
        }
        handleMount();

        const getCats = async () => {
            try {
                const res = await axiosReq.get("/categories");
                setCats(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getCats();

    }, [history, id]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', content);
        formData.append('category', category);

        if (imageInput?.current?.files[0]) {
            formData.append('image', imageInput.current.files[0]);
        }
    
        try {
            await axiosReq.put(`/posts/${id}/`, formData);
            history.push(`/posts/${id}`);
        } catch(err){
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
        <div className="text-center">
                <Form.Group>
                    <Form.Label className="d-none">Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your title"
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                </Form.Group>

                {errors?.title?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Form.Group>
                    <Form.Label className="d-none">Short Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter a short description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                    />
                </Form.Group>

                {errors?.description?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Form.Group>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter your content"
                        name="content"
                        rows={6}
                        value={content}
                        onChange={handleChange}>
                    </Form.Control>
                </Form.Group>

                {errors?.content?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label className="d-none">Category</Form.Label>
                    <Form.Control
                        as="select"
                        custom name="category"
                        value={category}
                        onChange={handleChange}>
                        <option value="" disabled>Choose a Category</option>
                        {cats.length === 0 ? (
                            <option>Loading Categories...</option>
                        ) : (cats.results.map((c) => (
                            <option
                                key={c.id}
                                value={c.id}>
                                    {c.name}
                            </option>
                        )))}
                    </Form.Control>
            </Form.Group>

            {errors?.category?.map((message, idx) => (
                <Alert variant="warning"
                    key={idx}>
                    {message}</Alert>
            ))}

            <Button onClick={() => history.goBack()}>cancel</Button>
            <Button type="submit">save</Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2"
                    md={7}
                    lg={8}>
                    <Container className={
                        `${appStyles.Content} 
                        ${styles.Container} 
                        d-flex flex-column justify-content-center`}>
                        <Form.Group className="text-center">
                            <>
                                <figure>
                                    <Image
                                        className={appStyles.Image}
                                        src={image} rounded />
                                </figure>
                                <div>
                                <Form.Label htmlFor="image-upload">
                                    Change the image
                                </Form.Label>
                                </div>
                            </>
                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />
                        </Form.Group>

                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}

                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5}
                    lg={4}
                    className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;
