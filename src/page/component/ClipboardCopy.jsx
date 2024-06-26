import { useState } from "react";
import { Button } from "react-bootstrap";

export default function ClipboardCopy({ copyText, size }) {
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(copyText)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Button variant="outline-success" onClick={handleCopyClick} size={size ? size : 'sm'}>
            {isCopied ? 'Copied!' : 'Copy'}
        </Button>
    );
}

//https://juejin.cn/post/7067112117974859790