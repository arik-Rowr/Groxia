"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaAward,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const params = useParams();
  const urlId = params?.id;

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a valid certificate ID");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API}/upload/verify/${certificateId.trim()}/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Certificate not found");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      const formattedId = String(urlId).toUpperCase();
      setCertificateId(formattedId);
      const autoVerify = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
          const res = await fetch(`${API}/upload/verify/${formattedId}/`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Certificate not found");
          setResult(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      autoVerify();
    }
  }, [urlId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .vp-root {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── NAV ── */
        .vp-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f0f0f0;
        }

        .vp-nav__inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vp-nav__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .vp-nav__logo-img {
          border-radius: 10px;
        }

        .vp-nav__logo-text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: 2px;
          color: #0a0a0a;
        }

        .vp-nav__badge {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.6px;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          padding: 6px 14px;
        }

        /* ── HERO ── */
        .vp-hero {
          border-bottom: 1px solid #f3f4f6;
          padding: 72px 28px 64px;
          text-align: center;
          background: #ffffff;
        }

        .vp-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .vp-hero__eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          box-shadow: 0 0 0 3px #d1fae5;
        }

        .vp-hero__title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(40px, 6vw, 68px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -1px;
          color: #0a0a0a;
          margin-bottom: 10px;
        }

        .vp-hero__title em {
          font-style: italic;
          color: #2563eb;
        }

        .vp-hero__subtitle {
          font-size: 16px;
          color: #6b7280;
          font-weight: 300;
          max-width: 480px;
          margin: 16px auto 0;
          line-height: 1.7;
        }

        /* ── MAIN CONTENT ── */
        .vp-content {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        /* ── SEARCH BOX ── */
        .vp-search-card {
          background: #f8faff;
          border: 1px solid #e5edff;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
        }

        .vp-search-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 14px;
        }

        .vp-search-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .vp-search-input {
          flex: 1;
          min-width: 200px;
          border: 1.5px solid #d1d5db;
          background: #ffffff;
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .vp-search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .vp-search-input:disabled {
          background: #f9fafb;
          color: #9ca3af;
        }

        .vp-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1d4ed8;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 28px;
          border: none;
          border-radius: 1px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .vp-search-btn:hover:not(:disabled) {
          background: #1e40af;
          transform: translateY(-1px);
        }

        .vp-search-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .vp-search-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        /* ── LOADER ── */
        .vp-loader {
          text-align: center;
          padding: 48px 0;
        }

        .vp-loader__spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .vp-loader__text {
          font-size: 14px;
          color: #6b7280;
          font-weight: 300;
        }

        /* ── ERROR ── */
        .vp-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
        }

        .vp-error__icon {
          color: #ef4444;
          margin-bottom: 12px;
        }

        .vp-error__title {
          font-size: 18px;
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 6px;
        }

        .vp-error__msg {
          font-size: 14px;
          color: #ef4444;
          font-weight: 300;
        }

        /* ── SUCCESS ── */
        .vp-result {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(16, 185, 129, 0.08);
        }

        .vp-result__header {
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          padding: 32px;
          text-align: center;
          border-bottom: 1px solid #d1fae5;
        }

        .vp-result__check-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 12px rgba(16, 185, 129, 0.2);
          margin-bottom: 16px;
        }

        .vp-result__title {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          font-weight: 400;
          color: #065f46;
          margin-bottom: 4px;
        }

        .vp-result__subtitle {
          font-size: 13px;
          color: #059669;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .vp-result__body {
          padding: 32px;
        }

        .vp-result__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .vp-result__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vp-result__field--full {
          grid-column: 1 / -1;
          padding-top: 20px;
          border-top: 1px solid #ecfdf5;
        }

        .vp-result__field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .vp-result__field-value {
          font-size: 15px;
          font-weight: 500;
          color: #111827;
          word-break: break-all;
        }

        .vp-result__field-value--mono {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #1d4ed8;
        }

        .vp-result__footer {
          padding: 18px 32px;
          background: #f9fafb;
          border-top: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12.5px;
          color: #6b7280;
          font-weight: 400;
        }

        .vp-result__footer svg {
          color: #10b981;
        }

        /* ── TRUST BAR ── */
        .vp-trust {
          margin-top: 56px;
          padding-top: 32px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 32px;
        }

        .vp-trust__item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          color: #1c1e21;
          font-weight: 400;
        }

        .vp-trust__item svg {
          color: #f59e0b;
        }

        .vp-trust__sep {
          color: #e5e7eb;
          font-size: 12px;
          display: none;
        }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
          .vp-nav__badge {
            display: none;
          }

          .vp-hero {
            padding: 48px 20px 40px;
          }

          .vp-search-card {
            padding: 24px 20px;
          }

          .vp-search-row {
            flex-direction: column;
          }

          .vp-search-btn {
            width: 100%;
            padding: 16px;
          }

          .vp-result__grid {
            grid-template-columns: 1fr;
          }

          .vp-result__field--full {
            grid-column: 1;
          }

          .vp-result__header,
          .vp-result__body {
            padding: 24px 20px;
          }

          .vp-result__footer {
            padding: 16px 20px;
          }

          .vp-content {
            padding: 40px 16px 64px;
          }
        }
      `}</style>

      <div className="vp-root">
        {/* NAV */}
        <nav className="vp-nav">
          <div className="vp-nav__inner">
            <Link href="/" className="vp-nav__logo">
              <Image
                src="/logo.png"
                alt="Gocyn"
                width={36}
                height={36}
                className="vp-nav__logo-img"
              />
              <span className="vp-nav__logo-text">GOCYN</span>
            </Link>

            <div className="vp-nav__badge">
              <FaShieldAlt size={17} />
              Official Certificate Verification
            </div>
          </div>
        </nav>

        {/* HERO */}
        <div className="vp-hero">
          <div className="vp-hero__eyebrow">
            <span className="vp-hero__eyebrow-dot" />
            Secure Portal
          </div>
          <h1 className="vp-hero__title">
            Official Certificate<br />
            <em>Verification</em>
          </h1>
          <p className="vp-hero__subtitle">
            Instantly validate the authenticity of any Gocyn certificate issued
            to talented professionals worldwide.
          </p>
        </div>

        {/* MAIN */}
        <div className="vp-content">

          {/* SEARCH CARD */}
          <div className="vp-search-card">
            <label className="vp-search-label">Enter Certificate ID</label>
            <div className="vp-search-row">
              <input
                type="text"
                placeholder="e.g. CERT-7E13B5"
                value={certificateId}
                onChange={(e) => {
                  setCertificateId(e.target.value.toUpperCase().trim());
                  setError("");
                }}
                className="vp-search-input"
                disabled={loading}
              />
              <button
                onClick={handleVerify}
                disabled={loading || !certificateId.trim()}
                className="vp-search-btn"
              >
                <FaSearch size={13} />
                {loading ? "Verifying…" : "Verify Now"}
              </button>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="vp-loader">
              <div className="vp-loader__spinner" />
              <p className="vp-loader__text">Verifying certificate authenticity…</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="vp-error"
            >
              <FaTimesCircle className="vp-error__icon" size={36} />
              <p className="vp-error__title">Verification Failed</p>
              <p className="vp-error__msg">{error}</p>
            </motion.div>
          )}

          {/* SUCCESS */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="vp-result"
            >
              <div className="vp-result__header">
                <div className="vp-result__check-wrap">
                  <FaCheckCircle color="#10b981" size={30} />
                </div>
                <h3 className="vp-result__title">Certificate Verified</h3>
                <p className="vp-result__subtitle">This certificate is authentic and valid</p>
              </div>

              <div className="vp-result__body">
                <div className="vp-result__grid">
                  <div className="vp-result__field">
                    <span className="vp-result__field-label">Student Name</span>
                    <span className="vp-result__field-value">{result.user_name}</span>
                  </div>
                  <div className="vp-result__field">
                    <span className="vp-result__field-label">Email</span>
                    <span className="vp-result__field-value">{result.user_email}</span>
                  </div>
                  <div className="vp-result__field">
                    <span className="vp-result__field-label">Internship / Program</span>
                    <span className="vp-result__field-value">{result.internship_title}</span>
                  </div>
                  <div className="vp-result__field">
                    <span className="vp-result__field-label">Mentor</span>
                    <span className="vp-result__field-value">{result.mentor_name}</span>
                  </div>
                  <div className="vp-result__field">
                    <span className="vp-result__field-label">Issued On</span>
                    <span className="vp-result__field-value">
                      {new Date(result.issued_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="vp-result__field vp-result__field--full">
                    <span className="vp-result__field-label">Certificate ID</span>
                    <span className="vp-result__field-value vp-result__field-value--mono">
                      {result.certificate_id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="vp-result__footer">
                <FaShieldAlt size={12} />
                Authentic Certificate Issued by Gocyn
              </div>
            </motion.div>
          )}

          {/* TRUST BAR */}
          <div className="vp-trust">
            <div className="vp-trust__item">
              <FaAward size={12} /> Industry Recognized
            </div>
            <div className="vp-trust__item">Secure & Tamper-Proof</div>
            <div className="vp-trust__item">Blockchain-Backed</div>
            <div className="vp-trust__item">Trusted by 5,000+ Students</div>
          </div>
        </div>
      </div>
    </>
  );
}