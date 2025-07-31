import { gsap } from 'gsap'
import { onMounted, onUnmounted } from 'vue'

export function useAnimations() {
  let animations = []

  // Limpiar animaciones al desmontar
  onUnmounted(() => {
    animations.forEach(anim => anim.kill())
    animations = []
  })

  // Animación de entrada para elementos
  const fadeIn = (element, duration = 0.5, delay = 0) => {
    const anim = gsap.fromTo(element, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de salida para elementos
  const fadeOut = (element, duration = 0.3) => {
    const anim = gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      ease: 'power2.in'
    })
    animations.push(anim)
    return anim
  }

  // Animación de escala
  const scaleIn = (element, duration = 0.4) => {
    const anim = gsap.fromTo(element,
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration,
        ease: 'back.out(1.7)'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de rotación
  const rotate = (element, duration = 1, repeat = -1) => {
    const anim = gsap.to(element, {
      rotation: 360,
      duration,
      repeat,
      ease: 'none'
    })
    animations.push(anim)
    return anim
  }

  // Animación de rebote
  const bounce = (element, duration = 0.6) => {
    const anim = gsap.fromTo(element,
      { scale: 0.3, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration,
        ease: 'bounce.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de shake
  const shake = (element, duration = 0.5) => {
    const anim = gsap.to(element, {
      x: '+=10',
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power1.inOut'
    })
    animations.push(anim)
    return anim
  }

  // Animación de pulse
  const pulse = (element, duration = 0.3) => {
    const anim = gsap.to(element, {
      scale: 1.1,
      duration: duration / 2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    })
    animations.push(anim)
    return anim
  }

  // Animación de slide desde la izquierda
  const slideInLeft = (element, duration = 0.5) => {
    const anim = gsap.fromTo(element,
      { x: -100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de slide desde la derecha
  const slideInRight = (element, duration = 0.5) => {
    const anim = gsap.fromTo(element,
      { x: 100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de slide desde arriba
  const slideInTop = (element, duration = 0.5) => {
    const anim = gsap.fromTo(element,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de slide desde abajo
  const slideInBottom = (element, duration = 0.5) => {
    const anim = gsap.fromTo(element,
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de stagger para múltiples elementos
  const staggerIn = (elements, duration = 0.3, stagger = 0.1) => {
    const anim = gsap.fromTo(elements,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration,
        stagger,
        ease: 'power2.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de confeti
  const confetti = (container, duration = 3) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    const pieces = []
    
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div')
      piece.style.position = 'absolute'
      piece.style.width = '10px'
      piece.style.height = '10px'
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      piece.style.borderRadius = '50%'
      piece.style.left = Math.random() * 100 + '%'
      piece.style.top = '-10px'
      piece.style.pointerEvents = 'none' // Evitar interferencias con clics
      container.appendChild(piece)
      pieces.push(piece)
    }

    const anim = gsap.to(pieces, {
      y: container.offsetHeight + 50, // Usar la altura del contenedor + margen
      rotation: 360,
      duration,
      stagger: 0.02,
      ease: 'power2.out',
      onComplete: () => {
        pieces.forEach(piece => piece.remove())
      }
    })
    
    animations.push(anim)
    return anim
  }

  // Animación de ruleta
  const ruleta = (element, duration = 3, finalRotation = 0) => {
    const anim = gsap.to(element, {
      rotation: finalRotation + 360 * 5, // 5 vueltas completas + posición final
      duration,
      ease: 'power2.out'
    })
    animations.push(anim)
    return anim
  }

  // Animación de bola cayendo
  const bolaCayendo = (element, duration = 1) => {
    const anim = gsap.fromTo(element,
      { 
        y: -200, 
        scale: 0.5, 
        opacity: 0,
        rotation: 0
      },
      { 
        y: 0, 
        scale: 1, 
        opacity: 1,
        rotation: 360,
        duration,
        ease: 'bounce.out'
      }
    )
    animations.push(anim)
    return anim
  }

  // Animación de celebración
  const celebracion = (element, duration = 2) => {
    const timeline = gsap.timeline()
    
    timeline
      .to(element, { scale: 1.2, duration: 0.2, ease: 'power2.out' })
      .to(element, { scale: 1, duration: 0.2, ease: 'power2.in' })
      .to(element, { scale: 1.1, duration: 0.1, ease: 'power2.out' })
      .to(element, { scale: 1, duration: 0.1, ease: 'power2.in' })
      .to(element, { 
        rotation: 360, 
        duration: 0.5, 
        ease: 'power2.out' 
      })
    
    animations.push(timeline)
    return timeline
  }

  // Parar todas las animaciones
  const stopAll = () => {
    animations.forEach(anim => anim.kill())
    animations = []
  }

  return {
    fadeIn,
    fadeOut,
    scaleIn,
    rotate,
    bounce,
    shake,
    pulse,
    slideInLeft,
    slideInRight,
    slideInTop,
    slideInBottom,
    staggerIn,
    confetti,
    ruleta,
    bolaCayendo,
    celebracion,
    stopAll
  }
} 