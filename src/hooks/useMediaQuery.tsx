
import { useState, useEffect, useLayoutEffect } from "react"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    // Use modern event listener API
    try {
      // Modern browsers
      matchMedia.addEventListener("change", handleChange)
      return () => {
        matchMedia.removeEventListener("change", handleChange)
      }
    } catch (e) {
      // Fallback for older browsers
      matchMedia.addListener(handleChange)
      return () => {
        matchMedia.removeListener(handleChange)
      }
    }
  }, [query])

  return matches
}
