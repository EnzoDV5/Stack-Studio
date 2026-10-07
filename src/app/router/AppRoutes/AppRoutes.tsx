import { Fragment, useMemo } from 'react'
import { Navigate, useRoutes, type Location } from 'react-router'
import { appRoutes } from '../routes'

export interface AppRoutesProps {
  /** The location to render. PageTransition passes the one currently on screen. */
  location: Location
}

export function AppRoutes({ location }: AppRoutesProps) {
  const routes = useMemo(
    () =>
      appRoutes.map(({ path, Page, redirect }) => ({
        path,
        element: Page ? <Page /> : <Navigate to={redirect} replace />,
      })),
    [],
  )
  const element = useRoutes(routes, location)
  // Remount per pathname (e.g. /work/a → /work/b) so split text and ScrollTriggers start fresh.
  return <Fragment key={location.pathname}>{element}</Fragment>
}
