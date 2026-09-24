import { useMemo } from 'react'
import { useRoutes, type Location } from 'react-router'
import { appRoutes } from '../routes'

export interface AppRoutesProps {
  /** The location to render. PageTransition passes the one currently on screen. */
  location: Location
}

export function AppRoutes({ location }: AppRoutesProps) {
  const routes = useMemo(
    () => appRoutes.map(({ path, Page }) => ({ path, element: <Page /> })),
    [],
  )
  return useRoutes(routes, location)
}
