
import { AppHeader } from '@/components/layout/app-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, Shield, Library, LayoutTemplate, Settings, ToggleRight, ScrollText, LineChart, BellPlus, UserCog, LockKeyholeIcon, Settings2, ListChecks, FolderGit2, DatabaseZap, Workflow, Landmark, FlaskConical, Info, PackageSearch, DatabaseIcon
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
  endpoints?: AdminEndpoint[];
  icon: LucideIcon;
  keyActions: string[];
  schemaDetails?: string;
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
    description: "Manage the catalog of architectural components and their type definitions (if data becomes dynamic).",
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
    keyActions: ["List templates", "Create new template", "Update template", "Delete template", "Share template with team"],
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
    description: "Dashboards for usage metrics, performance stats, error rates, and service availability (typically integrates with external monitoring tools).",
    icon: LineChart,
    keyActions: ["Retrieve key metrics (summary)", "Check service statuses (links/integrations)"],
    endpoints: [
      { method: "GET",    path: "/admin/metrics",          action: "Retrieve key metrics" },
      { method: "GET",    path: "/admin/health",           action: "Check service statuses" }
    ]
  },
  {
    feature: "Notification & Alert Settings",
    description: "Configure email/webhook alerts for threshold breaches, drift detection, and pipeline failures.",
    icon: BellPlus,
    keyActions: ["List alert rules", "Create new alert rule", "Update alert rule", "Remove alert rule"],
    endpoints: [
      { method: "GET",    path: "/admin/alerts",           action: "List alert rules" },
      { method: "POST",   path: "/admin/alerts",           action: "Create a new alert rule" },
      { method: "PUT",    path: "/admin/alerts/:id",       action: "Update alert rule" },
      { method: "DELETE", path: "/admin/alerts/:id",       action: "Remove an alert rule" }
    ]
  },
  {
    feature: "Team & Collaboration Management",
    description: "Invite users, create teams, assign ownership of templates and projects.",
    icon: UserCog,
    keyActions: ["List teams", "Create new team", "Update team info", "Delete team", "Add user to team", "Remove user from team"],
    endpoints: [
      { method: "GET",    path: "/admin/teams",            action: "List all teams" },
      { method: "POST",   path: "/admin/teams",            action: "Create a new team" },
      { method: "PUT",    path: "/admin/teams/:id",        action: "Update team info" },
      { method: "DELETE", path: "/admin/teams/:id",        action: "Delete a team" },
      { method: "POST",   path: "/admin/teams/:id/users",  action: "Add user to team" }
    ]
  },
  {
    feature: "Conceptual Database Schema (Relational)",
    description: "This outlines a conceptual relational database schema to support the admin functionalities. PK denotes Primary Key, FK denotes Foreign Key. Timestamps (e.g., `created_at`, `updated_at`) are recommended for most tables.",
    icon: DatabaseIcon,
    keyActions: ["Review table structures", "Understand data relationships", "Identify key entities"],
    schemaDetails: `
      <h4 class="text-md font-semibold mt-3 mb-1.5 text-foreground/90">Core Entities:</h4>
      <ul class="list-disc list-inside space-y-3 text-sm text-foreground/80">
        <li>
          <strong>Users</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>user_id</code> (PK, UUID/Serial)</li>
            <li><code>username</code> (VARCHAR, UNIQUE, NOT NULL)</li>
            <li><code>email</code> (VARCHAR, UNIQUE, NOT NULL)</li>
            <li><code>hashed_password</code> (VARCHAR, NOT NULL)</li>
            <li><code>status</code> (ENUM/VARCHAR - e.g., 'active', 'inactive', 'pending', NOT NULL)</li>
            <li><code>created_at</code>, <code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
        <li>
          <strong>Roles</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>role_id</code> (PK, UUID/Serial)</li>
            <li><code>role_name</code> (VARCHAR, UNIQUE, NOT NULL - e.g., 'admin', 'editor', 'viewer')</li>
            <li><code>description</code> (TEXT)</li>
          </ul>
        </li>
        <li>
          <strong>Permissions</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>permission_id</code> (PK, UUID/Serial)</li>
            <li><code>permission_key</code> (VARCHAR, UNIQUE, NOT NULL - e.g., 'user:create', 'component:edit', 'template:delete')</li>
            <li><code>description</code> (TEXT)</li>
          </ul>
        </li>
        <li>
          <strong>Teams</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>team_id</code> (PK, UUID/Serial)</li>
            <li><code>team_name</code> (VARCHAR, NOT NULL)</li>
            <li><code>description</code> (TEXT)</li>
            <li><code>owner_user_id</code> (FK to Users.user_id, NULLABLE - for team creator/admin)</li>
            <li><code>created_at</code>, <code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
      </ul>

      <h4 class="text-md font-semibold mt-4 mb-1.5 text-foreground/90">Junction & Relationship Tables:</h4>
      <ul class="list-disc list-inside space-y-3 text-sm text-foreground/80">
        <li>
          <strong>UserRoles</strong> (Links Users to Roles)
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>user_id</code> (FK to Users.user_id, PK)</li>
            <li><code>role_id</code> (FK to Roles.role_id, PK)</li>
            <li><code>assigned_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
        <li>
          <strong>RolePermissions</strong> (Links Roles to Permissions)
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>role_id</code> (FK to Roles.role_id, PK)</li>
            <li><code>permission_id</code> (FK to Permissions.permission_id, PK)</li>
          </ul>
        </li>
        <li>
          <strong>UserTeams</strong> (Links Users to Teams)
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>user_id</code> (FK to Users.user_id, PK)</li>
            <li><code>team_id</code> (FK to Teams.team_id, PK)</li>
            <li><code>joined_at</code> (TIMESTAMP)</li>
            <li><code>team_role</code> (ENUM/VARCHAR - e.g., 'member', 'admin', NULLABLE)</li>
          </ul>
        </li>
      </ul>

      <h4 class="text-md font-semibold mt-4 mb-1.5 text-foreground/90">Application Content & Configuration:</h4>
      <ul class="list-disc list-inside space-y-3 text-sm text-foreground/80">
        <li>
          <strong>ArchitecturalComponents</strong> (If component data becomes dynamic, otherwise static in code)
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>component_id</code> (PK, UUID/VARCHAR - e.g., 'anycast-ip')</li>
            <li><code>title</code> (VARCHAR, NOT NULL)</li>
            <li><code>icon_name</code> (VARCHAR)</li>
            <li><code>complexity</code> (ENUM/VARCHAR)</li>
            <li><code>eli5_summary</code> (TEXT)</li>
            <li><code>eli5_details</code> (TEXT)</li>
            <li><code>details_json</code> (JSONB/TEXT - for types, use_cases, examples, implementation_guidance if structured)</li>
            <li><code>is_published</code> (BOOLEAN, DEFAULT TRUE)</li>
          </ul>
        </li>
        <li>
          <strong>SavedArchitectures</strong> (For user-saved profiles and system templates)
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>architecture_id</code> (PK, UUID/Serial)</li>
            <li><code>name</code> (VARCHAR, NOT NULL)</li>
            <li><code>description</code> (TEXT)</li>
            <li><code>configuration_json</code> (JSONB, NOT NULL - selected components and their types)</li>
            <li><code>owner_user_id</code> (FK to Users.user_id, NULLABLE for system templates)</li>
            <li><code>team_id</code> (FK to Teams.team_id, NULLABLE - for team-owned templates)</li>
            <li><code>is_template</code> (BOOLEAN, DEFAULT FALSE)</li>
            <li><code>visibility</code> (ENUM/VARCHAR - e.g., 'private', 'team', 'public', DEFAULT 'private')</li>
            <li><code>created_at</code>, <code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
        <li>
          <strong>SystemConfigurations</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>config_key</code> (PK, VARCHAR, UNIQUE, NOT NULL - e.g., 'AI_MODEL_NAME', 'MAX_LOGIN_ATTEMPTS')</li>
            <li><code>config_value</code> (TEXT/JSONB, NOT NULL)</li>
            <li><code>description</code> (TEXT)</li>
            <li><code>is_sensitive</code> (BOOLEAN, DEFAULT FALSE)</li>
            <li><code>last_updated_by_user_id</code> (FK to Users.user_id, NULLABLE)</li>
            <li><code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
        <li>
          <strong>FeatureFlags</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>flag_key</code> (PK, VARCHAR, UNIQUE, NOT NULL)</li>
            <li><code>description</code> (TEXT)</li>
            <li><code>is_enabled</code> (BOOLEAN, DEFAULT FALSE, NOT NULL)</li>
            <li><code>targeting_rules_json</code> (JSONB - for more complex rollout rules)</li>
            <li><code>created_at</code>, <code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
      </ul>

      <h4 class="text-md font-semibold mt-4 mb-1.5 text-foreground/90">Operational & Support Tables:</h4>
      <ul class="list-disc list-inside space-y-3 text-sm text-foreground/80">
        <li>
          <strong>AuditLogs</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>log_id</code> (PK, BIGSERIAL/UUID)</li>
            <li><code>user_id</code> (FK to Users.user_id, NULLABLE - for system actions)</li>
            <li><code>action_type</code> (VARCHAR, NOT NULL - e.g., 'USER_LOGIN', 'TEMPLATE_CREATE', 'CONFIG_UPDATE')</li>
            <li><code>resource_type</code> (VARCHAR, NULLABLE - e.g., 'User', 'Template', 'Component')</li>
            <li><code>resource_id</code> (VARCHAR, NULLABLE)</li>
            <li><code>details_json</code> (JSONB - for payload, changes, etc.)</li>
            <li><code>ip_address</code> (VARCHAR, NULLABLE)</li>
            <li><code>user_agent</code> (TEXT, NULLABLE)</li>
            <li><code>timestamp</code> (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP)</li>
          </ul>
        </li>
        <li>
          <strong>AlertRules</strong>
          <ul class="list-circle list-inside pl-4 mt-1 space-y-0.5 text-xs">
            <li><code>rule_id</code> (PK, UUID/Serial)</li>
            <li><code>name</code> (VARCHAR, NOT NULL)</li>
            <li><code>description</code> (TEXT)</li>
            <li><code>trigger_conditions_json</code> (JSONB - e.g., metric thresholds, event patterns)</li>
            <li><code>notification_channels_json</code> (JSONB - e.g., email lists, webhook URLs)</li>
            <li><code>is_enabled</code> (BOOLEAN, DEFAULT TRUE)</li>
            <li><code>created_by_user_id</code> (FK to Users.user_id)</li>
            <li><code>created_at</code>, <code>updated_at</code> (TIMESTAMP)</li>
          </ul>
        </li>
      </ul>
      <p class="text-xs mt-4 text-muted-foreground"><strong>Note:</strong> This is a high-level conceptual schema. A real implementation would require further details like indexing strategies, constraints, specific data types based on the chosen RDBMS, and potentially normalization/denormalization decisions based on query patterns.</p>
    `
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
          <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-primary text-xl">Backend & Database Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md text-muted-foreground">
                The administrative functionalities outlined below are conceptual. Implementing them in a real-world application
                would require a dedicated backend system and robust database. Typically, a <strong>Relational Database</strong> (e.g., PostgreSQL, MySQL)
                is chosen for such tasks due to the structured nature of user data, roles, permissions, and configurations.
                The schema below provides a high-level blueprint for such a database.
              </p>
            </CardContent>
          </Card>
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
                {item.endpoints && item.endpoints.length > 0 && (
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
                )}
                {item.schemaDetails && (
                  <div className="mt-4 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.schemaDetails }} />
                )}
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
