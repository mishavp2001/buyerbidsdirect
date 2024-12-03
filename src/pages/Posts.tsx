
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';
import PostUpdateForm from '../ui-components/PostUpdateForm';
import PostCreateForm from '../ui-components/PostCreateForm';

const client = generateClient<Schema>();

const Posts: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchPosts() {
      //const filter = userId  ? { id: { eq: userId } } : null;
      const { data: items, errors } = await client.models.Post.list({
        filter: postId ? { id: { eq: postId } } : undefined, // Proper conditional for filter
        authMode: "identityPool"
      })
      if (!errors) {
        //console.dir(items);
        const filteredItems = items.filter((item: any) => item !== null);
        setPosts(filteredItems);
      } else {
        setError(errors.toString)
        //console.dir(errors);
      }
    }
    fetchPosts();
  }, [postId]);

  useEffect(() => {
    if (postId !== '' && typeof (postId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [postId]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 10 },
    { field: 'name', headerName: 'Name', flex: 200 },
    { field: 'title', headerName: 'Title', flex: 200 },
    { field: 'post', headerName: 'Post', flex: 150 },
  ];

  const handleRowClick = (params: {
    row: any; id: any;
  }) => {
    navigate(`/posts/${params.row.id}`);
  }

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Button variant="contained" style={{ float: 'right' }} component={RouterLink} to={`/posts/new`}>
          Add new
        </Button>
        <Typography component="h1" variant="h5">Posts
        </Typography>

        <Paper elevation={3} sx={{ marginTop: '15px', padding: '15px 10px', height: 400, width: '100%' }}>
          <DataGrid
            sx={{
              // disable cell selection style
              '.MuiDataGrid-cell:focus': {
                outline: 'none'
              },
              // pointer cursor on ALL rows
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer'
              }
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            onRowClick={handleRowClick}
            rows={posts}
            columns={columns}
          />

        </Paper>
      </Paper>

      <Modal
        open={open}
        onClose={() => { navigate(-1); }}
      >
        <ModalDialog minWidth='90%' >
          <ModalClose style={{ margin: '10px' }} />
          <DialogTitle>Posts</DialogTitle>
          <DialogContent>
            {error && <p>{error}</p>}
            {
              postId?.indexOf('new') === -1 ?
                <>
                  <PostUpdateForm
                    id={postId}
                    overrides={
                      {
                      }}
                    onSuccess={() => { navigate("/posts", { replace: true }); }} />
                </>
                :
                <>
                  <PostCreateForm
                    onSuccess={() => { navigate("/posts", { replace: true }); }}
                  />
                </>
            }
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>

  );
};

export default Posts;
