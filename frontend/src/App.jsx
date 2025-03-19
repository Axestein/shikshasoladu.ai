import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home1 from "../src/page/Alluser/Home1";
import Home from "./page/Home";
import Deaf from "./page/Deaf/Deaf";
import Blind from "./page/Blind/pages/Blind";
import Dashboard from "./page/Deaf/pages/Dashboard";
import SignLanguage from "./page/Deaf/pages/SignLanguage";
import VisualLearning from "./page/Deaf/pages/VisualLearning";
import Gamification from "./page/Deaf/pages/Gamification";
import Community from "./page/Deaf/pages/Community";
import Accessibility from "./page/Deaf/pages/Accessibility";
import DProfile from "./page/Deaf/components/DProfile";
import Canvas from "./page/Deaf/pages/Canvas";
import Signgame from "./page/Deaf/components/Signgame";
import Meet from "./page/Deaf/pages/Meet";
import PlanYourDay from "./page/Deaf/pages/PlanYourDay";
import SignAuth from "./page/Deaf/components/Auth";
import AuthBlind from "./page/Blind/components/AuthBlind";
import SubtitleGenerator from "./page/Blind/pages/SubtitleGenerator";
import DevTool from "./page/Blind/pages/DevTools";
import CodeViewer from "./page/Blind/pages/CodeViewer";
import Aitutor from "./page/Blind/components/Aitutor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deaf" element={<Deaf />} />
        <Route path="/home" element={<Home />} />

        <Route path="/allusers" element={<Home1 />} />
        <Route path="/signlang" element={<SignLanguage />} />
        <Route path="/visual-learning" element={<VisualLearning />} />
        <Route path="/gamification-deaf" element={<Gamification />} />
        <Route path="/community-deaf" element={<Community />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/dprofile" element={<DProfile />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/signgame" element={<Signgame />} />
        <Route path="/deaf-meet" element={<Meet />} />
        <Route path="/deaf-planyourday" element={<PlanYourDay />} />
        <Route path="/authdeaf" element={<SignAuth />} />

        <Route path="/authblind" element={<AuthBlind />} />
        <Route path="/mainblind" element={<Blind />} />
        <Route path="/blindcode" element={<CodeViewer />} />
        <Route path="/blinddev" element={<DevTool />} />
        <Route path="/blindsubtitle" element={<SubtitleGenerator />} />
        <Route path="/aitutor" element={<Aitutor />} />
      </Routes>
    </Router>
  );
}