import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations';
import ParticleCanvas from '../components/ui/ParticleCanvas';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    year: "2026",
    title: "National Robotics Championship Winner",
    description: "Secured 1st place among 200+ teams across India with our autonomous quadruped.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    tags: ["National", "Gold", "Autonomous"]
  },
  {
    year: "2025",
    title: "Best Innovation Award at TechFest",
    description: "Recognized for developing the most energy-efficient swarm robotics system.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    tags: ["Innovation", "Swarm Robotics"]
  },
  {
    year: "2024",
    title: "Robocon India Finalists",
    description: "Reached the grand finale with our custom-built elephant robot and advanced throwing mechanism.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
    tags: ["Robocon", "Finalist"]
  },
  {
    year: "2023",
    title: "International Rover Challenge",
    description: "Ranked top 10 globally for our planetary rover design and manipulation arm.",
    image: "https://images.unsplash.com/photo-1620825937374-87fc1a6014dc?q=80&w=800",
    tags: ["International", "Rover"]
  },
  {
    year: "2022",
    title: "Aero-Design Competitions",
    description: "Successfully deployed fixed-wing UAVs with payload dropping capabilities.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800",
    tags: ["Aero", "UAV"]
  },
  {
    year: "2017",
    title: "Genesis of Robo-Tech Forum",
    description: "The foundation of a collective engineering dream at GCoEA.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
    tags: ["Foundation", "Legacy"]
  }
];

export default function Achievement() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  // We keep a ref to the array to properly update DOM
  cardsRef.current = [];

  const addToRefs = el => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Adding slight delay to let elements mount properly
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      if (!cards || cards.length === 0) return;

      // Ensure we lock the container's scroll via pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${cards.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // Initial state: first card is centered & active, rest are below
      gsap.set(cards, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%',
        perspective: 1000
      });

      // Set everyone initially hidden and lower down
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { opacity: 1, scale: 1, y: 0, rotateX: 0, zIndex: 10 });
        } else {
          gsap.set(card, { opacity: 0, scale: 0.8, y: '50vh', rotateX: 10, zIndex: 1 });
        }
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        tl.to(prevCard, {
          y: '-50vh',
          scale: 0.85,
          opacity: 0,
          rotateX: -10,
          duration: 1,
          ease: 'power2.inOut',
          zIndex: 1
        }, `step${index}`)
        .to(card, {
          y: 0,
          scale: 1,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: 'power2.inOut',
          zIndex: 10
        }, `step${index}`);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-deep text-text-primary min-h-screen pt-20 overflow-x-hidden"
    >
      <div ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <ParticleCanvas />
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void/50" />
        </div>

        {/* Timeline Header */}
        <div className="absolute top-[5vh] left-0 w-full text-center z-10 pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider uppercase drop-shadow-glow-cyan">
            Hall of Fame
          </h1>
          <p className="text-text-secondary mt-2 font-mono text-sm tracking-widest uppercase">
            A Legacy of Excellence
          </p>
        </div>

        {/* 3D Stack Container */}
        <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center perspective-[1000px] z-10">
          {achievements.map((item, index) => (
            <div
              key={item.year}
              ref={addToRefs}
              className="will-change-transform w-[90%] md:w-[80%] h-full max-h-[500px] flex flex-col md:flex-row bg-surface/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)] group"
            >
              {/* Image side - Large and clear */}
              <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-cyan-500/20">
                <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/90 md:bg-gradient-to-r md:from-transparent md:to-deep/90 z-10" />
              </div>

              {/* Text side */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-surface to-void">
                {/* Huge Watermark */}
                <div className="absolute top-2 right-4 text-[6rem] md:text-[8rem] font-display font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
                  {item.year}
                </div>

                <div className="relative z-10">
                  <header className="mb-4">
                    <span className="text-cyan-400 font-mono text-xl tracking-widest block mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                      {item.year}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold text-text-primary leading-tight">
                      {item.title}
                    </h2>
                  </header>

                  <p className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed font-body">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-cyan-100 bg-cyan-500/10 border border-cyan-500/30 rounded-md backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-70">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 animate-pulse">Scroll to explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>

      </div>
    </motion.main>
  );
}
