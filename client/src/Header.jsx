import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { AccountCircle, ExitToApp, PostAdd } from '@mui/icons-material';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const username = userInfo?.username;

  return (
    <AppBar
      position="sticky"
      elevation={0} // Removes shadow for a cleaner look
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Light gray line
        color: "black",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Narrative
            </Link>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {username ? (
              <>
                {/* Create Post Button */}
                <Link to="/create" style={{ textDecoration: "none", marginRight: -40 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#6A1B9A", // Custom color (purple)
                    borderRadius: "18px", // Rounded corners
                    padding: "5px 25px", // Adjust padding for size
                    fontSize: "12px", // Adjust font size
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#4A148C", // Hover color
                      transform: "scale(1.02)", // Slight zoom effect
                    },
                  }}
                  startIcon={<PostAdd />}
                >
                  CreatePost
                </Button>

                </Link >

                {/* Profile Avatar and Dropdown Menu */}
                <IconButton 
                  onClick={handleMenuOpen} 
                  sx={{
                    padding: 0, // Remove all padding
                    background: "none", // Remove any background
                    borderRadius: "50%", // Keep the button circular
                    "&:hover": {
                      background: "none", // Remove hover background
                    },
                  }}
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                >
                  <Avatar
                    sx={{
                      bgcolor: "#6A1B9A", // Background color
                      color: "white", // Text color
                      width: 35, // Width of the avatar
                      height: 35, // Height of the avatar
                      fontSize: "15px", // Font size for the initials
                      cursor: "pointer", // Pointer cursor for hover
                      transition: "0.3s", // Smooth transition effect
                      "&:hover": {
                        bgcolor: "#4A148C", // Darker purple on hover
                        transform: "scale(1.05)", // Slight zoom effect
                      },
                    }}
                  >
                    {userInfo.username.charAt(0).toUpperCase()}
                  </Avatar>

                </IconButton>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  disableRestoreFocus // Prevent lingering focus
                  sx={{
                    mt: 1,
                    "& .MuiPaper-root": {
                      backgroundColor: "#F5F5F5", // Dropdown background color
                      color: "black", // Text color
                      borderRadius: "10px", // Rounded corners
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    },
                    "& .MuiMenuItem-root": {
                      fontSize: "16px", // Font size for menu items
                      "&:hover": {
                        backgroundColor: "#E0E0E0", // Hover effect
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>


              </>
            ) : (
              <>
                {/* Login and Register Buttons */}
                <Link to="/login" style={{ textDecoration: "none", marginRight: 10 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      bgcolor: "#6A1B9A", // Background color
                      color: "white", // Text color
                      fontSize: "12px", // Font size for the text
                      borderRadius: "18px", // Rounded corners
                      padding: "5px 25px", // Adjust padding for size
                      transition: "0.3s", // Smooth transition effect
                      "&:hover": {
                        bgcolor: "#4A148C", // Darker purple on hover
                        transform: "scale(1.05)", // Slight zoom effect
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" style={{ textDecoration: "none", marginRight: -50 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      bgcolor: "6A1B9A",
                      color: "white",
                      borderRadius: "18px", // Rounded corners
                      padding: "5px 25px", // Adjust padding for size
                      fontSize: "12px", // Font size for the text
                      transition: "0.3s", // Smooth transition effect
                      "&:hover": {
                        backgroundColor: "#4A148C", // Darker red on hover (for secondary color)
                        transform: "scale(1.05)", // Slight zoom effect
                      },
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>



  );
}
