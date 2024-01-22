import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Game2048 } from './games/2048'

const router = createBrowserRouter([
  { path: '/2048', element: <Game2048 /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
