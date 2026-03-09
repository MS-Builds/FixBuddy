import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Chat() {
    const { socket } = useContext(SocketContext);
    const { captain } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get("/captain/requests");
                // Only show jobs that have an active conversation (ACCEPTED or ONGOING)
                const active = (res.data.data || []).filter(
                    (r) => r.status === "ACCEPTED" || r.status === "ONGOING" || r.status === "COMPLETED"
                );
                setConversations(active);
            } catch (err) {
                toast.error("Failed to load conversations");
            } finally {
                setLoadingChats(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", (msg) => {
            if (msg.senderId !== captain?.id) {
                setMessages((prev) => [...prev, msg]);
            }
        });
        return () => socket.off("receive_message");
    }, [socket, captain?.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openChat = async (conv) => {
        setActiveChat(conv);
        setMessages([]);
        try {
            const res = await api.get(`/chat/${conv.id}`);
            setMessages(res.data.data || []);
            if (socket) socket.emit("join_request_room", conv.id);
        } catch (err) {
            toast.error("Failed to load messages");
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat || !captain) return;
        const text = input.trim();
        setInput("");
        try {
            const res = await api.post("/chat/send", {
                serviceRequestId: activeChat.id,
                senderId: captain.id,
                receiverId: activeChat.userId,
                text,
            });
            const newMsg = res.data.data;
            setMessages((prev) => [...prev, newMsg]);
            if (socket) {
                socket.emit("send_message", {
                    serviceRequestId: activeChat.id,
                    text: newMsg.text,
                    senderId: captain.id,
                    receiverId: activeChat.userId,
                });
            }
        } catch (err) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-0 rounded-2xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* Conversations list */}
            <div className={`w-full md:w-72 shrink-0 border-r bg-card/50 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y">
                    {loadingChats ? (
                        <div className="p-4 space-y-3">
                            {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-sm">No active conversations</p>
                            <Link to="/requests" className="text-xs text-primary mt-2 hover:underline">View Requests →</Link>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => openChat(conv)}
                                className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${activeChat?.id === conv.id ? "bg-secondary" : ""}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                        {conv.user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{conv.user?.name || "User"}</div>
                                        <p className="text-xs text-muted-foreground truncate">{conv.title || conv.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat window */}
            {activeChat ? (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 border-b bg-card/50 flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setActiveChat(null)}>←</Button>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {activeChat.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm">{activeChat.user?.name || "Customer"}</h3>
                            <p className="text-xs text-muted-foreground truncate">{activeChat.title || activeChat.description}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                No messages yet. Start the conversation!
                            </div>
                        )}
                        {messages.map((msg) => {
                            const isMe = msg.senderId === captain?.id;
                            return (
                                <div key={msg.id || Math.random()} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                                        <p className="break-words">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t bg-card/50 flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 h-11 rounded-full"
                        />
                        <Button type="submit" size="icon" className="h-11 w-11 rounded-full shrink-0">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground flex-col gap-3">
                    <MessageSquare className="h-16 w-16 opacity-20" />
                    <p className="font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a chat from the sidebar to start messaging.</p>
                </div>
            )}
        </div>
    );
}
