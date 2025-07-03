'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function ScrollAnimations() {
  useEffect(() => {
    // Initialize Lenis for smooth scroll dampening
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      // Reduce dampening when dragging
      touchInertiaMultiplier: 35,
      wheelMultiplier: 1,
    })

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Intersection Observer for scroll animations
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => observer.observe(el))

    // Cleanup
    return () => {
      lenis.destroy()
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return null
}