import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { AccountCircle, ExitToApp, PostAdd } from '@mui/icons-material';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/logout`, {
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
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        color: "black",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Writeful
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
                      backgroundColor: "#6A1B9A",
                      borderRadius: "18px",
                      padding: "5px 25px",
                      fontSize: "12px",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#4A148C",
                        transform: "scale(1.02)",
                      },
                    }}
                    startIcon={<PostAdd />}
                  >
                    CreatePost
                  </Button>
                </Link>

                {/* Profile Avatar and Dropdown Menu */}
                <IconButton 
                  onClick={handleMenuOpen} 
                  sx={{
                    padding: 0, 
                    background: "none", 
                    borderRadius: "50%",
                    "&:hover": {
                      background: "none", 
                    },
                  }}
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                >
                  <Avatar
                    sx={{
                      bgcolor: "#6A1B9A",
                      color: "white",
                      width: 35,
                      height: 35,
                      fontSize: "15px",
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "#4A148C",
                        transform: "scale(1.05)",
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
                  disableRestoreFocus
                  sx={{
                    mt: 1,
                    "& .MuiPaper-root": {
                      backgroundColor: "#F5F5F5",
                      color: "black",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    },
                    "& .MuiMenuItem-root": {
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#E0E0E0",
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
                      bgcolor: "#6A1B9A",
                      color: "white",
                      fontSize: "12px",
                      borderRadius: "18px",
                      padding: "5px 25px",
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "#4A148C",
                        transform: "scale(1.05)",
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
                      borderRadius: "18px",
                      padding: "5px 25px",
                      fontSize: "12px",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#4A148C",
                        transform: "scale(1.05)",
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
