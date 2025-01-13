import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm.js'
import './App.css'

import App from './App.jsx'
import SearchBooks from './pages/SearchBooks'
import SavedBooks from './pages/SavedBooks'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />
      }, {
        path: '/saved',
        element: <SavedBooks />
      },
      {
        path: '/login',
        element: <LoginForm handleModalClose={() => { /* handle modal close logic */ }} />
      },
      {
        path: '/signup',
        element: <SignupForm handleModalClose={() => { /* handle modal close logic */ }} />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
