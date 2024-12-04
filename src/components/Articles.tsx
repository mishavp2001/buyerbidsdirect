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
} from "@mui/material";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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

    const handleExpandClick = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpenModal = (post: Post) => {
        setModalData(post);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <div>
            {posts.map((post) => (
                <Card key={post.id} style={{ marginBottom: "20px" }}>
                    <CardHeader title={post.title} subheader={post.name} />
                    {post.picture && (
                        <StorageImage
                            width="350px"
                            alt={post.picture}
                            path={post.picture}
                        />
                    )}
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {expanded[post.id]
                                ? post.post
                                : `${post.post.slice(0, 100)}...`}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => handleExpandClick(post.id)}
                            endIcon={expanded[post.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                            {expanded[post.id] ? "Less" : "More"}
                        </Button>
                        {user?.username === post.owner && (
                            <Button onClick={() => handleOpenModal(post)}>Edit</Button>
                        )}
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
                </Card>
            ))}

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
        </div>
    );
};

export default Articles;
