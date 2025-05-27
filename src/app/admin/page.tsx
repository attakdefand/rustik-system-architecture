
import { AppHeader } from '@/components/layout/app-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, Shield, Library, LayoutTemplate, Settings, ToggleRight, ScrollText, LineChart, BellPlus, UserCog, LockKeyholeIcon, Settings2, ListChecks, FolderGit2, DatabaseZap, Workflow, Landmark, FlaskConical, Info, PackageSearch
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AdminEndpoint {
  method: string;
  path: string;
  action: string;
}

interface AdminFeature {
  feature: string;
  description: string;
  endpoints: AdminEndpoint[];
  icon: LucideIcon;
  keyActions: string[];
}

const adminFunctionalityData: AdminFeature[] = [
  {
    feature: "User Management",
    description: "CRUD operations on user accounts, status control, password resets, and session management.",
    icon: Users,
    keyActions: ["List users", "Create new user", "Fetch user details", "Update user profile/status", "Deactivate/delete user", "Trigger password reset"],
    endpoints: [
      { method: "GET",    path: "/admin/users",            action: "List all users" },
      { method: "POST",   path: "/admin/users",            action: "Create a new user" },
      { method: "GET",    path: "/admin/users/:id",        action: "Fetch user details" },
      { method: "PUT",    path: "/admin/users/:id",        action: "Update user profile or status" },
      { method: "DELETE", path: "/admin/users/:id",        action: "Deactivate or delete user" },
      { method: "POST",   path: "/admin/users/:id/reset",  action: "Trigger password reset" }
    ]
  },
  {
    feature: "Role & Permission Management",
    description: "Define roles, assign permissions, and manage access-control policies.",
    icon: Shield,
    keyActions: ["List roles", "Create new role", "Update role permissions", "Remove role", "Assign roles to user"],
    endpoints: [
      { method: "GET",    path: "/admin/roles",            action: "List all roles" },
      { method: "POST",   path: "/admin/roles",            action: "Create a new role" },
      { method: "PUT",    path: "/admin/roles/:id",        action: "Update role name/permissions" },
      { method: "DELETE", path: "/admin/roles/:id",        action: "Remove a role" },
      { method: "POST",   path: "/admin/users/:id/roles",  action: "Assign roles to user" }
    ]
  },
  {
    feature: "Component Library Admin",
    description: "Manage the catalog of architectural components and their type definitions.",
    icon: Library,
    keyActions: ["List components", "Add new component", "Update component metadata", "Remove component", "Manage component types"],
    endpoints: [
      { method: "GET",    path: "/admin/components",       action: "List all components" },
      { method: "POST",   path: "/admin/components",       action: "Add a new component" },
      { method: "PUT",    path: "/admin/components/:id",   action: "Update component metadata" },
      { method: "DELETE", path: "/admin/components/:id",   action: "Remove a component" },
      { method: "POST",   path: "/admin/components/:id/types",action:"Manage component types"}
    ]
  },
  {
    feature: "Template & Profile Management",
    description: "Create, update, and share architecture templates and saved profiles.",
    icon: LayoutTemplate,
    keyActions: ["List templates", "Create new template", "Update template", "Delete template"],
    endpoints: [
      { method: "GET",    path: "/admin/templates",        action: "List all templates" },
      { method: "POST",   path: "/admin/templates",        action: "Create a new template" },
      { method: "PUT",    path: "/admin/templates/:id",    action: "Update template" },
      { method: "DELETE", path: "/admin/templates/:id",    action: "Delete template" }
    ]
  },
  {
    feature: "System Configuration",
    description: "Manage global settings, API keys, environment variables, and AI integration parameters.",
    icon: Settings,
    keyActions: ["View settings", "Update configuration", "Rotate sensitive keys"],
    endpoints: [
      { method: "GET",    path: "/admin/config",           action: "View all settings" },
      { method: "PUT",    path: "/admin/config",           action: "Update configuration" },
      { method: "POST",   path: "/admin/config/rotate",    action: "Rotate sensitive keys" }
    ]
  },
  {
    feature: "Feature Flags & Releases",
    description: "Toggle experimental features, control rollout stages, and manage versioned releases.",
    icon: ToggleRight,
    keyActions: ["List feature flags", "Create/enable flag", "Toggle/update flag", "Disable/remove flag"],
    endpoints: [
      { method: "GET",    path: "/admin/flags",            action: "List all feature flags" },
      { method: "POST",   path: "/admin/flags",            action: "Create or enable a flag" },
      { method: "PUT",    path: "/admin/flags/:key",       action: "Toggle or update flag" },
      { method: "DELETE", path: "/admin/flags/:key",       action: "Disable or remove flag" }
    ]
  },
  {
    feature: "Audit Logs & Activity",
    description: "View and filter system-wide audit trails for compliance and forensics.",
    icon: ScrollText,
    keyActions: ["Fetch audit logs", "Search logs by criteria"],
    endpoints: [
      { method: "GET",    path: "/admin/logs",             action: "Fetch paginated audit logs" },
      { method: "GET",    path: "/admin/logs/search",      action: "Search logs by criteria" }
    ]
  },
  {
    feature: "Analytics & System Health",
    description: "Dashboards for usage metrics, performance stats, error rates, and service availability.",
    icon: LineChart,
    keyActions: ["Retrieve key metrics", "Check service statuses"],
    endpoints: [
      { method: "GET",    path: "/admin/metrics",          action: "Retrieve key metrics" },
      { method: "GET",    path: "/admin/health",           action: "Check service statuses" }
    ]
  },
  {
    feature: "Notification & Alert Settings",
    description: "Configure email/webhook alerts for threshold breaches, drift detection, and pipeline failures.",
    icon: BellPlus, // Changed from BellCog to BellPlus
    keyActions: ["List alert rules", "Create new alert", "Update alert rule", "Remove alert"],
    endpoints: [
      { method: "GET",    path: "/admin/alerts",           action: "List alert rules" },
      { method: "POST",   path: "/admin/alerts",           action: "Create a new alert" },
      { method: "PUT",    path: "/admin/alerts/:id",       action: "Update alert rule" },
      { method: "DELETE", path: "/admin/alerts/:id",       action: "Remove an alert" }
    ]
  },
  {
    feature: "Team & Collaboration Management",
    description: "Invite users, create teams, assign ownership of templates and projects.",
    icon: UserCog,
    keyActions: ["List teams", "Create new team", "Update team info", "Delete team", "Add user to team"],
    endpoints: [
      { method: "GET",    path: "/admin/teams",            action: "List all teams" },
      { method: "POST",   path: "/admin/teams",            action: "Create a new team" },
      { method: "PUT",    path: "/admin/teams/:id",        action: "Update team info" },
      { method: "DELETE", path: "/admin/teams/:id",        action: "Delete a team" },
      { method: "POST",   path: "/admin/teams/:id/users",  action: "Add user to team" }
    ]
  }
];

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <LockKeyholeIcon className="h-24 w-24 text-primary mb-8 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            Admin Panel (Conceptual)
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            This section outlines potential administrative functionalities for Rustik.
            Implementing these features would require a dedicated backend system, database,
            and robust authentication/authorization mechanisms.
          </p>
        </div>

        <Accordion type="multiple" className="w-full max-w-4xl mx-auto space-y-6">
          {adminFunctionalityData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={item.feature} className="border border-border/70 rounded-xl shadow-lg overflow-hidden bg-card">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border/70">
                <div className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-gray-700 dark:text-gray-200 text-left">{item.feature}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 space-y-3">
                <p className="text-md text-muted-foreground">{item.description}</p>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">Key Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                    {item.keyActions.map(action => <li key={action}>{action}</li>)}
                  </ul>
                </div>
                {/* 
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">Conceptual API Endpoints:</h4>
                  <ul className="space-y-1 text-xs text-foreground/70">
                    {item.endpoints.map(endpoint => (
                      <li key={`${endpoint.method}-${endpoint.path}`}>
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded-md mr-2 text-primary/80">{endpoint.method}</span>
                        <span className="font-mono text-muted-foreground">{endpoint.path}</span>
                        <span className="italic"> - {endpoint.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                */}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border/50 mt-16">
        <p>&copy; {new Date().getFullYear()} Rustik. Administering architectural excellence (conceptually).</p>
      </footer>
    </div>
  );
}
