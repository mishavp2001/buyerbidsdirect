import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Modal,
    Box,
    Grid,
} from "@mui/material";
import { Mail, OpenInBrowser, UploadFile, Edit } from '@mui/icons-material';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import PostUpdateForm from "../ui-components/PostUpdateForm";
import DialogContent from "@mui/joy/DialogContent";
import { LikeButton } from "./LikeButton";

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
                        <Card key={post.id}
                            style={{minWidth: '90%', height: 'auto', margin: "10px"}}>
                            <CardHeader title={post.title} subheader={<><span title='E-mail to the owner'>
                                    <Mail sx={{ marginRight: 2, cursor: 'pointer' }} onClick={(evt) => { evt.stopPropagation(); window.location.href = `mailto:${post.email}` }} />
                                </span>
                                <span title='Check website'>
                                    <OpenInBrowser sx={{ marginRight: 2, cursor: 'pointer' }} onClick={(evt: { stopPropagation: () => void; }) => { evt.stopPropagation(); window.location.href = post.website }} />
                                </span>
                                <span>
                                {user?.username === post.owner && (
                                    <Edit onClick={() => handleOpenModal(post)} />
                                )}
                                </span>
                                </>}
                                />
                            <CardContent style={{
                                width: '90%',
                                height: `${post.picture? '250px' : '0px' }`,
                                overflowY: 'hidden'
                            }}>
                                {post.picture && (
                                    <StorageImage
                                        style={{width: '90%', margin: "10px"}}
                                        alt={post.picture}
                                        path={post.picture}
                                    />
                                )}
                            </CardContent>
                            <CardContent style={{
                                height: `${post.picture? '170px' : '400px' }`,
                                padding: 20,
                                overflowY: 'scroll'
                             }}>
                                <div
                                    style={{
                                        cursor: "pointer",
                                      }}
                                >
                                    {post?.post}
                                </div>
                            </CardContent>    
                            <CardContent style={{
                                height: '150px', // Set a maximum height for the scrollable area
                                margin: '20px', // Enable vertical scrolling
                                overflowX: 'hidden', // Prevent horizontal scrolling
                                bottom: 0,
                            }}>
                                <LikeButton
                                    propertyId={post.id} user={user} favorites={[]} property={post} />
                     
                                <span>{post.name}</span>    
                            </CardContent>
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
                        width: "450px",
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
