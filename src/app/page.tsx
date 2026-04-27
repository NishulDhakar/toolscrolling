"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import LightPillar from "@/components/LightPillar"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-300 overflow-hidden">
                   <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      {/* Dark overlay so text is always legible over the video */}
      {/* <div className="absolute inset-0 z-1 bg-black/55" /> */}

      {/* Hero Section */}
      <main className="relative z-2 flex flex-col items-center py-30 min-h-screen px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-serif md:text-7xl font-bold tracking-tight text-slate-100 dark:text-white leading-[1.1]">
            Your Tools,<br />
            <span className="text-slate-100">finally organized.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-100 max-w-xl mx-auto font-light leading-relaxed">
            Discover, organize, and use the best tools on the web all in one focused workspace.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/feed" className="relative group">
              {/* Glow */}
              {/* <span
                className="
                  absolute inset-0 rounded-full
                  bg-gradient-to-r from-[#5227FF]/40 to-[#FF9FFC]/40
                  blur-lg opacity-60
                  group-hover:opacity-90 transition
                "
              /> */}

           <InteractiveHoverButton>
                Explore Tools
           </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
