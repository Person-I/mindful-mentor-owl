
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import History from "./pages/History";
import CharacterSelect from "./pages/CharacterSelect";
import { CharacterProvider } from "./context/CharacterContext";
import { UserProvider } from "./context/UserIDContext";

const App = () => {
  return (
    <UserProvider>
      <CharacterProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/knowledge-base" element={<Notes />} />
              <Route path="/knowledge-base/:noteId" element={<Notes />} />
              <Route path="/history" element={<History />} />
              <Route path="/history/:talkId" element={<History />} />
              <Route path="/select-character" element={<CharacterSelect />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CharacterProvider>
    </UserProvider>
  );
};

export default App;
