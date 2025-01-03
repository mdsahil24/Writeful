import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { Avatar, Box, Button, Typography, Container } from "@mui/material";
import { format } from "date-fns"; // Updated for custom date and time format

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => {
        response.json().then((postInfo) => {
          setPostInfo(postInfo);
        });
      });
  }, [id]);

  if (!postInfo) return <p>Loading...</p>;

  return (
    <Container maxWidth="md" sx={{ mt: -4 }}> {/* Shrink width to 'sm' */}
      <Box sx={{ width: '700px', margin: '0 auto' }}>
        {/* Title Section */}
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          {postInfo.title}
        </Typography>

        {/* Summary Section */}
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>
          {postInfo.summary} {/* Displaying the summary here */}
        </Typography>

        {/* Date and Author Section */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {postInfo.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {postInfo.author.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(postInfo.createdAt), 'MMM dd, yyyy')} at {format(new Date(postInfo.createdAt), 'h:mm a')}
              </Typography>
            </Box>
          </Box>

          {/* Edit Button (Visible only for the post author) */}
          {userInfo.id === postInfo.author._id && (
            <Link to={`/edit/${postInfo._id}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                Edit Post
              </Button>
            </Link>
          )}
        </Box>

        {/* Image Section (Rectangle Shape) */}
        <Box mt={3}>
          <img
            src={`http://localhost:4000/${postInfo.cover}`}
            alt={postInfo.title}
            style={{ width: "100%", height: "auto", borderRadius: "8px", objectFit: "cover" }}
          />
        </Box>

        {/* Content Section */}
        <Box mt={3}>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        </Box>
      </Box>
    </Container>
  );
}
