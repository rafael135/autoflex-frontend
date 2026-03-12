import './App.css'
import { RouterProvider } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { router } from './app/router';

const App = () => {
  return (
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  )
}

export default App
