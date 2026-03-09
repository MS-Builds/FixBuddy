import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, captain, isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      if (captain && captain._id) {
        newSocket.emit("join", { userId: captain._id, role: "captain" });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => newSocket.close();
  }, [isAuthenticated, token, captain]);

  // Location sharing
  useEffect(() => {
    if (!socket || !captain || !captain._id) return;
    
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("updateLocation", {
              captainId: captain._id,
              location: { lat: latitude, lng: longitude }
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    }, 5000); 

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
