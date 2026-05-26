"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiBriefcase, 
  FiUsers, 
  FiAward, 
  FiTarget, 
  FiTrendingUp, 
  FiZap,          // ← FiRocket ko FiZap se replace kiya
  FiGlobe, 
  FiBarChart2, 
  FiUserCheck 
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <FiZap className="w-8 h-8 text-blue-600" />   {/* ← Fixed */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  About <span className="text-blue-600">Gocyn</span>
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-lg">
                Empowering the next generation of professionals through expert-led internships and industry-recognized certifications.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/internships"
                  className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <FiBriefcase size={20} />
                  Explore Internships
                </Link>
                <Link
                  href="/mentors"
                  className="border border-gray-300 px-8 py-4 rounded-3xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <FiUsers size={20} />
                  Meet Our Mentors
                </Link>
              </div>
            </motion.div>

            {/* HIGH QUALITY HERO IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <Image
                  src="/logo.png"
                  alt="GOCYN Team - Empowering Future Professionals"
                  width={1400}
                  height={788}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border flex items-center gap-4">
                <FiUserCheck className="w-10 h-10 text-blue-600" />
                <div>
                  <div className="text-4xl font-bold text-blue-600">5000+</div>
                  <p className="font-medium text-sm">Students Placed</p>
                  <p className="text-xs text-gray-500">in top companies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-28"
              >
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-3xl flex items-center gap-2 w-fit">
                  <FiTarget size={18} />
                  Our Mission
                </span>
                <h2 className="text-4xl font-semibold text-gray-900 mt-4 leading-tight">
                  Building Future Leaders Through Real Experience
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  At Gocyn, we believe every student deserves hands-on industry exposure. 
                  We bridge the gap between academic learning and real-world success.
                </p>
              </motion.div>
            </div>

            <div className="md:col-span-7">
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all"
                >
                  <FiBriefcase className="w-10 h-10 text-blue-600 mb-6" />
                  <h3 className="font-semibold text-xl mb-3">Real Internships</h3>
                  <p className="text-gray-600">Live projects with startups and established companies across India.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all"
                >
                  <FiUsers className="w-10 h-10 text-blue-600 mb-6" />
                  <h3 className="font-semibold text-xl mb-3">Industry Mentors</h3>
                  <p className="text-gray-600">Learn directly from professionals working at Google, Microsoft, Amazon &amp; more.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all"
                >
                  <FiAward className="w-10 h-10 text-blue-600 mb-6" />
                  <h3 className="font-semibold text-xl mb-3">Certified Skills</h3>
                  <p className="text-gray-600">Industry-recognized certificates that actually matter to recruiters.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900">Our Story</h2>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2024 with a simple vision: Make quality internships accessible to every ambitious student in India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FiZap className="w-9 h-9 text-blue-600" />   {/* ← Fixed */}
              </div>
              <h4 className="font-semibold mb-2">2024</h4>
              <p className="text-gray-600">Gocyn was born in Indore with 12 students and 3 mentors.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FiBarChart2 className="w-9 h-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Today</h4>
              <p className="text-gray-600">5000+ students placed • 200+ partner companies • 50+ expert mentors.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FiGlobe className="w-9 h-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Future</h4>
              <p className="text-gray-600">Becoming India’s most trusted platform for career-ready talent.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <FiUsers className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <div className="text-5xl font-bold text-blue-600">5000+</div>
              <div className="text-gray-600 mt-2">Students Empowered</div>
            </div>
            <div>
              <FiBriefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <div className="text-5xl font-bold text-blue-600">200+</div>
              <div className="text-gray-600 mt-2">Partner Companies</div>
            </div>
            <div>
              <FiUsers className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <div className="text-5xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 mt-2">Industry Mentors</div>
            </div>
            <div>
              <FiAward className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <div className="text-5xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-2">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-semibold mb-12 flex items-center justify-center gap-3">
            <FiTrendingUp size={32} className="text-blue-600" />
            Our Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FiBriefcase, title: "Hands-on Learning", desc: "Theory + Practice = Real Growth" },
              { icon: FiUsers, title: "Mentorship First", desc: "Guidance from those who’ve already succeeded" },
              { icon: FiTrendingUp, title: "Career Focused", desc: "Every program designed for job-ready outcomes" },
              { icon: FiAward, title: "Transparency", desc: "No hidden fees. No false promises." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <value.icon className="w-12 h-12 mx-auto text-blue-600 mb-6" />
                <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold">Ready to build your future?</h2>
          <p className="mt-4 text-xl opacity-90">Join thousands of students who transformed their careers with Gocyn.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-10 py-5 rounded-3xl font-semibold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <FiZap size={22} />   {/* ← Fixed */}
              Get Started Free
            </Link>
            <Link
              href="/internships"
              className="border border-white/70 px-10 py-5 rounded-3xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiBriefcase size={22} />
              Browse Internships
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}