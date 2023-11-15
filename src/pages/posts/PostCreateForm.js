import React, { useRef, useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Upload from "../../assets/upload_img.PNG";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import Buttons from "../../styles/Button.module.css";

import Asset from "../../components/Assets";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateForm() {
    useRedirect('loggedOut');
    const [errors, setErrors] = useState({});
    // const [quillContent, setQuillContent] = useState('');
    // const quillRef = useRef(null);

    const [postData, setPostData] = useState({
        title: "",
        description: "",
        content: "",
        image: "",
        category: "",
    });

    const { title, description, image, content, category} = postData;

    const imageInput = useRef(null);

    const history = useHistory();

    const [cats, setCats] = useState([]);

    useEffect(() => {
        const getCats = async () => {
            try {
              const res = await axiosReq.get("/categories");
              setCats(res.data);
            } catch(err) {
              console.log(err);
            }
          };
          getCats();
    }, []);

    // const handleChange = (event) => {
    //     const { name, value } = event.target;

    // // Handle standard form inputs
    //     if (name !== 'quillContent') {
    //         setPostData({
    //             ...postData,
    //             [name]: value,
    //         });
    //     }       

    // // Handle Quill editor
    //     if (name === 'quillContent') {
    //         const editor = quillRef.current.getEditor();
    //         if (editor) {
    //             const quillInput = editor.clipboard.convert(editor.getSemanticHTML());
    //             setPostData({
    //                 ...postData,
    //                 content: quillInput,
    //             });
    //         }
    //     }
    // };

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    // const handleQuillChange = (value) => {
    //     const richText = getRichText(value);
    //     if (richText !== postData.content) {
    //         setPostData({
    //         ...postData,
    //         content: richText,
    //         });
    //         console.log(richText);
    //     }
    // };

    // const getRichText = (html) => {
    //     if (!html) {
    //         return "";
    //     }
    //     const div = document.createElement('div');
    //     div.innerHTML = html;
    //     return div.innerText;
    // };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event, cats) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('content', content);
        formData.append('image', imageInput.current.files[0]);
        formData.append('category', category);

        try {
            const {data} = await axiosReq.post('/posts/', formData);
            history.push(`/posts/${data.id}`);
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
                <Form.Label className="d-none">Content</Form.Label>
                {/* <div className={styles.EditorContainer}>
                    <ReactQuill
                    className={styles.EditorQuill}
                    theme="snow"
                    ref={quillRef}
                    name="quillContent"
                    value={quillContent}
                    onChange={setQuillContent}
                    placeholder="Enter your content"
                    />
                </div> */}
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
                    custom
                    name="category"
                    value={category}
                    onChange={handleChange}>
                <option value="" disabled>Choose a Category</option>
                {cats.length === 0 ? (
                    <option>Loading Categories...</option>
                ):(
                    cats.results.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                )}                
                </Form.Control>
            </Form.Group>

            {errors?.category?.map((message, idx) => (
                <Alert variant="warning" key={idx}>{message}</Alert>
            ))}

            <Button
                onClick={() => history.goBack()}
                className={Buttons.buttonDark}
            >cancel</Button>
            <Button type="submit" className={Buttons.buttonDark}>create</Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2"
                    md={5}>
                    <Container className={
                        `${appStyles.Content} 
                        ${styles.Container} 
                        d-flex flex-column justify-content-center`}>
                        <Form.Group className="text-center">

                            {image ? (
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
                            ) : (
                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="image-upload">
                                <Asset
                                    src={Upload}
                                    message="Click or tap to upload an image"
                                />
                                </Form.Label>
                            )}

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
                <Col md={7}
                    className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostCreateForm;
