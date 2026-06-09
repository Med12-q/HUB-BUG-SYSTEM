import { Switch, Route, Router as WouterRouter } from "wouter";
import { AppProvider, useApp } from "@/context/AppContext";
import LanguageSelect from "@/pages/LanguageSelect";
import Register from "@/pages/Register";
import Landing from "@/pages/Landing";
import System from "@/pages/System";
import AIChat from "@/pages/AIChat";

function Routes() {
  const { lang, user } = useApp();

  if (!lang) return <LanguageSelect />;
  if (!user) return <Register />;

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/system" component={System} />
      <Route path="/ai" component={AIChat} />
      <Route>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.3)" }}>404</p>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WouterRouter>
        <Routes />
      </WouterRouter>
    </AppProvider>
  );
}
