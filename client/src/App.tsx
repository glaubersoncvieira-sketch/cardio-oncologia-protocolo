import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import ProtocolPage from "./pages/Protocol";
import CalculatorPage from "./pages/Calculator";
import CardioOncologyPage from "./pages/CardioOncology";
import MonitoringPage from "./pages/Monitoring";
import CtcaePage from "./pages/Ctcae";
import InteractionsPage from "./pages/Interactions";
import DashboardPage from "./pages/Dashboard";
import SpecialCaresPage from "./pages/SpecialCares";
import PatientsPage from "./pages/Patients";
import PatientDetailPage from "./pages/PatientDetail";
import ReportPage from "./pages/Report";
import UpdatesPage from "./pages/Updates";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </Route>
      <Route path="/protocol">
        <DashboardLayout>
          <ProtocolPage />
        </DashboardLayout>
      </Route>
      <Route path="/calculator">
        <DashboardLayout>
          <CalculatorPage />
        </DashboardLayout>
      </Route>
      <Route path="/cardio-oncology">
        <DashboardLayout>
          <CardioOncologyPage />
        </DashboardLayout>
      </Route>
      <Route path="/monitoring">
        <DashboardLayout>
          <MonitoringPage />
        </DashboardLayout>
      </Route>
      <Route path="/ctcae">
        <DashboardLayout>
          <CtcaePage />
        </DashboardLayout>
      </Route>
      <Route path="/interactions">
        <DashboardLayout>
          <InteractionsPage />
        </DashboardLayout>
      </Route>
      <Route path="/special-cares">
        <DashboardLayout>
          <SpecialCaresPage />
        </DashboardLayout>
      </Route>
      <Route path="/patients">
        <DashboardLayout>
          <PatientsPage />
        </DashboardLayout>
      </Route>
      <Route path="/patients/:id">
        <DashboardLayout><PatientDetailPage /></DashboardLayout>
      </Route>
      <Route path="/report">
        <DashboardLayout><ReportPage /></DashboardLayout>
      </Route>
      <Route path="/updates">
        <DashboardLayout><UpdatesPage /></DashboardLayout>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
