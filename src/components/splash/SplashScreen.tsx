"use client";

import { useEffect, useState } from "react";
import "./splash.css";
import { useSplashController } from "./useSplashController";

// Pure Spring Boot API code
const codeLines = [
  "@RestController",
  "public class UserController {",
  "  @Autowired",
  "  private UserService userService;",
  "",
  "  @GetMapping(\"/users\")",
  "  public List<User> getAllUsers() {",
  "      return userService.getAllUsers();",
  "  }",
  "}",
];

// Simple syntax color mapping (semantic CSS classes)
const colorMap: Record<string, string> = {
  "@RestController": "syntax-annotation",
  "@Autowired": "syntax-annotation",
  "@GetMapping(\"/users\")": "syntax-annotation",
  "public": "syntax-keyword",
  "class": "syntax-keyword",
  "private": "syntax-keyword",
  "List": "syntax-type",
  "UserController": "syntax-type",
  "UserService": "syntax-type",
  "getAllUsers": "syntax-function",
  "return": "syntax-keyword",
};

export default function SplashScreen() {
  const { isVisible, isExiting } = useSplashController();
  const [typed, setTyped] = useState("");

  // Parallax illustration
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = document.querySelector(".splash-illustration-img") as HTMLElement;
      if (!el) return;
      const x = (window.innerWidth / 2 - e.clientX) * 0.02;
      const y = (window.innerHeight / 2 - e.clientY) * 0.02;
      el.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Typing effect (character by character, all lines as one string)
  useEffect(() => {
    const fullCode = codeLines.join("\n");
    let i = 0;
    let timeoutId: NodeJS.Timeout;
    function typeChar() {
      if (i <= fullCode.length) {
        setTyped(fullCode.slice(0, i));
        i++;
        timeoutId = setTimeout(typeChar, 5); // Faster typing
      }
    }
    typeChar();
    return () => clearTimeout(timeoutId);
  }, []);

  // Highlight keywords as they appear
  const highlightCode = (code: string) => {
    // Split by lines, then by tokens
    return code.split("\n").map((line, lineIdx) => (
      <pre key={lineIdx} className="leading-snug">
        {line.split(/(\s+|[\(\){};".])/).map((word, idx) => {
          const colorClass = colorMap[word] || "";
          return (
            <span key={idx} className={colorClass}>
              {word}
            </span>
          );
        })}
      </pre>
    ));
  };

  if (!isVisible) return null;

  return (
    <div
      id="splash-root"
      className={`splash-container splash-flex ${
        isExiting ? "splash-ready" : ""
      }`}
    >
      {/* Left: Illustration centered left, name below */}
      <div className="splash-illustration-col">
        <img
          src="/intro-splash.png"
          alt="Illustration"
          width={400}
          height={400}
          className="splash-illustration-img animate-float"
        />
        <p className="splash-name signature-font" style={{ fontSize: '6rem' }}>Aryan Raj</p>
      </div>
      {/* Right: Code block */}
      <div className="splash-code-col">{highlightCode(typed)}</div>
    </div>
  );
}
