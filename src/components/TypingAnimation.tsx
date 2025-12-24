"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "framer-motion";

interface TypingAnimationProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    showCursor?: boolean;
    onComplete?: () => void;
}

export default function TypingAnimation({ 
    text, 
    speed = 50, 
    delay = 0,
    className = "",
    showCursor = true,
    onComplete
}: TypingAnimationProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showBlink, setShowBlink] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        const timeout = setTimeout(() => {
            setIsTyping(true);
            let currentIndex = 0;

            const typeInterval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typeInterval);
                    setIsTyping(false);
                    setShowBlink(false);
                    if (onComplete) onComplete();
                }
            }, speed);

            return () => clearInterval(typeInterval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, speed, delay, isInView, onComplete]);

    return (
        <div ref={ref} className={className} style={{ display: "inline-block" }}>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {displayedText}
                {showCursor && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ marginLeft: "2px" }}
                    >
                        |
                    </motion.span>
                )}
            </motion.span>
        </div>
    );
}

