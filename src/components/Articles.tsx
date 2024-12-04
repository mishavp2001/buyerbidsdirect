import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    Link,
    Modal,
    Box,
    Grid,
} from "@mui/material";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import PostUpdateForm from "../ui-components/PostUpdateForm";
import DialogContent from "@mui/joy/DialogContent";

// Define the type for a post
interface Post {
    id: string;
    title: string;
    post: string;
    picture?: string;
    website: string;
    email: string;
    name: string;
    owner?: string;
}

// Props for the Articles component
interface ArticlesProps {
    posts: Post[];
    onSuccess: () => void;
}

const Articles: React.FC<ArticlesProps> = ({ posts, onSuccess }) => {
    const [modalData, setModalData] = useState<Post | null>(null);
    const [email, setEmail] = useState<string>("");
    const { user } = useAuthenticator((context) => [context.user]);

    // Fetch user attributes when the component mounts
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                const emailAttr = userAttributes?.email ?? "Guest";
                setEmail(emailAttr);
            } catch (err) {
                console.error("Error fetching user attributes:", err);
            }
        };

        fetchAttributes();
    }, []);


    const handleOpenModal = (post: Post) => {
        setModalData(post);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <>
            <Grid
                container
                spacing={1}
                display="flex">
                {posts.map((post) => (
                    <Grid
                        item
                        xs={12} md={6}
                    >
                        <Card key={post.id} style={{ margin: "20px", height: '450px' }}>
                            <CardHeader title={post.title} subheader={post.name} />
                            {post.picture && (
                                <StorageImage
                                    width="150px"
                                    height="150px"
                                    alt={post.picture}
                                    path={post.picture}
                                    style={{ top: 0, float: 'right', margin: "20px" }}
                                />
                            )}
                            <CardContent style={{
                                height: '200px', // Set a maximum height for the scrollable area
                                overflowY: 'auto', // Enable vertical scrolling
                                overflowX: 'hidden', // Prevent horizontal scrolling
                            }}>
                                <Typography variant="body2" color="text.secondary" style={{ overflow: 'scroll' }}>
                                    {post.post}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Typography variant="body2">
                                    Website:{" "}
                                    <Link href={post.website} target="_blank" rel="noopener">
                                        {post.website}
                                    </Link>
                                </Typography>
                                <Typography variant="body2">Email: {post.email}</Typography>
                            </CardContent>
                            {user?.username === post.owner && (
                                <Button onClick={() => handleOpenModal(post)}>Edit</Button>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal
                open={!!modalData}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        width: "350px",
                        height: "100vh",
                        overflow: "scroll",
                        minWidth: 450,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    {modalData && (
                        <DialogContent>
                            <PostUpdateForm
                                id={modalData.id}
                                overrides={{
                                    id: {
                                        value: user?.userId || "",
                                        hidden: true,
                                        isDisabled: true,
                                    },
                                    email: {
                                        value: email || user?.signInDetails?.loginId || "",
                                        hidden: true,
                                        isDisabled: true,
                                    },
                                }}
                                onSuccess={() => {
                                    handleCloseModal();
                                    onSuccess();
                                }}
                            />
                        </DialogContent>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Articles;
