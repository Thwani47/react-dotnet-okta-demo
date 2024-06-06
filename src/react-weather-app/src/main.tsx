import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Home.tsx'
import { LoginCallback, Security } from '@okta/okta-react'
import OktaAuth, { toRelativeUrl } from '@okta/okta-auth-js'
import Profile from './components/Profile.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login/callback',
    element: <LoginCallback />
  },
  {
    path: '/profile',
    element: <Profile />
  }
])


const oktaAuth = new OktaAuth({
  issuer: `${import.meta.env.VITE_OKTA_ISSUER}/oauth2/default`,
  clientId: `${import.meta.env.VITE_OKTA_CLIENT_ID}`,
  scopes: ['openid', 'profile', 'email'],
  redirectUri: window.location.origin + '/login/callback'
})


const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
  window.location.href = toRelativeUrl(originalUri || '', window.location.pathname)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <RouterProvider router={router} />
    </Security>
  </React.StrictMode>,
)
