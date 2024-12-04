import React, { useEffect, useState } from 'react';
import { Container, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogContent from '@mui/joy/DialogContent';
import PostCreateForm from '../ui-components/PostCreateForm';
import Articles from '../components/Articles';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

const Posts: React.FC<any> = ({ self }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = useState<boolean>(false);
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(false); // Track refresh state
  const { user } = useAuthenticator((context) => [context.user]);

  const fetchPosts = async () => {
    try {
      const { data: items, errors } = await client.models.Post.list({
        filter: self ? { owner: { contains: user?.username } } : undefined, // Proper conditional for filter
        authMode: "identityPool",
      });

      if (!errors) {
        const filteredItems = items.filter((item: any) => item !== null);
        setPosts(filteredItems);
        setNeedsRefresh(false); // Reset refresh flag after fetching
      } else {
        setError(errors.toString());
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Trigger fetch when 'needsRefresh' changes
  }, [needsRefresh, user]);

  return (
    <Container component="main">
      <Button
        style={{ marginBottom: '15px' }}
        variant="contained"
        onClick={()=>{setOpen(true)}}
      >
        Add new
      </Button>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Articles
          posts={posts}
          onSuccess={() => {
            setNeedsRefresh(true); // Signal to refetch posts
          }}
        />
      </Paper>

      <Modal
        open={open}
        onClose={() => {
          navigate(-1);
        }}
      >
        <ModalDialog minWidth="90%">
          <ModalClose style={{ margin: '10px' }} />
          <DialogContent>
            {error && <p>{error}</p>}
            <PostCreateForm
              onSuccess={() => {
                setNeedsRefresh(true); // Signal to refetch posts
                navigate("/posts", { replace: true });
                setOpen(false); // Close the modal after success
              }}
            />
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>
  );
};

export default Posts;
