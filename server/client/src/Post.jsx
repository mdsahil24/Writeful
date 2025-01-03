import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
} from "@mui/material";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  
  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");
  const formattedTime = format(new Date(createdAt), "hh:mm a");

  // Set up default image URL using environment variable
  const imageUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/${cover}`;

  return (
    <Card sx={{ margin: 5, boxShadow: 3, borderRadius: 4 }}>
      {/* Image Section */}
      <Link to={`/post/${_id}`}>
        <CardMedia
          component="img"
          height="250"
          image={imageUrl} // Using dynamic image URL
          alt={title}
          onError={(e) => e.target.src = 'https://via.placeholder.com/250'} // Placeholder image on error
          sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
      </Link>

      {/* Content Section */}
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {author.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {author.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formattedDate} • {formattedTime}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Link to={`/post/${_id}`} style={{ textDecoration: "none" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
        </Link>

        {/* Summary */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
        >
          {summary}
        </Typography>
      </CardContent>
    </Card>
  );
}
