import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Modal,
    Box,
    Grid,
} from "@mui/material";
import { Mail, OpenInBrowser, Edit } from '@mui/icons-material';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import PostUpdateForm from "../ui-components/PostUpdateForm";
import DialogContent from "@mui/joy/DialogContent";
import { LikeButton } from "./LikeButton";
import { Divider } from "@mui/joy";

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
    view: boolean;
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


    const handleOpenModal = (post: Post, view: boolean) => {
        post.view = view;
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
                {posts.map((post) => {
                    post.picture = post.picture || 'picture-submissions/bdff7313eeffa4dcd3619f4a671fc192fc8e8c18.webp';

                    return <Grid
                        item
                        xs={12} md={6}
                    >
                        <Card key={post.id}
                            style={{ minWidth: '90%', height: 'auto', margin: "10px" }}>
                            <CardHeader title={post.title} subheader={<span>{post.name}</span>}
                            />
                            <CardContent style={{
                                width: '90%',
                                height: `${post.picture ? '250px' : '0px'}`,
                                overflowY: 'hidden'
                            }}>
                                <StorageImage
                                    onClick={() => handleOpenModal(post, true)}
                                    style={{ width: '90%', margin: "10px" }}
                                    alt={post.picture}
                                    path={post.picture || '""'}
                                />
                            </CardContent>
                            <CardContent style={{
                                height: '150px', // Set a maximum height for the scrollable area
                                margin: '10px', // Enable vertical scrolling
                                overflowX: 'hidden', // Prevent horizontal scrolling
                                bottom: 0,
                            }}>
                                <>
                                    <Divider sx={{ margin: '10px 0px' }} />
                                    <span title='E-mail to the owner'>
                                        <Mail sx={{ cursor: 'pointer',  marginRight: '20px', }} onClick={(evt) => { evt.stopPropagation(); window.location.href = `mailto:${post.email}` }} />
                                        </span>
                                    <span title='Check website'>
                                        <OpenInBrowser sx={{ marginRight: '20px', cursor: 'pointer' }} onClick={(evt: { stopPropagation: () => void; }) => { evt.stopPropagation(); window.location.href = post.website }} />
                                    </span>
                                    <span>
                                        {user?.username === post.owner && (<span title='Edit'>
                                            <Edit sx={{ marginRight: '20px', cursor: 'pointer' }} onClick={() => handleOpenModal(post, false)} />
                                        </span>
                                        )}
                                    </span>
                                    <LikeButton propertyId={post.id} user={user} favorites={[]} property={post} /> 
                                </>
                            </CardContent>
                        </Card>
                    </Grid>
                })}
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
                            {modalData?.view ?
                                <>
                                     <h1>{modalData.title}</h1>
                                     {modalData?.picture && (
                                     <StorageImage
                                        alt={modalData?.picture}
                                        path={modalData?.picture}
                                    />)}
                                    {modalData?.post}
                                    <p>{modalData?.name}</p>
                                </>
                           
                                :
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
                            }
                      
                        </DialogContent>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Articles;
