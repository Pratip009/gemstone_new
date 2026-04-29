'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const promiseItems = [
  {
    id: 1,
    num: '01',
    title: 'Largest Gemstone Inventory',
    description:
      'Over 50,000 rare colored gemstones, carefully curated and certified. The perfect stone is one click away.',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200',
    tag: 'Collection',
    color: '#7eb8f7',
  },
  {
    id: 2,
    num: '02',
    title: 'Truly Bespoke',
    description:
      'Made to order — your gemstone, your metal, your style. Every detail shaped to match your vision.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200',
    tag: 'Custom',
    color: '#b48cf5',
  },
  {
    id: 3,
    num: '03',
    title: 'Best-in-Class Craftsmanship',
    description:
      'Expert jewelers, precision techniques, and enduring quality in every single piece we create.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
    tag: 'Craft',
    color: '#6dd4c0',
  },
  {
    id: 4,
    num: '04',
    title: 'Full Transparency',
    description:
      "All our gemstones come with complete certifications from the world's most trusted labs.",
    image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=1200',
    tag: 'Certified',
    color: '#f7a58b',
  },
];

const certLabs = ['GIA', 'IGI', 'AGL', 'Gübelin', 'HRD'];

// ─── Blob config ──────────────────────────────────────────────────────────────

const blobs = [
  {
    size: 600,
    left: '-10%',
    top: '-12%',
    color: 'rgba(99,102,241,0.13)',
    duration: 7,
    delay: 0,
    yJump: [0, -46, 14, -22, 0],
    xDrift: [0, 20, -12, 6, 0],
    morphFrom: '62% 38% 54% 46% / 46% 62% 38% 54%',
    morphTo: '38% 62% 46% 54% / 54% 38% 62% 46%',
  },
  {
    size: 480,
    left: '62%',
    top: '48%',
    color: 'rgba(139,92,246,0.11)',
    duration: 9,
    delay: 1.4,
    yJump: [0, 34, -52, 14, 0],
    xDrift: [0, -22, 10, -4, 0],
    morphFrom: '44% 56% 66% 34% / 56% 40% 60% 44%',
    morphTo: '68% 32% 44% 56% / 38% 62% 42% 58%',
  },
  {
    size: 320,
    left: '74%',
    top: '5%',
    color: 'rgba(45,212,191,0.10)',
    duration: 6,
    delay: 2.6,
    yJump: [0, -58, 26, -16, 0],
    xDrift: [0, 12, -18, 4, 0],
    morphFrom: '70% 30% 50% 50% / 30% 70% 50% 50%',
    morphTo: '40% 60% 70% 30% / 60% 40% 30% 70%',
  },
  {
    size: 400,
    left: '-6%',
    top: '52%',
    color: 'rgba(99,102,241,0.09)',
    duration: 11,
    delay: 2,
    yJump: [0, 28, -44, 10, 0],
    xDrift: [0, 24, -8, 0],
    morphFrom: '36% 64% 52% 48% / 64% 36% 48% 52%',
    morphTo: '58% 42% 36% 64% / 42% 58% 64% 36%',
  },
  {
    size: 220,
    left: '40%',
    top: '25%',
    color: 'rgba(139,92,246,0.09)',
    duration: 5,
    delay: 0.6,
    yJump: [0, -64, 30, -20, 0],
    xDrift: [0, -16, 24, 0],
    morphFrom: '60% 40% 55% 45% / 45% 55% 40% 60%',
    morphTo: '40% 60% 45% 55% / 55% 45% 60% 40%',
  },
];

// ─── AnimatedBlob ─────────────────────────────────────────────────────────────

