"use client";

import { MyAssistant } from "@/components/MyAssistant";
import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContactForm from "@/components/ContactForm";
import LoginModal from "@/components/AuthCheck";

const isAssistantEnabled = process.env.NEXT_PUBLIC_ASSISTANT_ENABLED === "true";

export default function Home() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [data,setData]=useState({})
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/tokenCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsAuthenticated(true);
            setData(data.data);
          } else {
            console.error(data.message);
            setOpenLoginModal(true);
          }
        })
        .catch((err) => {
          console.error("Error checking token:", err);
          setOpenLoginModal(true);
        });
    } else {
      setOpenLoginModal(true);
    }
  }, [open]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setOpenLoginModal(false);
    setWelcomeOpen(true);
    setTimeout(() => {
      setWelcomeOpen(false); 
    }, 2000);

  };

  return (
    <main className="h-dvh">
      {isAuthenticated && (
        <Snackbar
          open={welcomeOpen}
          autoHideDuration={6000}
          onClose={() => setWelcomeOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setWelcomeOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
          Welcome back! You are now logged in.
          </Alert>
        </Snackbar>
      )}
      {isAssistantEnabled ? (
        <MyAssistant />
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            The assistant is currently disabled.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We apologize for the inconvenience. Please check back later or contact support for assistance.
          </Typography>
        </Box>
      )}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} ChatBot. All rights reserved.</p>
          <ul className="footer-links">
            <li>
              <Button onClick={handleOpen} color="#e0e0e0">
                Contact Us
              </Button>
            </li>
          </ul>
        </div>
      </footer>
      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ContactForm open={open} handleClose={handleClose} data={data} />
    </main>
  );
}
