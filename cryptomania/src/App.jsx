import { BrowserRouter , Routes, Route} from "react-router-dom";
import './App.css';
import Header from "./components/Header";
import Homepage from "./Pages/Homepage";
import CoinPage from "./Pages/CoinPage";
import  Alert  from "./components/Alert";
function App() {
  return (
    <BrowserRouter>
       <div className="main-body">
       <Header/>
       <Routes>
         <Route path="/" element={<Homepage/>} />
         <Route path="/coins/:id" element={<CoinPage/>}/>
       </Routes>
       </div>
       <Alert />
    </BrowserRouter>
  )
}

export default App
