import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GOOGLE_ICON = (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

function AnimatedCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animId;
        let w, h;

        const nodes = [];
        const NODE_COUNT = 28;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 3 + 2,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        const codeSnippets = [
            { text: "def solve(n):", x: 0.12, y: 0.18, opacity: 0 },
            { text: "O(n log n)", x: 0.65, y: 0.28, opacity: 0 },
            { text: "return dp[n]", x: 0.2, y: 0.72, opacity: 0 },
            { text: "while lo <= hi:", x: 0.6, y: 0.65, opacity: 0 },
            { text: "✓ Tests Passed", x: 0.3, y: 0.42, opacity: 0 },
            { text: "hint: binary search", x: 0.55, y: 0.82, opacity: 0 },
        ];
        codeSnippets.forEach((s, i) => {
            s.targetOpacity = 0.55;
            s.delay = i * 600;
            s.born = Date.now() + s.delay;
        });

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            nodes.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                n.pulse += 0.02;
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(45,212,191,${0.18 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((n) => {
                const pulsedR = n.r + Math.sin(n.pulse) * 1.2;
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulsedR * 2);
                grad.addColorStop(0, "rgba(99,179,237,0.9)");
                grad.addColorStop(1, "rgba(45,212,191,0)");
                ctx.beginPath();
                ctx.arc(n.x, n.y, pulsedR * 2, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(n.x, n.y, pulsedR, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(147,210,255,0.85)";
                ctx.fill();
            });

            const now = Date.now();
            codeSnippets.forEach((s) => {
                if (now < s.born) return;
                const elapsed = now - s.born;
                s.opacity = Math.min(s.targetOpacity, elapsed / 1200) * (0.7 + 0.3 * Math.sin(t * 0.5 + s.born));
                ctx.font = "bold 11px 'Fira Code', monospace";
                ctx.fillStyle = `rgba(45,212,191,${s.opacity})`;
                ctx.fillText(s.text, s.x * w, s.y * h);
            });

            const cx = w / 2, cy = h / 2;
            const orbitR = Math.min(w, h) * 0.28;
            for (let ring = 0; ring < 2; ring++) {
                const r = orbitR * (0.6 + ring * 0.4);
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(45,212,191,${0.06 - ring * 0.02})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                const angle = t * (ring % 2 === 0 ? 0.4 : -0.25) + ring;
                const ox = cx + Math.cos(angle) * r;
                const oy = cy + Math.sin(angle) * r;
                ctx.beginPath();
                ctx.arc(ox, oy, 4, 0, Math.PI * 2);
                ctx.fillStyle = ring === 0 ? "rgba(99,179,237,0.8)" : "rgba(167,243,208,0.8)";
                ctx.fill();
            }

            const iconSize = Math.min(w, h) * 0.18;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(Math.sin(t * 0.3) * 0.08);
            const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, iconSize);
            glowGrad.addColorStop(0, "rgba(45,212,191,0.18)");
            glowGrad.addColorStop(1, "rgba(45,212,191,0)");
            ctx.beginPath();
            ctx.arc(0, 0, iconSize, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
            ctx.strokeStyle = "rgba(45,212,191,0.35)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.font = `bold ${iconSize * 0.55}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(147,210,255,0.95)";
            ctx.fillText("{}", 0, 0);
            ctx.restore();

            t += 0.012;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return <canvas ref={canvasRef} className="w-full h-full" />;
}

function InputField({ label, type = "text", placeholder, value, onChange, icon }) {
    const [show, setShow] = useState(false);
    const isPass = type === "password";
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{icon}</span>
                )}
                <input
                    type={isPass && show ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full bg-slate-800/60 border border-slate-700/60 rounded-lg py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 ${icon ? "pl-9" : "pl-3"}`}
                />
                {isPass && (
                    <button
                        type="button"
                        onClick={() => setShow((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-400 transition-colors text-xs"
                    >
                        {show ? "HIDE" : "SHOW"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function AuthPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [animating, setAnimating] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", username: "" });

    const switchMode = (next) => {
        if (next === mode || animating) return;
        setAnimating(true);
        setTimeout(() => {
            setMode(next);
            setForm({ name: "", email: "", password: "", confirm: "", username: "" });
            setAnimating(false);
        }, 280);
    };

    const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to Landing Page (Home) upon login/register
        navigate("/home");
    };

    const handleGoogle = () => navigate("/home");

    return (
        <div
            className="flex w-full overflow-hidden"
            style={{
                height: "100vh",
                minHeight: 0,
                background: "linear-gradient(135deg,#0d1117 0%,#0f1923 50%,#091620 100%)",
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            }}
        >
            {/* ─── Left: animated graphic ─── */}
            <div className="hidden md:flex md:w-1/2 flex-col relative overflow-hidden">
                <div className="absolute inset-0">
                    <AnimatedCanvas />
                </div>
                <div className="relative z-10 flex flex-col h-full px-10 py-8 justify-between">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: "linear-gradient(135deg,#14b8a6,#3b82f6)" }}
                        >
                            CM
                        </div>
                        <span className="text-white font-bold text-base tracking-tight">
                            Code<span style={{ color: "#2dd4bf" }}>Mentor</span> AI
                        </span>
                    </div>
                    <div className="flex flex-col gap-5 mb-16">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
                            style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.25)", color: "#2dd4bf" }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
                            Gemini AI Active
                        </div>
                        <h1 className="text-3xl font-bold text-white leading-tight">
                            Learn by{" "}
                            <span
                                style={{
                                    background: "linear-gradient(90deg,#2dd4bf,#60a5fa)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Iterating
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Your AI coding mentor — structured hints, auto-grading, and guidance without spoiling the journey.
                        </p>
                        <div className="flex flex-col gap-2.5 mt-1">
                            {[
                                { icon: "⚡", label: "Instant structured hints" },
                                { icon: "✓", label: "Auto-graded submissions" },
                                { icon: "🧠", label: "Adaptive learning paths" },
                            ].map((f) => (
                                <div key={f.label} className="flex items-center gap-2.5 text-sm text-slate-300">
                                    <span
                                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0"
                                        style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)" }}
                                    >
                                        {f.icon}
                                    </span>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Right: auth form ─── */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden"
                style={{ borderLeft: "1px solid rgba(45,212,191,0.08)" }}>
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 80% 20%,rgba(45,212,191,0.06) 0%,transparent 60%)" }}
                />

                <div className="relative z-10 w-full max-w-sm px-6 py-6 flex flex-col" style={{ minHeight: 0 }}>
                    {/* Header */}
                    <div className="mb-5">
                        <div className="flex md:hidden items-center gap-2 mb-4">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: "linear-gradient(135deg,#14b8a6,#3b82f6)" }}
                            >
                                CM
                            </div>
                            <span className="text-white font-bold text-sm">
                                Code<span style={{ color: "#2dd4bf" }}>Mentor</span> AI
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-0.5">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h2>
                        <p className="text-slate-400 text-xs">
                            {mode === "login"
                                ? "Sign in to continue your coding journey"
                                : "Join thousands of learners today"}
                        </p>
                    </div>

                    {/* Toggle tabs */}
                    <div
                        className="flex rounded-lg p-0.5 mb-5 gap-0.5"
                        style={{ background: "rgba(15,25,35,0.8)", border: "1px solid rgba(45,212,191,0.12)" }}
                    >
                        {["login", "register"].map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className="flex-1 py-2 rounded-md text-xs font-semibold transition-all duration-200 capitalize"
                                style={
                                    mode === m
                                        ? {
                                            background: "linear-gradient(135deg,rgba(45,212,191,0.2),rgba(59,130,246,0.15))",
                                            color: "#2dd4bf",
                                            border: "1px solid rgba(45,212,191,0.3)",
                                        }
                                        : { color: "#64748b", background: "transparent", border: "1px solid transparent" }
                                }
                            >
                                {m === "login" ? "Sign In" : "Register"}
                            </button>
                        ))}
                    </div>

                    {/* Google button */}
                    <button
                        onClick={handleGoogle}
                        className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg text-sm font-medium text-slate-200 transition-all duration-200 mb-4 hover:border-slate-500"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        {GOOGLE_ICON}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px" style={{ background: "rgba(45,212,191,0.12)" }} />
                        <span className="text-slate-600 text-xs">or</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(45,212,191,0.12)" }} />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3"
                        style={{
                            opacity: animating ? 0 : 1,
                            transform: animating ? "translateY(8px)" : "translateY(0)",
                            transition: "opacity 0.28s ease, transform 0.28s ease",
                        }}
                    >
                        {mode === "register" && (
                            <>
                                <InputField
                                    label="Full Name"
                                    placeholder="Jane Doe"
                                    value={form.name}
                                    onChange={set("name")}
                                    icon="👤"
                                />
                                <InputField
                                    label="Username"
                                    placeholder="janecodes"
                                    value={form.username}
                                    onChange={set("username")}
                                    icon="@"
                                />
                            </>
                        )}

                        <InputField
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={set("email")}
                            icon="✉"
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder={mode === "register" ? "Min. 8 characters" : "Enter password"}
                            value={form.password}
                            onChange={set("password")}
                            icon="🔒"
                        />

                        {mode === "register" && (
                            <InputField
                                label="Confirm Password"
                                type="password"
                                placeholder="Repeat password"
                                value={form.confirm}
                                onChange={set("confirm")}
                                icon="🔒"
                            />
                        )}

                        {mode === "login" && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs transition-colors" style={{ color: "#2dd4bf" }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-slate-900 transition-all duration-200 mt-1 hover:opacity-90 active:scale-95"
                            style={{
                                background: "linear-gradient(135deg,#2dd4bf,#3b82f6)",
                                boxShadow: "0 0 20px rgba(45,212,191,0.25)",
                            }}
                        >
                            {mode === "login" ? "Sign In →" : "Create Account →"}
                        </button>

                        {mode === "register" && (
                            <p className="text-center text-slate-500 text-xs mt-1">
                                By registering you agree to our{" "}
                                <span className="cursor-pointer" style={{ color: "#2dd4bf" }}>Terms</span> &amp;{" "}
                                <span className="cursor-pointer" style={{ color: "#2dd4bf" }}>Privacy Policy</span>
                            </p>
                        )}

                        <p className="text-center text-slate-500 text-xs mt-0.5">
                            {mode === "login" ? "New here? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                                className="font-semibold transition-colors"
                                style={{ color: "#2dd4bf" }}
                            >
                                {mode === "login" ? "Create account" : "Sign in"}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}