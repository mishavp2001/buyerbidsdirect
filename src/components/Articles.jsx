import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Link,
    Modal,
    Box,
} from "@mui/material";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { generateClient } from "aws-amplify/data";
import { useAuthenticator} from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PostUpdateForm from '../ui-components/PostUpdateForm';
import DialogContent from '@mui/joy/DialogContent';

const client = generateClient();

const Articles = ({ posts, onSuccess }) => {
    const [expanded, setExpanded] = useState({});
    const [modalData, setModalData] = useState(null);

    // Fetch user attributes when the component mounts
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                const email = userAttributes?.email ?? 'Guest';
                setEmail(email);
            } catch (err) {
                console.error('Error fetching user attributes:', err);
            }
        };

        fetchAttributes();
    }, []);

    const { user } = useAuthenticator((context) => [context.user]);
    const userId = user?.userId;
    const [email, setEmail] = useState('');
    const handleExpandClick = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpenModal = (post) => {
        setModalData(post);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <div>
            {posts.map((post) => (
                <Card key={post.id} style={{ marginBottom: "20px" }}>
                    <CardHeader
                        title={post.title}
                        subheader={post.name}
                    />
                    {post.picture && (
                        <StorageImage 
                            width='350px'
                            alt={post.picture} 
                            path={post.picture} />
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
                            <Button
                                onClick={() => handleOpenModal(post)}>
                                Edit
                            </Button>
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
                        height: '100vh',
                        overflow: 'scroll',
                        minWidth: 450,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    {modalData &&
                        <DialogContent>
                            <PostUpdateForm
                                id={modalData.id}
                                overrides={
                                    {
                                        id: { value: user?.userId, hidden: true, isDisabled: true },
                                        email: { value: email || user?.signInDetails?.loginId, hidden: true, isDisabled: true }
                                    }}
                                onSuccess={() => { handleCloseModal(); onSuccess(); }} />
                        </DialogContent>
                    }
                </Box>
            </Modal>
        </div>
    );
};

export default Articles;
