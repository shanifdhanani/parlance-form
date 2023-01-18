import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import './App.css';
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import HomePage from "../pages/HomePage/HomePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <DefaultLayout page={HomePage} />
                } />
            </Routes>
        </Router>
    );
}

export default App;
