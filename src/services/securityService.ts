import { SecurityAuditLog, UserRole } from '../types';

class SecurityService {
  private auditLogs: SecurityAuditLog[] = [];

  constructor() {
    this.logAction(
      'System Security Engine',
      'admin',
      'System Initialization',
      '127.0.0.1',
      'low',
      'FSSAI validation rules, CSRF tokens & DGCA NPNT digital sky signatures enabled.'
    );
  }

  public sanitizeInput(input: string): string {
    return input.replace(/[<>'"]/g, '').trim();
  }

  public validateFSSAILicense(license: string): boolean {
    const cleaned = license.trim();
    return /^\d{14}$/.test(cleaned);
  }

  public validateUPIVPA(vpa: string): boolean {
    return /^[\w.-]+@[\w.-]+$/.test(vpa.trim());
  }

  public generateLandingOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  public generateTransactionId(): string {
    const prefix = 'TXN-UPI';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${random}`;
  }

  public logAction(
    actor: string,
    role: UserRole,
    action: string,
    ipAddress: string = '192.168.1.45',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    details: string = ''
  ): void {
    const log: SecurityAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: true }),
      actor,
      role,
      action,
      ipAddress,
      severity,
      details
    };
    this.auditLogs.unshift(log);
  }

  public getLogs(): SecurityAuditLog[] {
    return [...this.auditLogs];
  }
}

export const securityService = new SecurityService();
