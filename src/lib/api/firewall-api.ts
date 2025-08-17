// Firewall API Client - Frontend Integration with MongoDB Backend
import type { FirewallRule } from '@/lib/mongodb/schemas';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  rules: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    enabled: number;
    disabled: number;
    allowRules: number;
    denyRules: number;
    totalHits: number;
  };
}

interface FirewallRuleFilters {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
  action?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CreateFirewallRuleData {
  name: string;
  description?: string;
  enabled?: boolean;
  priority?: number;
  source: {
    type: 'any' | 'ip' | 'subnet' | 'group';
    value: string;
  };
  destination: {
    type: 'any' | 'ip' | 'subnet' | 'group';
    value: string;
  };
  service: {
    protocol: 'tcp' | 'udp' | 'icmp' | 'any';
    ports: string;
  };
  action: 'allow' | 'deny' | 'drop';
  schedule?: string;
  logging?: boolean;
  createdBy?: string;
}

interface UpdateFirewallRuleData extends Partial<CreateFirewallRuleData> {}

class FirewallApiClient {
  private baseUrl = '/api/firewall';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ===== FIREWALL RULES CRUD =====

  async getRules(filters: FirewallRuleFilters = {}): Promise<ApiResponse<PaginatedResponse<FirewallRule>>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/rules${queryString ? `?${queryString}` : ''}`;

    return this.request<PaginatedResponse<FirewallRule>>(endpoint);
  }

  async getRuleById(id: string): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>(`/rules/${id}`);
  }

  async createRule(ruleData: CreateFirewallRuleData): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>('/rules', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  async updateRule(id: string, updateData: UpdateFirewallRuleData): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>(`/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteRule(id: string): Promise<ApiResponse<{ deletedRule: { id: string; name: string } }>> {
    return this.request(`/rules/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== BULK OPERATIONS =====

  async bulkUpdateRules(
    ids: string[],
    update: Partial<FirewallRule>
  ): Promise<ApiResponse<{ modifiedCount: number; requestedCount: number }>> {
    return this.request('/rules', {
      method: 'PUT',
      body: JSON.stringify({ ids, update }),
    });
  }

  async bulkDeleteRules(
    ids: string[]
  ): Promise<ApiResponse<{ deletedCount: number; requestedCount: number }>> {
    return this.request('/rules', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  async bulkEnableRules(ids: string[]): Promise<ApiResponse<{ modifiedCount: number }>> {
    const response = await this.bulkUpdateRules(ids, { enabled: true });
    return response;
  }

  async bulkDisableRules(ids: string[]): Promise<ApiResponse<{ modifiedCount: number }>> {
    const response = await this.bulkUpdateRules(ids, { enabled: false });
    return response;
  }

  // ===== RULE ACTIONS =====

  async toggleRule(id: string): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>(`/rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'toggle' }),
    });
  }

  async incrementHitCount(id: string): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>(`/rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'hit' }),
    });
  }

  async resetHitCount(id: string): Promise<ApiResponse<FirewallRule>> {
    return this.request<FirewallRule>(`/rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'resetHits' }),
    });
  }

  // ===== SEARCH & FILTERING =====

  async searchRules(
    query: string,
    filters: Omit<FirewallRuleFilters, 'search'> = {}
  ): Promise<ApiResponse<PaginatedResponse<FirewallRule>>> {
    return this.getRules({ ...filters, search: query });
  }

  async getRulesByAction(action: string): Promise<ApiResponse<PaginatedResponse<FirewallRule>>> {
    return this.getRules({ action });
  }

  async getEnabledRules(): Promise<ApiResponse<PaginatedResponse<FirewallRule>>> {
    return this.getRules({ enabled: true });
  }

  async getDisabledRules(): Promise<ApiResponse<PaginatedResponse<FirewallRule>>> {
    return this.getRules({ enabled: false });
  }

  // ===== STATISTICS =====

  async getStats(): Promise<ApiResponse<PaginatedResponse<FirewallRule>['stats']>> {
    const response = await this.getRules({ limit: 1 });
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.stats,
      };
    }
    return {
      success: false,
      error: 'Failed to fetch statistics',
    };
  }

  // ===== IMPORT/EXPORT =====

  async exportRules(): Promise<ApiResponse<FirewallRule[]>> {
    return this.request<FirewallRule[]>('/rules/export');
  }

  async importRules(rules: CreateFirewallRuleData[]): Promise<ApiResponse<{ importedCount: number }>> {
    return this.request('/rules/import', {
      method: 'POST',
      body: JSON.stringify({ rules }),
    });
  }

  // ===== VALIDATION =====

  async validateRule(ruleData: CreateFirewallRuleData): Promise<ApiResponse<{ valid: boolean; conflicts?: any[] }>> {
    return this.request('/rules/validate', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  // ===== TEMPLATES =====

  async getTemplates(): Promise<ApiResponse<any[]>> {
    return this.request('/templates');
  }

  async createRuleFromTemplate(templateId: string, customData?: Partial<CreateFirewallRuleData>): Promise<ApiResponse<FirewallRule>> {
    return this.request('/rules/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, customData }),
    });
  }
}

// Export singleton instance
export const firewallApi = new FirewallApiClient();

// Export types for use in components
export type {
  FirewallRule,
  CreateFirewallRuleData,
  UpdateFirewallRuleData,
  FirewallRuleFilters,
  PaginatedResponse,
  ApiResponse,
};
