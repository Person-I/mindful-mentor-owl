import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Index from "./pages/Index";
// import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import CharacterSelect from "./pages/CharacterSelect";
import { CharacterProvider } from "./context/CharacterContext";

const App = () => {
  return (
    <CharacterProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            {/* <Route path="/chat" element={<Chat />} /> */}
            <Route path="/knowledge-base" element={<Notes />} />
            <Route path="/knowledge-base/:noteId" element={<Notes />} />
            <Route path="/select-character" element={<CharacterSelect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CharacterProvider>
  );
};

export default App;
