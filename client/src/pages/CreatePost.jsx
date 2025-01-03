import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null); // Optional cover image
  const [redirect, setRedirect] = useState(false);
  const [warning, setWarning] = useState(''); // Warning for missing cover image

  async function createNewPost(ev) {
    ev.preventDefault();

    // Reset warning
    setWarning('');

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);

    // Add file only if it exists
    if (files && files[0]) {
      data.set('file', files[0]);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        setWarning(`Failed to create post: ${errorMessage}`);
      }
    } catch (error) {
      setWarning('An error occurred while creating the post. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Post
      </Typography>
      {warning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {warning}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={createNewPost}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 2,
        }}
      >
        {/* Title Input */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />

        {/* Summary Input */}
        <TextField
          label="Summary"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          required
        />

        {/* File Upload */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Upload Cover Image (Optional)
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{ justifyContent: 'flex-start' }}
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={(ev) => setFiles(ev.target.files)}
            />
          </Button>
          {files && files[0] && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected File: {files[0]?.name}
            </Typography>
          )}
        </Box>

        {/* Content Editor */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Post Content
          </Typography>
          <Editor value={content} onChange={setContent} />
        </Box>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" size="large">
          Create Post
        </Button>
      </Box>
    </Container>
  );
}