function AnimatedBlob({ b }: { b: (typeof blobs)[0] }) {
  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{
        width: b.size,
        height: b.size,
        left: b.left,
        top: b.top,
        background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, transparent 72%)`,
        borderRadius: b.morphFrom,
        filter: 'blur(2px)',
      }}
      animate={{
        y: b.yJump,
        x: b.xDrift,
        borderRadius: [b.morphFrom, b.morphTo, b.morphFrom],
        scale: [1, 1.07, 0.96, 1.03, 1],
      }}
      transition={{
        duration: b.duration,
        delay: b.delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    />
  );
}

// ─── PromiseCard ──────────────────────────────────────────────────────────────
// Mobile: horizontal landscape layout (image left, text right)
// Tablet+: vertical split layout (image top, text bottom)

function PromiseCard({
  item,
  index,
}: {
  item: (typeof promiseItems)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col sm:flex-col rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer w-full"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(2px)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
      }}
      whileHover={{
        boxShadow: `0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px ${item.color}33`,
      }}
    >
      {/*
        IMAGE SECTION
        — On mobile (xs): 16:9 wide image banner
        — On sm+: square 1:1 image
      */}
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Override to square on sm+ via a pseudo-element trick via inline style on md */}
        <style>{`
          @media (min-width: 640px) {
            .card-img-wrap-${item.id} { aspect-ratio: 1 / 1; }
          }
        `}</style>

        <div
          className={`card-img-wrap-${item.id} relative w-full h-full overflow-hidden`}
          style={{ aspectRatio: '16/9' }}
        >
          <motion.div
            className="absolute inset-[-8%] will-change-transform"
            style={{ y: imgY }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover brightness-[0.72] saturate-[0.75] group-hover:brightness-[0.85] group-hover:saturate-90 transition-all duration-700"
            />
          </motion.div>

          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0e1015]/55" />

          {/* Tag pill */}
          <div
            className="absolute top-3 left-3 px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] tracking-[0.16em] uppercase font-medium"
            style={{
              background: `${item.color}22`,
              border: `1px solid ${item.color}55`,
              color: item.color,
              backdropFilter: 'blur(8px)',
            }}
          >
            {item.tag}
          </div>
        </div>
      </div>

      {/* TEXT PANEL */}
      <div
        className="flex flex-col flex-1 p-4 sm:p-5"
        style={{ background: 'rgba(14,16,21,0.75)' }}
      >
        {/* Number + title */}
        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.14em] mt-[3px] shrink-0 leading-none"
            style={{
              color: item.color,
              fontFamily: "'DM Mono', monospace",
              opacity: 0.7,
            }}
          >
            {item.num}
          </span>
          <h3
            className="text-[13px] sm:text-[14px] md:text-[15px] leading-[1.35] font-semibold"
            style={{
              color: '#f0f2f7',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="text-[11px] sm:text-[11.5px] md:text-[12px] leading-[1.65] mb-3 sm:mb-4"
          style={{
            color: 'rgba(160,168,190,0.88)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}
        >
          {item.description}
        </p>

        {/* Accent rule */}
        <div className="mt-auto">
          <div
            className="h-[1.5px] rounded-full w-7 group-hover:w-12 transition-all duration-500 ease-out"
            style={{ background: item.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div
        className="w-1.5 h-1.5 rounded-sm rotate-45"
        style={{ background: 'rgba(255,255,255,0.18)' }}
      />
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GemsPromise() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{
          background:
            'linear-gradient(160deg, #0b0d12 0%, #0e1018 40%, #0c0f16 70%, #0d0b14 100%)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Animated blobs (all screen sizes, clipped to section) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {blobs.map((b, i) => (
            <AnimatedBlob key={i} b={b} />
          ))}

          {/* Noise grain */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px',
              opacity: 0.03,
            }}
          />

          {/* Top vignette */}
          <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#0b0d12] to-transparent" />
        </div>

        {/* ── Content wrapper ── */}
        <div className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-20 md:py-24 lg:py-28">

          {/* ── HEADER ── */}
          <div ref={headingRef} className="mb-10 sm:mb-14 md:mb-18 lg:mb-20">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={isHeadingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center gap-3 mb-4 sm:mb-6"
            >
              <div
                className="w-5 sm:w-6 h-px"
                style={{ background: 'rgba(160,168,210,0.4)' }}
              />
              <span
                className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.25em] uppercase"
                style={{ color: 'rgba(160,168,210,0.55)', fontWeight: 500 }}
              >
                Our Promise
              </span>
            </motion.div>

            {/* Heading — fluid clamp from 32px (mobile) → 72px (desktop) */}
            <div className="overflow-hidden mb-4 sm:mb-5">
              <motion.h2
                initial={{ y: '108%' }}
                animate={isHeadingInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(32px, 6.5vw, 72px)',
                  lineHeight: 1.08,
                  fontWeight: 400,
                  color: '#eef0f7',
                  letterSpacing: '-0.02em',
                }}
              >
                Excellence in{' '}
                <em className="italic" style={{ color: '#a78bfa' }}>
                  every detail
                </em>
              </motion.h2>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-[12px] sm:text-[13px] md:text-[13.5px] leading-[1.75] max-w-[340px] sm:max-w-[400px]"
              style={{
                color: 'rgba(160,168,190,0.7)',
                fontWeight: 300,
                letterSpacing: '0.01em',
              }}
            >
              From gemstone selection to final craftsmanship — each promise is a
              commitment to quality you can see, touch, and trust.
            </motion.p>
          </div>

          {/* ── CARD GRID ──
            Mobile  (<640px) : 1 column, full-width cards
            Tablet  (640px+) : 2 columns
            Desktop (1024px+): 4 columns
          ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20">
            {promiseItems.map((item, index) => (
              <PromiseCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* ── DIVIDER ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-8 sm:mb-10"
          >
            <Divider />
          </motion.div>

          {/* ── CERT BAR ──
            Mobile: wraps freely, smaller pills
            Desktop: single row
          ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap items-center gap-y-2"
          >
            <span
              className="w-full sm:w-auto text-[9px] tracking-[0.2em] uppercase mb-2 sm:mb-0 sm:mr-6"
              style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}
            >
              Certified by
            </span>

            <div className="flex flex-wrap gap-1.5 sm:gap-1">
              {certLabs.map((lab, i) => (
                <motion.div
                  key={lab}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.07 }}
                  className="text-[12px] sm:text-[13px] tracking-[0.1em] px-3 sm:px-4 py-[5px] sm:py-[6px] rounded-md transition-all duration-300 cursor-default select-none"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: 'rgba(200,205,220,0.5)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                  whileHover={{
                    color: 'rgba(167,139,250,0.9)',
                    borderColor: 'rgba(167,139,250,0.3)',
                    background: 'rgba(167,139,250,0.06)',
                  }}
                >
                  {lab}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}