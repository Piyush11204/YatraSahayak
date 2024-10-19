import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-green-500'>
      <h1 className='text-3xl text-bold'>NGOConnect</h1>
    </div>
  )
}

export default App
