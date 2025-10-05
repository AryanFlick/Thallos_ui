// lib/chart-generator.js — Intelligent chart generation from query results

/**
 * Determines if query results should be visualized as a chart
 * @param {string} question - User's question
 * @param {Array} rows - Query result rows
 * @param {string} intent - Detected query intent
 * @returns {Object|null} Chart configuration or null if no chart needed
 */
export function shouldGenerateChart(question, rows, intent) {
  if (!rows || rows.length === 0) return null;
  
  const lowerQuestion = question.toLowerCase();
  
  // Chart trigger keywords
  const chartKeywords = [
    'chart', 'graph', 'plot', 'visualize', 'show me', 'compare', 'trend',
    'over time', 'history', 'historical', 'performance', 'growth',
    'distribution', 'breakdown', 'top', 'best', 'highest', 'lowest'
  ];
  
  const hasChartKeyword = chartKeywords.some(keyword => lowerQuestion.includes(keyword));
  
  // Auto-generate charts for certain intents
  const chartIntents = [
    'comparison',
    'trend_analysis', 
    'top_opportunities',
    'historical_query',
    'multiple_comparison'
  ];
  
  const shouldAutoChart = chartIntents.includes(intent) || hasChartKeyword;
  
  if (!shouldAutoChart && rows.length < 2) return null; // Need at least 2 data points
  
  // Analyze data structure to determine chart type
  const columns = Object.keys(rows[0] || {});
  if (columns.length < 2) return null; // Need at least 2 columns for a chart
  
  // Detect chart type based on data structure
  return detectChartType(rows, columns, lowerQuestion);
}

/**
 * Detects the best chart type for the given data
 */
function detectChartType(rows, columns, question) {
  const numericColumns = columns.filter(col => 
    typeof rows[0][col] === 'number'
  );
  
  const dateColumns = columns.filter(col =>
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('time') ||
    col.toLowerCase().includes('timestamp')
  );
  
  const categoryColumns = columns.filter(col =>
    typeof rows[0][col] === 'string' && !dateColumns.includes(col)
  );
  
  // TIME SERIES (Line or Area Chart)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const xKey = dateColumns[0];
    const yKeys = numericColumns.slice(0, 3); // Max 3 lines for readability
    
    return {
      type: question.toLowerCase().includes('area') ? 'area' : 'line',
      title: generateChartTitle(question, 'time series'),
      description: `Showing ${yKeys.join(', ')} over time`,
      data: formatChartData(rows, xKey, yKeys),
      xKey: 'name',
      yKey: yKeys.map(k => sanitizeKey(k)),
      colors: ['#10b981', '#34d399', '#6ee7b7']
    };
  }
  
  // DISTRIBUTION / COMPARISON (Pie Chart)
  if (rows.length <= 10 && categoryColumns.length > 0 && numericColumns.length === 1) {
    const nameKey = categoryColumns[0];
    const valueKey = numericColumns[0];
    
    // Only use pie chart if explicitly requested or for share/percentage data
    if (question.toLowerCase().includes('distribution') || 
        question.toLowerCase().includes('share') ||
        question.toLowerCase().includes('breakdown') ||
        valueKey.toLowerCase().includes('percent') ||
        valueKey.toLowerCase().includes('share')) {
      
      return {
        type: 'pie',
        title: generateChartTitle(question, 'distribution'),
        description: `${nameKey} breakdown by ${valueKey}`,
        data: rows.slice(0, 8).map(row => ({
          name: String(row[nameKey] || 'Unknown'),
          value: Number(row[valueKey] || 0)
        })),
        xKey: 'name',
        yKey: 'value',
        colors: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#065f46', '#10b981', '#34d399']
      };
    }
  }
  
  // COMPARISON (Bar Chart) - Default for categorical comparisons
  if (categoryColumns.length > 0 && numericColumns.length > 0) {
    const xKey = categoryColumns[0]; // Category column (protocol, token, etc.)
    const yKeys = numericColumns.slice(0, 3); // Numeric columns to compare
    
    return {
      type: 'bar',
      title: generateChartTitle(question, 'comparison'),
      description: `Comparing ${xKey} by ${yKeys.join(', ')}`,
      data: formatChartData(rows.slice(0, 15), xKey, yKeys), // Limit to 15 bars for readability
      xKey: 'name',
      yKey: yKeys.map(k => sanitizeKey(k)),
      colors: ['#10b981', '#34d399', '#6ee7b7']
    };
  }
  
  // MULTIPLE METRICS (Bar Chart)
  if (numericColumns.length >= 2) {
    const xKey = columns[0]; // First column as X-axis
    const yKeys = numericColumns.slice(0, 3);
    
    return {
      type: 'bar',
      title: generateChartTitle(question, 'metrics'),
      description: `Showing multiple metrics`,
      data: formatChartData(rows.slice(0, 15), xKey, yKeys),
      xKey: 'name',
      yKey: yKeys.map(k => sanitizeKey(k)),
      colors: ['#10b981', '#34d399', '#6ee7b7']
    };
  }
  
  return null; // No suitable chart type found
}

/**
 * Formats raw database rows into chart-friendly data
 */
function formatChartData(rows, xKey, yKeys) {
  return rows.map(row => {
    const dataPoint = { name: formatLabel(row[xKey]) };
    
    if (Array.isArray(yKeys)) {
      yKeys.forEach(key => {
        dataPoint[sanitizeKey(key)] = Number(row[key]) || 0;
      });
    } else {
      dataPoint[sanitizeKey(yKeys)] = Number(row[yKeys]) || 0;
    }
    
    return dataPoint;
  });
}

/**
 * Sanitizes column names for use as object keys
 */
function sanitizeKey(key) {
  return String(key)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^[0-9]/, '_$&') // Prefix numbers with underscore
    .toLowerCase();
}

/**
 * Formats labels for display (e.g., dates, protocol names)
 */
function formatLabel(value) {
  if (!value) return 'Unknown';
  
  // Format dates
  if (value instanceof Date || String(value).match(/^\d{4}-\d{2}-\d{2}/)) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return String(value);
    }
  }
  
  // Truncate long strings
  const str = String(value);
  return str.length > 30 ? str.substring(0, 27) + '...' : str;
}

/**
 * Generates a descriptive chart title from the question
 */
function generateChartTitle(question, chartType) {
  // Extract key phrases from question
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('top')) return 'Top Opportunities';
  if (lowerQ.includes('compare') || lowerQ.includes('comparison')) return 'Comparison';
  if (lowerQ.includes('trend') || lowerQ.includes('over time')) return 'Trend Analysis';
  if (lowerQ.includes('distribution') || lowerQ.includes('breakdown')) return 'Distribution';
  if (lowerQ.includes('performance')) return 'Performance Metrics';
  if (lowerQ.includes('historical') || lowerQ.includes('history')) return 'Historical Data';
  
  // Default titles based on chart type
  const defaults = {
    'time series': 'Time Series',
    'comparison': 'Comparison',
    'distribution': 'Distribution',
    'metrics': 'Key Metrics'
  };
  
  return defaults[chartType] || 'Data Visualization';
}

export default {
  shouldGenerateChart,
  detectChartType,
  formatChartData
};

