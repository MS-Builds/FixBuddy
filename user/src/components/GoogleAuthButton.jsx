import { useEffect, useRef } from "react";

export function GoogleAuthButton({ text = "continue_with", onCredential, theme = "outline" }) {
    const containerRef = useRef(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!clientId || !containerRef.current) {
            return;
        }

        const renderGoogleButton = () => {
            if (!window.google?.accounts?.id || !containerRef.current) {
                return false;
            }

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => {
                    if (response?.credential) {
                        onCredential(response.credential);
                    }
                },
            });

            containerRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(containerRef.current, {
                theme,
                size: "large",
                text,
                width: 360,
                shape: "pill",
            });
            return true;
        };

        if (renderGoogleButton()) {
            return;
        }

        const intervalId = window.setInterval(() => {
            if (renderGoogleButton()) {
                window.clearInterval(intervalId);
            }
        }, 300);

        return () => window.clearInterval(intervalId);
    }, [clientId, onCredential, text, theme]);

    if (!clientId) {
        return null;
    }

    return <div ref={containerRef} className="flex justify-center" />;
}
