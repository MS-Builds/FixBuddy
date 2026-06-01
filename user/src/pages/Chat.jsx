import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
export default function Chat() {
    const { socket } = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);
    const bottomRef = useRef(null);

    // Fetch conversations (accepted/ongoing service requests)
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get("/user/service-requests");
                const requests = res.data.data || [];
                // Only show chats for requests that have a captain
                const active = requests.filter(req => req.captain && req.status !== 'PENDING');
                setConversations(active);
            } catch (err) {
                console.error("Failed to load conversations", err);
            } finally {
                setLoadingChats(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", (msg) => {
            // Only add if it's not our own message (we optimistically added it)
            if (msg.senderId !== user?.id) {
                setMessages((prev) => [...prev, msg]);
            }
        });
        return () => socket.off("receive_message");
    }, [socket, user?.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openChat = async (conv) => {
        setActiveChat(conv);
        setMessages([]); // Clear previous
        try {
            const res = await api.get(`/chat/${conv.id}`);
            setMessages(res.data.data || []);
            if (socket) {
                socket.emit("join_request_room", conv.id);
            }
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const text = input.trim();
        setInput(""); // Optimistic clear

        try {
            const res = await api.post("/chat/send", {
                serviceRequestId: activeChat.id,
                receiverId: activeChat.captain.id,
                text
            });
            const newMsg = res.data.data;
            // The message arrives via socket for receiver, but we append locally for sender
            setMessages((prev) => [...prev, newMsg]);

            if (socket) {
                socket.emit("send_message", {
                    serviceRequestId: activeChat.id,
                    text: newMsg.text,
                    senderId: user?.id,
                    receiverId: activeChat.captain.id
                });
            }
        } catch (err) {
            console.error("Failed to send message", err);
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
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading chats...</div>
                    ) : conversations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No active conversations</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => openChat(conv)}
                                className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${activeChat?.id === conv.id ? "bg-secondary" : ""}`}
                            >
                                <div className="flex items-center gap-3">
                                    {conv.captain.profileImage ? (
                                        <img src={conv.captain.profileImage} alt={conv.captain.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                            {conv.captain.name[0]?.toUpperCase() || "C"}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm truncate">{conv.title}</span>
                                            <span className="text-xs text-muted-foreground shrink-0">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">With {conv.captain.name}</p>
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
                    {/* Header */}
                    <div className="p-4 border-b bg-card/50 flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setActiveChat(null)}>←</Button>
                        {activeChat.captain.profileImage ? (
                            <img src={activeChat.captain.profileImage} alt={activeChat.captain.name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {activeChat.captain.name[0]?.toUpperCase() || "C"}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm">{activeChat.captain.name}</h3>
                            <p className="text-xs text-green-500 truncate">{activeChat.title}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-secondary text-foreground rounded-bl-sm"
                                        }`}>
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

                    {/* Input */}
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
            )
            }
        </div >
    );
}
