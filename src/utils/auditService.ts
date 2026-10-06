/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuditLogEntry {
  id: string;
  parcelCode: string;
  timestamp: string;
  newStatus: string;
  previousStatus: string;
  metadata?: Record<string, unknown>;
}

export async function addAuditLogEntry(
  code: string,
  newStatus: string,
  prevStatus: string,
  metadata?: Record<string, unknown>
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    parcelCode: code,
    timestamp: new Date().toISOString(),
    newStatus,
    previousStatus: prevStatus,
    metadata,
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('apex_audit_logs');
      const logs: AuditLogEntry[] = existing ? JSON.parse(existing) : [];
      logs.unshift(entry);
      if (logs.length > 100) logs.pop();
      localStorage.setItem('apex_audit_logs', JSON.stringify(logs));
    }
  } catch {
    // Silently continue if localStorage unavailable
  }

  return entry;
}

export function getAuditLogs(): AuditLogEntry[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('apex_audit_logs');
      return existing ? JSON.parse(existing) : [];
    }
  } catch {
    // fallback
  }
  return [];
}
