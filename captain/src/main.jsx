import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { BrowserRouter} from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider
				defaultTheme="light"
				storageKey="fixxr-captain-theme">
				<AuthProvider>
					<SocketProvider>
						<App />
						<Toaster position="top-right" richColors />
					</SocketProvider>
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>,
);
