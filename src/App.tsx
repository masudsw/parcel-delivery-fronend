import CommonLayout from "./layout/CommonLayout"
import { Outlet } from "react-router-dom"

function App() {
  return (
    <CommonLayout>
      <Outlet/>
    </CommonLayout>
  )
}

export default App