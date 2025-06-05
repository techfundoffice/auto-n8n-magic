
// N8n API Types
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, any>;
  settings?: Record<string, any>;
  staticData?: Record<string, any>;
  tags?: string[];
  versionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, string>;
  disabled?: boolean;
  notes?: string;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  continueOnFail?: boolean;
  onError?: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput';
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: 'manual' | 'trigger' | 'webhook' | 'retry';
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'crashed' | 'waiting';
  startedAt?: string;
  stoppedAt?: string;
  finished: boolean;
  retryOf?: string;
  retrySuccessId?: string;
  data?: {
    startData?: Record<string, any>;
    resultData?: {
      runData: Record<string, any>;
      error?: {
        message: string;
        stack?: string;
      };
    };
    executionData?: Record<string, any>;
  };
}

export interface N8nCredential {
  id: string;
  name: string;
  type: string;
  data?: Record<string, any>;
  nodesAccess?: Array<{
    nodeType: string;
    user: string;
    date: string;
  }>;
  sharedWith?: Array<{
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
  homeProject?: {
    id: string;
    name: string;
    type: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nNodeType {
  name: string;
  displayName: string;
  description: string;
  version: number | number[];
  defaults: Record<string, any>;
  inputs: string[];
  outputs: string[];
  properties: N8nNodeProperty[];
  credentials?: Array<{
    name: string;
    required?: boolean;
    displayOptions?: Record<string, any>;
  }>;
  requestDefaults?: Record<string, any>;
  icon?: string;
  iconUrl?: string;
  group: string[];
  subtitle?: string;
  hidden?: boolean;
  codex?: {
    categories?: string[];
    subcategories?: Record<string, string[]>;
    resources?: {
      primaryDocumentation?: Array<{
        url: string;
      }>;
      credentialDocumentation?: Array<{
        url: string;
      }>;
    };
  };
}

export interface N8nNodeProperty {
  displayName: string;
  name: string;
  type: string;
  default: any;
  required?: boolean;
  description?: string;
  placeholder?: string;
  options?: Array<{
    name: string;
    value: any;
    description?: string;
  }>;
  displayOptions?: {
    show?: Record<string, any>;
    hide?: Record<string, any>;
  };
  routing?: Record<string, any>;
  extractValue?: Record<string, any>;
}

export interface N8nVariable {
  id: string;
  key: string;
  value: string;
}

export interface N8nHealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export interface N8nApiResponse<T> {
  data: T;
  nextCursor?: string;
}

export interface N8nPaginationOptions {
  limit?: number;
  cursor?: string;
}

export interface N8nWorkflowFilter {
  active?: boolean;
  tags?: string[];
  projectId?: string;
}

export interface N8nExecutionFilter {
  status?: string;
  workflowId?: string;
  includeData?: boolean;
}

// Local database types
export interface WorkflowDeployment {
  id: string;
  user_id: string;
  local_workflow_id?: string;
  n8n_workflow_id: string;
  n8n_workflow_name: string;
  deployment_status: 'deployed' | 'failed' | 'syncing';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_sync_at?: string;
  sync_error?: string;
}

export interface WorkflowExecution {
  id: string;
  user_id: string;
  n8n_execution_id: string;
  n8n_workflow_id: string;
  deployment_id?: string;
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'crashed' | 'waiting';
  mode: 'manual' | 'trigger' | 'webhook' | 'retry';
  started_at?: string;
  finished_at?: string;
  execution_time?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CredentialInfo {
  id: string;
  user_id: string;
  n8n_credential_id: string;
  credential_name: string;
  credential_type: string;
  created_at: string;
  updated_at: string;
}
