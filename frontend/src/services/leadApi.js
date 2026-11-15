import { API_BASE_URL } from '../config/api';

/**
 * Creates a single lead by submitting only the 7 allowed business fields to POST /leads.
 * Strictly prevents sending ML-generated or system fields.
 *
 * @param {Object} leadData
 * @param {string} leadData.lead_id
 * @param {string} leadData.source
 * @param {string} leadData.customer_type
 * @param {string} leadData.vehicle
 * @param {string} leadData.part_needed
 * @param {number|string} leadData.estimated_order_value_inr
 * @param {string} leadData.message
 * @returns {Promise<Object>} Created LeadResponse with ML-predicted priority and confidence
 */
export async function createLeadApi(leadData) {
  // Extract strictly the seven permitted fields, trimming whitespace
  const payload = {
    lead_id: String(leadData.lead_id ?? '').trim(),
    source: String(leadData.source ?? '').trim(),
    customer_type: String(leadData.customer_type ?? '').trim(),
    vehicle: String(leadData.vehicle ?? '').trim(),
    part_needed: String(leadData.part_needed ?? '').trim(),
    estimated_order_value_inr: parseInt(leadData.estimated_order_value_inr, 10),
    message: String(leadData.message ?? '').trim(),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (netErr) {
    const error = new Error(
      'Connection Error: Unable to connect to the lead service. Please check your network connection and try again.'
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Pydantic 422 validation error format: [{loc: [...], msg: "..."}]
        detailMessage = data.detail.map((err) => `${err.loc?.slice(-1)[0] || 'field'}: ${err.msg}`).join(', ');
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Formats an ISO UTC timestamp into a human-readable Indian Standard Time (IST) string.
 * Example output: "15 Nov 2026, 1:30 PM"
 *
 * @param {string|Date} isoStr - ISO date string from database or API
 * @returns {string} Formatted IST date and time
 */
export function formatISTDateTime(isoStr) {
  if (!isoStr) return '—';
  try {
    let dateStr = isoStr;
    if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
      dateStr = dateStr.replace(' ', 'T') + 'Z';
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(isoStr);

    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Format and normalize AM/PM to uppercase
    return formatter.format(date).replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
  } catch {
    return String(isoStr);
  }
}

/**
 * Fetches paginated leads from GET /leads with optional search, status filtering, and sorting.
 *
 * @param {Object} options
 * @param {number} [options.skip=0] - Offset for pagination
 * @param {number} [options.limit=25] - Page size
 * @param {string} [options.search=''] - Search term
 * @param {string} [options.status=''] - Lifecycle status filter (New, Contacted, Qualified, Closed)
 * @param {string} [options.sort='newest'] - Sort order by created_at ('newest' or 'oldest')
 * @returns {Promise<{total: number, skip: number, limit: number, leads: Array}>}
 */
export async function fetchLeadsApi({ skip = 0, limit = 25, search = '', status = '', sort = 'newest' } = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('skip', String(Math.max(0, parseInt(skip, 10) || 0)));
  queryParams.append('limit', String(Math.max(1, Math.min(100, parseInt(limit, 10) || 25))));

  if (search && search.trim()) {
    queryParams.append('search', search.trim());
  }

  if (status && status.trim() && status !== 'All') {
    queryParams.append('status', status.trim());
  }

  if (sort && (sort === 'newest' || sort === 'oldest')) {
    queryParams.append('sort', sort);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/leads?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (netErr) {
    const error = new Error(
      'Connection Error: Unable to fetch leads. Please check your network connection and try again.'
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        detailMessage = data.detail.map((err) => `${err.loc?.slice(-1)[0] || 'field'}: ${err.msg}`).join(', ');
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Retrieves a single lead by its internal database ID via GET /leads/{id}.
 *
 * @param {number|string} id - Lead internal database ID
 * @returns {Promise<Object>} Single LeadResponse
 */
export async function fetchLeadByIdApi(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (netErr) {
    const error = new Error(
      `Connection Error: Unable to fetch lead #${id}. Please check your network connection and try again.`
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Updates a lead's lifecycle status and/or manual priority override via PATCH /leads/{id}.
 * Strictly submits only allowed fields (status, override_priority). Never submits protected AI fields.
 *
 * @param {number|string} id - Lead internal database ID
 * @param {Object} updateData
 * @param {string} [updateData.status] - Lifecycle status ("New", "Contacted", "Qualified", "Closed")
 * @param {string|null} [updateData.override_priority] - Priority override ("High", "Medium", "Low", or null to clear)
 * @returns {Promise<Object>} Updated LeadResponse
 */
export async function patchLeadApi(id, updateData) {
  const payload = {};

  if ('status' in updateData && updateData.status !== undefined) {
    payload.status = updateData.status;
  }

  if ('override_priority' in updateData) {
    // Allows valid string ("High", "Medium", "Low") or explicit null to clear
    payload.override_priority = updateData.override_priority;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (netErr) {
    const error = new Error(
      'Connection Error: Unable to update lead. Please check your network connection and try again.'
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        detailMessage = data.detail.map((err) => `${err.loc?.slice(-1)[0] || 'field'}: ${err.msg}`).join(', ');
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Retrieves live CRM aggregation metrics from GET /metrics.
 * Returns total leads, lifecycle status distribution, and AI predicted priority breakdown.
 *
 * @returns {Promise<{total_leads: number, status_counts: Object, predicted_priority_counts: Object}>}
 */
export async function fetchMetricsApi() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/metrics`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (netErr) {
    const error = new Error(
      'Connection Error: Unable to fetch pipeline metrics. Please check your network connection and try again.'
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Imports leads in bulk by uploading a CSV file via POST /leads/import.
 *
 * @param {File} file - CSV file to upload
 * @returns {Promise<{total_rows: number, imported_count: number, rejected_count: number, imported_lead_ids: Array, rejected_rows: Array}>}
 */
export async function importLeadsCsvApi(file) {
  const formData = new FormData();
  formData.append('file', file);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/leads/import`, {
      method: 'POST',
      body: formData,
    });
  } catch (netErr) {
    const error = new Error(
      'Connection Error: Unable to upload CSV file. Please check your network connection and try again.'
    );
    error.status = 0;
    error.isNetworkError = true;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let detailMessage = `Request failed with status ${response.status}`;
    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail;
      } else {
        detailMessage = JSON.stringify(data.detail);
      }
    }

    const error = new Error(detailMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
