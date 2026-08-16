const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ApiError = require('./utils/ApiError');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const taskRoutes = require('./routes/taskRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const renderLandingPage = (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mood Study Planner - Authentication & Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090d16;
      --card-bg: rgba(15, 23, 42, 0.75);
      --card-border: rgba(255, 255, 255, 0.12);
      --input-bg: rgba(30, 41, 59, 0.8);
      --accent-purple: #8b5cf6;
      --accent-pink: #ec4899;
      --accent-blue: #3b82f6;
      --accent-teal: #14b8a6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --success: #10b981;
      --danger: #ef4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at 10% 10%, #1e1b4b 0%, #0f172a 50%, #070a12 100%);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    .container {
      width: 100%;
      max-width: 1100px;
    }

    /* Top Navigation / Header Bar */
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    }

    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #c084fc, #a855f7, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p.subtitle {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--success);
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--success);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid var(--card-border);
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--text-main);
    }

    .user-avatar {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .btn-logout {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: rgba(239, 68, 68, 0.25); color: #fff; }

    /* Quick Action Hero Bar */
    .quick-action-bar {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08));
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 1.25rem 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      backdrop-filter: blur(10px);
    }

    .quick-action-bar p {
      font-size: 0.9rem;
      color: #cbd5e1;
      margin-top: 0.2rem;
    }

    .btn-hero {
      background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6);
      color: #fff;
      font-weight: 700;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      border: none;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }

    .btn-hero:hover { transform: translateY(-2px); opacity: 0.95; box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6); }

    /* Main Layout Grid */
    .layout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 900px) {
      .layout-grid {
        grid-template-columns: 420px 1fr;
      }
    }

    /* Standalone & Tabbed Login/Register Card */
    .login-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 2rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent 70%);
      pointer-events: none;
    }

    .auth-tabs {
      display: flex;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 1.5rem;
    }

    .auth-tab {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.65rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .auth-tab.active {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      color: #fff;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .login-icon-badge {
      width: 52px;
      height: 52px;
      margin: 0 auto 0.75rem auto;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
      border: 1px solid rgba(139, 92, 246, 0.4);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
    }

    .login-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
    }

    .login-header p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.3rem;
    }

    .form-group {
      margin-bottom: 1.1rem;
    }

    label {
      display: block;
      font-size: 0.825rem;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 0.4rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      font-size: 1.05rem;
      color: var(--text-muted);
      pointer-events: none;
    }

    input, select {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      background: var(--input-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      color: #fff;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-no-icon {
      padding-left: 1rem;
    }

    input:focus, select:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
      width: auto;
    }
    .toggle-password:hover { color: #fff; opacity: 1; }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      font-size: 0.8rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
    }

    .remember-me input {
      width: 16px;
      height: 16px;
      accent-color: var(--accent-purple);
      cursor: pointer;
    }

    .forgot-link {
      color: var(--accent-purple);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
    }
    .forgot-link:hover { color: #c084fc; text-decoration: underline; }

    .btn-submit {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      color: #fff;
      border: none;
      padding: 0.85rem 1.2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      width: 100%;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    }

    .btn-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
      opacity: 0.95;
    }

    .btn-demo {
      background: rgba(255, 255, 255, 0.05);
      border: 1px dashed rgba(255, 255, 255, 0.2);
      color: #cbd5e1;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.825rem;
      cursor: pointer;
      width: 100%;
      margin-top: 0.75rem;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .btn-demo:hover { background: rgba(139, 92, 246, 0.15); border-color: var(--accent-purple); color: #fff; }

    .switch-tab-text {
      text-align: center;
      margin-top: 1.2rem;
      font-size: 0.825rem;
      color: var(--text-muted);
    }

    .switch-tab-link {
      color: var(--accent-purple);
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }
    .switch-tab-link:hover { text-decoration: underline; color: #c084fc; }

    /* Output Alert / Log Card */
    .output-card {
      margin-top: 1.25rem;
      background: rgba(10, 15, 26, 0.9);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1rem;
      font-size: 0.825rem;
      display: none;
    }

    .output-card.success {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.08);
    }
    .output-card.error {
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.08);
    }

    pre {
      overflow-x: auto;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.8rem;
      color: #34d399;
      max-height: 200px;
    }

    /* Dashboard Modules Column */
    .dashboard-modules {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .test-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem;
      backdrop-filter: blur(10px);
    }

    .test-box h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      margin-bottom: 0.9rem;
    }

    button {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      color: #fff;
      border: none;
      padding: 0.65rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid var(--accent-purple);
      color: #fff;
      padding: 0.8rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      font-size: 0.85rem;
      display: none;
      z-index: 1000;
      animation: fadeIn 0.3s forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-icon">🧠</div>
        <div>
          <h1>Mood Study Engine</h1>
          <p class="subtitle">API & Dashboard Portal (Port 5001)</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="badge">
          <span class="pulse-dot"></span>
          Backend API Live
        </div>
        <div class="user-pill" id="userPill">
          <div class="user-avatar" id="userAvatar">G</div>
          <span id="userPillText">Guest</span>
          <button class="btn-logout" id="btnLogout" style="display:none;" onclick="handleLogout()">Sign Out</button>
        </div>
      </div>
    </header>

    <div class="quick-action-bar">
      <div>
        <strong>⚡ Automated End-to-End Planner Test</strong>
        <p>Logs in demo user, logs 'Focused' mood, adds task, & generates study schedule in one click!</p>
      </div>
      <button class="btn-hero" id="btnAutoSetup">Run Auto-Setup & Generate Plan</button>
    </div>

    <div class="layout-grid">
      <!-- INTERACTIVE TABBED AUTH CARD (LOGIN & REGISTER) -->
      <div>
        <div class="login-card">
          <div class="auth-tabs">
            <button type="button" class="auth-tab active" id="tabLoginBtn" onclick="switchAuthTab('login')">🔑 Sign In</button>
            <button type="button" class="auth-tab" id="tabRegBtn" onclick="switchAuthTab('register')">📝 Create Account</button>
          </div>

          <!-- SIGN IN VIEW -->
          <div id="loginView">
            <div class="login-header">
              <div class="login-icon-badge">🔑</div>
              <h2>Welcome Back</h2>
              <p>Sign in to access your mood-based study planner.</p>
            </div>

            <form id="loginForm">
              <div class="form-group">
                <label for="loginEmail">Email Address</label>
                <div class="input-wrapper">
                  <span class="input-icon">✉️</span>
                  <input type="email" id="loginEmail" value="ansika@example.com" placeholder="name@example.com" required>
                </div>
              </div>

              <div class="form-group">
                <label for="loginPassword">Password</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input type="password" id="loginPassword" value="Password123!" placeholder="••••••••" required>
                  <button type="button" class="toggle-password" id="btnTogglePassword" title="Toggle password visibility">👁️</button>
                </div>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" id="rememberMe" checked>
                  <span>Remember me</span>
                </label>
                <a class="forgot-link" onclick="handleForgotPassword()">Forgot Password?</a>
              </div>

              <button type="submit" class="btn-submit">🚀 Sign In (POST /api/auth/login)</button>
              <button type="button" class="btn-demo" id="btnFillDemo">⚡ Fill Demo Credentials</button>

              <div class="switch-tab-text">
                Don't have an account? <span class="switch-tab-link" onclick="switchAuthTab('register')">Create an account</span>
              </div>
            </form>
          </div>

          <!-- REGISTER VIEW -->
          <div id="regView" style="display: none;">
            <div class="login-header">
              <div class="login-icon-badge" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(20, 184, 166, 0.2)); border-color: rgba(59, 130, 246, 0.4);">📝</div>
              <h2>Create Your Account</h2>
              <p>Register a new profile to personalize your study planner.</p>
            </div>

            <form id="regForm">
              <div class="form-group">
                <label for="regName">Full Name</label>
                <div class="input-wrapper">
                  <span class="input-icon">👤</span>
                  <input type="text" id="regName" value="Ansika" placeholder="Your Full Name" required>
                </div>
              </div>

              <div class="form-group">
                <label for="regEmail">Email Address</label>
                <div class="input-wrapper">
                  <span class="input-icon">✉️</span>
                  <input type="email" id="regEmail" value="ansika@example.com" placeholder="name@example.com" required>
                </div>
              </div>

              <div class="form-group">
                <label for="regPassword">Password</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input type="password" id="regPassword" value="Password123!" placeholder="At least 6 characters" required>
                  <button type="button" class="toggle-password" id="btnToggleRegPassword" title="Toggle password visibility">👁️</button>
                </div>
              </div>

              <div class="form-group">
                <label for="regGoal">Study Goal (Optional)</label>
                <div class="input-wrapper">
                  <span class="input-icon">🎯</span>
                  <input type="text" id="regGoal" value="Master Calculus & Pass Exams" placeholder="e.g. Master Calculus">
                </div>
              </div>

              <button type="submit" class="btn-submit" style="background: linear-gradient(135deg, #3b82f6, #14b8a6);">✨ Create Account (POST /api/auth/register)</button>

              <div class="switch-tab-text">
                Already have an account? <span class="switch-tab-link" onclick="switchAuthTab('login')">Sign in here</span>
              </div>
            </form>
          </div>

          <div id="loginOutputCard" class="output-card">
            <pre id="loginOutput"></pre>
          </div>
        </div>
      </div>

      <!-- DASHBOARD API MODULES -->
      <div class="dashboard-modules">
        <div class="section-title">
          <span>🛠️ Interactive Dashboard Modules</span>
        </div>

        <div class="test-grid">
          <!-- MOOD LOG BOX -->
          <div class="test-box">
            <h2>😊 1. Log Mood</h2>
            <form id="moodForm">
              <div class="form-group">
                <label>Current Mood</label>
                <select id="moodSelect" class="input-no-icon">
                  <option value="Focused">Focused</option>
                  <option value="Happy">Happy</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Tired">Tired</option>
                  <option value="Stressed">Stressed</option>
                  <option value="Sleepy">Sleepy</option>
                </select>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;" class="form-group">
                <div>
                  <label>Stress</label>
                  <input type="number" id="stressLevel" class="input-no-icon" min="1" max="10" value="3" required>
                </div>
                <div>
                  <label>Energy</label>
                  <input type="number" id="energyLevel" class="input-no-icon" min="1" max="10" value="8" required>
                </div>
                <div>
                  <label>Sleep (Hrs)</label>
                  <input type="number" id="sleepHours" class="input-no-icon" min="0" max="24" step="0.5" value="7.5" required>
                </div>
              </div>
              <button type="submit" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);">Submit Mood Log</button>
            </form>
            <pre id="moodOutput" style="display:none; margin-top:0.75rem;"></pre>
          </div>

          <!-- CREATE TASK BOX -->
          <div class="test-box">
            <h2>📚 2. Create Task</h2>
            <form id="taskForm">
              <div class="form-group">
                <label>Task Title</label>
                <input type="text" id="taskTitle" class="input-no-icon" value="Complete Calculus Ch. 4" required>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;" class="form-group">
                <div>
                  <label>Subject</label>
                  <input type="text" id="taskSubject" class="input-no-icon" value="Mathematics" required>
                </div>
                <div>
                  <label>Est. Time (Mins)</label>
                  <input type="number" id="taskEstTime" class="input-no-icon" value="60" min="1" required>
                </div>
              </div>
              <button type="submit" style="background: linear-gradient(135deg, #6366f1, #3b82f6);">Submit New Task</button>
            </form>
            <pre id="taskOutput" style="display:none; margin-top:0.75rem;"></pre>
          </div>

          <!-- STUDY PLANNER BOX -->
          <div class="test-box">
            <h2>📅 3. Study Planner</h2>
            <div class="form-group">
              <label>Available Hours Today</label>
              <input type="number" id="planHours" class="input-no-icon" value="4" min="1" max="12">
            </div>
            <button id="btnGeneratePlan" style="background: linear-gradient(135deg, #14b8a6, #3b82f6); font-weight:700;">🚀 Generate Plan</button>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <button type="button" id="btnGetPlan" style="background: rgba(255,255,255,0.1); font-size: 0.8rem;">GET Today's Plan</button>
              <button type="button" id="btnRegenPlan" style="background: rgba(239,68,68,0.2); color: #f87171; font-size: 0.8rem;">Reset Plan</button>
            </div>
            <pre id="plannerOutput" style="display:none; margin-top:0.75rem;"></pre>
          </div>

          <!-- SESSION BOX -->
          <div class="test-box">
            <h2>⏱️ 4. Study Session</h2>
            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="sessionTaskId" style="margin-bottom:0.3rem;">Task ID</label>
                <button type="button" id="btnFetchTasks" style="background: none; border: none; color: var(--accent-purple); font-size: 0.75rem; text-decoration: underline; cursor: pointer; width: auto; padding: 0;">⚡ Get Latest Task ID</button>
              </div>
              <input type="text" id="sessionTaskId" class="input-no-icon" placeholder="Enter or paste Task ID here">
            </div>
            <button id="btnStartSession" style="background: linear-gradient(135deg, #10b981, #14b8a6);">▶️ Start Session</button>
            <button id="btnEndSession" style="background: linear-gradient(135deg, #ef4444, #f97316); margin-top: 0.5rem; display: none;">⏹️ End Current Session</button>
            <button id="btnSessionHistory" style="background: rgba(255,255,255,0.1); margin-top: 0.5rem; font-size: 0.8rem;">📜 View History</button>
            <pre id="sessionOutput" style="display:none; margin-top:0.75rem;"></pre>
          </div>

          <!-- ANALYTICS BOX -->
          <div class="test-box" style="grid-column: 1 / -1;">
            <h2>📊 5. Analytics</h2>
            <button id="btnGetAnalytics" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">Dashboard Analytics (GET /api/analytics/dashboard)</button>
            <pre id="analyticsOutput" style="display:none; margin-top:0.75rem;"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="toast">Notification Message</div>

  <script>
    let authToken = localStorage.getItem('token') || '';
    let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    const showToast = (msg) => {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    };

    const updateHeaderUser = () => {
      const pillText = document.getElementById('userPillText');
      const avatar = document.getElementById('userAvatar');
      const logoutBtn = document.getElementById('btnLogout');

      if (currentUser && currentUser.name) {
        pillText.innerText = currentUser.name;
        avatar.innerText = currentUser.name.charAt(0).toUpperCase();
        logoutBtn.style.display = 'inline-block';
      } else {
        pillText.innerText = 'Guest';
        avatar.innerText = 'G';
        logoutBtn.style.display = 'none';
      }
    };

    const switchAuthTab = (tab) => {
      const loginView = document.getElementById('loginView');
      const regView = document.getElementById('regView');
      const tabLoginBtn = document.getElementById('tabLoginBtn');
      const tabRegBtn = document.getElementById('tabRegBtn');

      if (tab === 'login') {
        loginView.style.display = 'block';
        regView.style.display = 'none';
        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');
      } else {
        loginView.style.display = 'none';
        regView.style.display = 'block';
        tabLoginBtn.classList.remove('active');
        tabRegBtn.classList.add('active');
      }
    };

    const getHeaders = () => {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
      }
      return headers;
    };

    const showOutput = (elementId, data, isError = false) => {
      const el = document.getElementById(elementId);
      if (!el) return;
      
      const parentCard = el.closest('.output-card');
      if (parentCard) {
        parentCard.style.display = 'block';
        parentCard.className = 'output-card ' + (isError ? 'error' : 'success');
      } else {
        el.style.display = 'block';
      }
      
      el.innerText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    };

    const saveToken = (token, user = null) => {
      if (token) {
        authToken = token;
        localStorage.setItem('token', token);
      }
      if (user) {
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
      updateHeaderUser();
    };

    const handleLogout = () => {
      authToken = '';
      currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      updateHeaderUser();
      showToast('Signed out successfully.');
      const card = document.getElementById('loginOutputCard');
      if (card) card.style.display = 'none';
    };

    const handleForgotPassword = () => {
      showToast('Password reset link sent to your email!');
    };

    // Toggle Login Password Visibility
    document.getElementById('btnTogglePassword').addEventListener('click', function() {
      const passInput = document.getElementById('loginPassword');
      if (passInput.type === 'password') {
        passInput.type = 'text';
        this.innerText = '🙈';
      } else {
        passInput.type = 'password';
        this.innerText = '👁️';
      }
    });

    // Toggle Reg Password Visibility
    document.getElementById('btnToggleRegPassword').addEventListener('click', function() {
      const passInput = document.getElementById('regPassword');
      if (passInput.type === 'password') {
        passInput.type = 'text';
        this.innerText = '🙈';
      } else {
        passInput.type = 'password';
        this.innerText = '👁️';
      }
    });

    // Fill Demo Credentials
    document.getElementById('btnFillDemo').addEventListener('click', () => {
      document.getElementById('loginEmail').value = 'ansika@example.com';
      document.getElementById('loginPassword').value = 'Password123!';
      showToast('Demo credentials filled!');
    });

    // LOGIN FORM SUBMISSION
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      showOutput('loginOutput', 'Authenticating credentials...');
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
          })
        });
        const data = await res.json();
        if (data.success && data.data && data.data.token) {
          saveToken(data.data.token, data.data.user);
          showToast('Welcome back, ' + (data.data.user?.name || 'User') + '!');
          showOutput('loginOutput', data, false);
        } else {
          showOutput('loginOutput', data, true);
        }
      } catch (err) {
        showOutput('loginOutput', 'Error: ' + err.message, true);
      }
    });

    // REGISTRATION FORM SUBMISSION
    document.getElementById('regForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      showOutput('loginOutput', 'Registering new account...');
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            studyGoal: document.getElementById('regGoal').value
          })
        });
        const data = await res.json();
        if (data.success && data.data && data.data.token) {
          saveToken(data.data.token, data.data.user);
          showToast('Account created! Welcome, ' + (data.data.user?.name || 'User') + '!');
          showOutput('loginOutput', data, false);
        } else {
          showOutput('loginOutput', data, true);
        }
      } catch (err) {
        showOutput('loginOutput', 'Error: ' + err.message, true);
      }
    });

    // LOG MOOD
    document.getElementById('moodForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      showOutput('moodOutput', 'Sending POST /api/moods...');
      try {
        const res = await fetch('/api/moods', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            mood: document.getElementById('moodSelect').value,
            stressLevel: parseInt(document.getElementById('stressLevel').value, 10),
            energyLevel: parseInt(document.getElementById('energyLevel').value, 10),
            sleepHours: parseFloat(document.getElementById('sleepHours').value)
          })
        });
        const data = await res.json();
        showOutput('moodOutput', data);
      } catch (err) {
        showOutput('moodOutput', 'Error: ' + err.message);
      }
    });

    // TASK
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      showOutput('taskOutput', 'Sending POST /api/tasks...');
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            title: document.getElementById('taskTitle').value,
            subject: document.getElementById('taskSubject').value,
            estimatedTime: parseInt(document.getElementById('taskEstTime').value, 10),
            priority: 'High',
            difficulty: 'Medium',
            deadline: new Date(Date.now() + 86400000 * 3).toISOString()
          })
        });
        const data = await res.json();
        if (data.data && data.data._id) {
          document.getElementById('sessionTaskId').value = data.data._id;
        }
        showOutput('taskOutput', data);
      } catch (err) {
        showOutput('taskOutput', 'Error: ' + err.message);
      }
    });

    // GENERATE PLAN
    document.getElementById('btnGeneratePlan').addEventListener('click', async () => {
      showOutput('plannerOutput', 'Sending POST /api/planner/generate...');
      try {
        const res = await fetch('/api/planner/generate', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ availableStudyHours: parseInt(document.getElementById('planHours').value, 10) })
        });
        const data = await res.json();
        showOutput('plannerOutput', data);
      } catch (err) {
        showOutput('plannerOutput', 'Error: ' + err.message);
      }
    });

    document.getElementById('btnGetPlan').addEventListener('click', async () => {
      showOutput('plannerOutput', 'Fetching GET /api/planner/today...');
      try {
        const res = await fetch('/api/planner/today', { headers: getHeaders(), credentials: 'include' });
        const data = await res.json();
        showOutput('plannerOutput', data);
      } catch (err) {
        showOutput('plannerOutput', 'Error: ' + err.message);
      }
    });

    document.getElementById('btnRegenPlan').addEventListener('click', async () => {
      showOutput('plannerOutput', 'Sending DELETE /api/planner/regenerate...');
      try {
        const res = await fetch('/api/planner/regenerate', { method: 'DELETE', headers: getHeaders(), credentials: 'include' });
        const data = await res.json();
        showOutput('plannerOutput', data);
      } catch (err) {
        showOutput('plannerOutput', 'Error: ' + err.message);
      }
    });

    // AUTO-SETUP HERO BUTTON
    document.getElementById('btnAutoSetup').addEventListener('click', async () => {
      showOutput('plannerOutput', '⏳ Running Auto Setup (Authenticating demo user, logging mood, creating task & generating plan)...');
      try {
        // 1. Authenticate user
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: 'ansika@example.com', password: 'Password123!' })
        });
        let authData = await loginRes.json();
        if (!authData.success) {
          const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: 'Ansika', email: 'ansika@example.com', password: 'Password123!' })
          });
          authData = await regRes.json();
        }
        if (authData.data && authData.data.token) saveToken(authData.data.token, authData.data.user);

        // 2. Log Mood
        await fetch('/api/moods', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ mood: 'Focused', stressLevel: 3, energyLevel: 9, sleepHours: 8 })
        });

        // 3. Create Task
        await fetch('/api/tasks', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            title: 'Complete Calculus Chapter 4 Exercises',
            subject: 'Mathematics',
            estimatedTime: 90,
            priority: 'High',
            difficulty: 'Hard',
            deadline: new Date(Date.now() + 86400000 * 2).toISOString()
          })
        });

        // 4. Generate Plan
        const planRes = await fetch('/api/planner/generate', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ availableStudyHours: 4 })
        });
        const planData = await planRes.json();
        showOutput('plannerOutput', planData);
      } catch (err) {
        showOutput('plannerOutput', 'Auto Setup Error: ' + err.message);
      }
    });

    // SESSIONS & ANALYTICS
    let activeSessionId = null;

    // Auto-fetch user's latest task ID
    document.getElementById('btnFetchTasks').addEventListener('click', async () => {
      if (!authToken) {
        showToast('⚠️ Please sign in first!');
        return;
      }
      showOutput('sessionOutput', 'Fetching user tasks...');
      try {
        const res = await fetch('/api/tasks', { headers: getHeaders(), credentials: 'include' });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const latestTask = data.data[0];
          document.getElementById('sessionTaskId').value = latestTask._id;
          showToast('⚡ Task ID auto-filled: ' + latestTask.title);
        } else {
          showToast('No tasks found. Create a task first in Section 2!');
        }
        showOutput('sessionOutput', data);
      } catch (err) {
        showOutput('sessionOutput', 'Error: ' + err.message, true);
      }
    });

    // Start Session with entered Task ID
    document.getElementById('btnStartSession').addEventListener('click', async () => {
      const taskId = document.getElementById('sessionTaskId').value.trim();
      if (!taskId) {
        showToast('⚠️ Please enter a Task ID!');
        showOutput('sessionOutput', { success: false, message: 'Task ID field is empty. Please enter or paste a valid 24-char Task ID.' }, true);
        return;
      }
      if (!authToken) {
        showToast('⚠️ Please sign in first!');
        showOutput('sessionOutput', { success: false, message: 'Authentication required. Please sign in first.' }, true);
        return;
      }

      showOutput('sessionOutput', 'Sending POST /api/session/start with Task ID: ' + taskId + '...');
      try {
        const res = await fetch('/api/session/start', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ taskId })
        });
        const data = await res.json();
        if (data.success && data.data && data.data._id) {
          activeSessionId = data.data._id;
          document.getElementById('btnEndSession').style.display = 'block';
          showToast('🚀 Study session started!');
          showOutput('sessionOutput', data, false);
        } else {
          showOutput('sessionOutput', data, true);
        }
      } catch (err) {
        showOutput('sessionOutput', 'Error: ' + err.message, true);
      }
    });

    // End Session
    document.getElementById('btnEndSession').addEventListener('click', async () => {
      if (!activeSessionId) {
        showToast('No active session to end.');
        return;
      }
      showOutput('sessionOutput', 'Sending POST /api/session/end...');
      try {
        const res = await fetch('/api/session/end', {
          method: 'POST',
          headers: getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ sessionId: activeSessionId, focusScore: 9, completed: true })
        });
        const data = await res.json();
        if (data.success) {
          showToast('✅ Study session completed!');
          document.getElementById('btnEndSession').style.display = 'none';
          activeSessionId = null;
        }
        showOutput('sessionOutput', data, !data.success);
      } catch (err) {
        showOutput('sessionOutput', 'Error: ' + err.message, true);
      }
    });

    document.getElementById('btnSessionHistory').addEventListener('click', async () => {
      showOutput('sessionOutput', 'Fetching GET /api/session/history...');
      try {
        const res = await fetch('/api/session/history', { headers: getHeaders(), credentials: 'include' });
        const data = await res.json();
        showOutput('sessionOutput', data);
      } catch (err) {
        showOutput('sessionOutput', 'Error: ' + err.message, true);
      }
    });

    document.getElementById('btnGetAnalytics').addEventListener('click', async () => {
      showOutput('analyticsOutput', 'Fetching GET /api/analytics/dashboard...');
      try {
        const res = await fetch('/api/analytics/dashboard', { headers: getHeaders(), credentials: 'include' });
        const data = await res.json();
        showOutput('analyticsOutput', data);
      } catch (err) {
        showOutput('analyticsOutput', 'Error: ' + err.message);
      }
    });

    // Initialize user status on load
    updateHeaderUser();
  </script>
</body>
</html>`);
  }

  res.status(200).json({
    success: true,
    message: 'Mood Study Planner API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      moods: '/api/moods',
      tasks: '/api/tasks',
      planner: '/api/planner',
      session: '/api/session',
      analytics: '/api/analytics',
      notifications: '/api/notifications',
    },
  });
};

app.get('/', renderLandingPage);
app.get('/api/health', renderLandingPage);

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorMiddleware);

module.exports = app;
