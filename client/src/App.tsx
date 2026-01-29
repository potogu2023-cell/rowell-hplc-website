import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InquiryCartProvider } from "./contexts/InquiryCartContext";
import { CompareProvider } from "./contexts/CompareContext";
import { InquiryCart } from "./components/InquiryCart";
import { CompareBar } from "./components/CompareBar";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import InquiryPage from "./pages/InquiryPage";
import InquirySuccessPage from "./pages/InquirySuccessPage";
import ComparePage from "./pages/ComparePage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/inquiry" component={InquiryPage} />
        <Route path="/inquiry/success" component={InquirySuccessPage} />
        <Route path="/compare" component={ComparePage} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      
      {/* Floating components */}
      <InquiryCart />
      <CompareBar />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <InquiryCartProvider>
          <CompareProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CompareProvider>
        </InquiryCartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
