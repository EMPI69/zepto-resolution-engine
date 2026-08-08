export function formatActionName(action: string | null | undefined): string {
  if (!action) return 'Not executed — human review required';
  
  const map: Record<string, string> = {
    'partial_refund': 'Partial Refund',
    'full_refund': 'Full Refund',
    'redelivery': 'Redelivery',
    'apology_no_action': 'Apology / No Action',
    'escalation': 'Escalation',
  };

  if (map[action]) return map[action];

  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(pct % 1 === 0 ? 0 : 2)}%`;
}

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatRuleName(rule: string): string {
  if (!rule) return '';
  return rule
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
