import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRoutes from "../utils/routes"
import User from './user/page';

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path={AppRoutes.user} element={<User />} />
        </Routes>
       </Router>
      </>
  )
}

export default App