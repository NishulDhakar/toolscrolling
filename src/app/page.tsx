"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import LightPillar from "@/components/LightPillar"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-300 overflow-hidden">
      {/* Background Light Pillar */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-screen -z-10">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.8}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-serif md:text-8xl font-bold tracking-tight text-slate-100 dark:text-white leading-[1.1]">
            Your Tools,<br />
            <span className="text-slate-100">finally organized.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed">
            Discover, organize, and use the best tools on the web all in one focused workspace.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/feed" className="relative group">
              {/* Glow */}
              <span
                className="
                  absolute inset-0 rounded-full
                  bg-gradient-to-r from-[#5227FF]/40 to-[#FF9FFC]/40
                  blur-lg opacity-60
                  group-hover:opacity-90 transition
                "
              />

              {/* Glass Button */}
              <span
                className="
                  relative px-8 py-3 rounded-full text-sm font-medium
                  text-white backdrop-blur-xl
                  bg-white/10 border border-white/20
                  shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                  transition-all duration-300
                  hover:bg-white/20
                  active:scale-[0.97]
                "
              >
                Explore Tool Feed
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
