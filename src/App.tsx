
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import CharacterSelect from "./pages/CharacterSelect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:noteId" element={<Notes />} />
          <Route path="/select-character" element={<CharacterSelect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
