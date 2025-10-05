# 📊 Chart System - Complete Setup Guide

## ✅ What's Been Implemented

### 1. **Chart Rendering Component** (`src/components/ChartRenderer.tsx`)
- Beautiful Recharts-based visualizations
- Supports 4 chart types: Line, Bar, Pie, Area
- Emerald green theme matching your app
- Responsive design
- Custom tooltips with hover effects

### 2. **Backend Chart Generator** (`backend/lib/chart-generator.js`)
- **Intelligent chart detection** - automatically determines when to show charts
- **Smart chart type selection** based on data structure:
  - **Line/Area**: Time series data (dates + metrics)
  - **Bar**: Comparisons (categories + metrics)
  - **Pie**: Distributions (categories + percentages)
- **Auto-formatting** of data for optimal display

### 3. **Streaming Integration** (`backend/api/query.js`)
- Charts stream as part of the SSE response
- New chunk type: `'chart'`
- Charts appear instantly after data loads

### 4. **Frontend Integration** (`src/app/chat/page.tsx`)
- Handles `chart` chunks from backend
- Renders charts inline with AI responses
- Stores chart configs in message history

---

## 🚀 How It Works

### Backend Flow:
1. User asks a question
2. Backend generates SQL and fetches data
3. **Chart generator analyzes the data**:
   - Checks if question contains chart keywords (`compare`, `trend`, `show`, etc.)
   - Detects data structure (time series, categories, distributions)
   - Generates appropriate chart config
4. Chart config is sent as a stream chunk
5. Answer is generated and streamed

### Frontend Flow:
1. Frontend receives `chart` chunk
2. Updates message with chart config
3. `ChartRenderer` component displays the chart
4. Chart appears above the AI's text response

---

## 🎯 Test Questions - Guaranteed to Show Charts

### **Time Series (Line/Area Charts)**

```
Show me ETH lending rates over time
```
```
What's the historical trend of USDC supply APY?
```
```
Display BTC price changes over the last month
```
```
Chart Aave V3 utilization rates over time
```

### **Comparisons (Bar Charts)**

```
Compare lending rates across protocols
```
```
Show me the top 10 pools by TVL
```
```
Which protocols have the best USDC lending rates?
```
```
Compare WETH-USDC pools across different DEXes
```
```
Show me the highest yielding opportunities
```

### **Distributions (Pie Charts)**

```
Show me the distribution of TVL across protocols
```
```
What's the market share breakdown of top DEXes?
```
```
Display the percentage distribution of lending protocols
```

### **Generic Chart Triggers** (will auto-detect type)

```
Chart the best opportunities
```
```
Visualize top lending protocols
```
```
Graph the performance of major pools
```
```
Plot USDC rates
```

---

## 🧠 Smart Detection

The system automatically generates charts when:

1. **Question contains chart keywords**:
   - `chart`, `graph`, `plot`, `visualize`, `show me`
   - `compare`, `trend`, `history`, `historical`
   - `top`, `best`, `highest`, `distribution`

2. **Query intent suggests visualization**:
   - `comparison` - Shows bar charts
   - `trend_analysis` - Shows line charts
   - `top_opportunities` - Shows bar charts
   - `historical_query` - Shows time series

3. **Data structure is suitable**:
   - At least 2 data points
   - Mix of categories/dates and numeric values
   - Not too many categories (limits to 15 for readability)

---

## 📝 Chart Types & When They're Used

### 1. **Line Chart** 🔵
**When**: Time series data (dates + metrics)
```javascript
// Example data structure:
[
  { date: '2024-01-01', apy: 5.2, tvl: 1000000 },
  { date: '2024-01-02', apy: 5.4, tvl: 1100000 },
]
```
**Triggers**: Questions with "over time", "trend", "historical"

### 2. **Bar Chart** 📊
**When**: Categorical comparisons
```javascript
// Example data structure:
[
  { protocol: 'Aave', apy: 5.2 },
  { protocol: 'Compound', apy: 4.8 },
]
```
**Triggers**: "compare", "top", "best", "highest"

### 3. **Pie Chart** 🥧
**When**: Distributions/percentages
```javascript
// Example data structure:
[
  { protocol: 'Aave', share: 45 },
  { protocol: 'Compound', share: 30 },
]
```
**Triggers**: "distribution", "breakdown", "share", "percentage"

### 4. **Area Chart** 📈
**When**: Time series with emphasis on volume
```javascript
// Same as line chart but with filled area
```
**Triggers**: Question contains "area" + time series data

---

## 🎨 Customization Options

### Change Colors
Edit `EMERALD_COLORS` in `/src/components/ChartRenderer.tsx`:
```typescript
const EMERALD_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  // Add more colors...
];
```

### Adjust Chart Detection
Edit `/backend/lib/chart-generator.js`:
```javascript
// Add more chart trigger keywords
const chartKeywords = [
  'chart', 'graph', 'plot', // ... add yours
];

// Change data point limits
data: formatChartData(rows.slice(0, 15), ...) // Change 15 to your limit
```

### Force Charts On/Off
In `/backend/lib/chart-generator.js`:
```javascript
// Always show charts for questions with specific keywords
if (lowerQuestion.includes('your_keyword')) {
  return detectChartType(rows, columns, question);
}

// Never show charts for certain patterns
if (lowerQuestion.includes('no_chart')) {
  return null;
}
```

---

## 🐛 Troubleshooting

### Chart not showing?

**1. Check browser console** for errors:
```bash
# Look for:
- "Failed to parse SSE data"
- ChartRenderer errors
- Missing data fields
```

**2. Enable debug mode** in chat:
- Click "Debug Info" under AI response
- Check if `chart` data is present

**3. Verify data structure**:
- Need at least 2 rows
- Need at least 2 columns
- At least one numeric column

**4. Check backend logs**:
```bash
# If deploying to Vercel, check logs for:
- "shouldGenerateChart" calls
- Chart config generation
```

### Chart showing wrong type?

**Edit chart detection logic**:
```javascript
// backend/lib/chart-generator.js
function detectChartType(rows, columns, question) {
  // Add your custom logic here
  if (question.includes('my_special_case')) {
    return { type: 'bar', ... };
  }
  // ... rest of detection
}
```

### Data formatting issues?

**Check format functions**:
```javascript
// backend/lib/chart-generator.js

formatLabel(value)    // Formats axis labels
sanitizeKey(key)      // Cleans column names
formatChartData(...)  // Transforms DB rows to chart data
```

---

## 🎓 Advanced Usage

### Custom Presentation Hints

You can force specific chart types:
```typescript
// In frontend
await queryBackendStream(question, {
  presentationHint: 'bar_chart' // or 'line_chart', 'pie_chart', 'area_chart'
});
```

### Multiple Charts in One Response

Currently shows 1 chart per response. To show multiple:
1. Modify backend to return array of charts
2. Update `StreamChunk` type to support `charts: ChartConfig[]`
3. Render multiple `<ChartRenderer>` components

### Export Charts

Add export button to `ChartRenderer.tsx`:
```typescript
const handleExport = () => {
  // Use recharts export utilities
  // Or implement custom image/PDF export
};
```

---

## 📊 Example Questions by Use Case

### DeFi Analytics
```
Compare Aave V3 lending rates across all assets
Show me TVL distribution across top protocols
Chart ETH lending rate trends over the last week
Which pools have the highest APY? Show me a chart
```

### Portfolio Analysis
```
Visualize my portfolio performance
Show me allocation breakdown
Chart my returns over time
Compare my positions across protocols
```

### Market Research
```
Show me the top 20 pools by TVL
Chart token price movements
Compare DEX volumes across chains
Display market share of major protocols
```

---

## 🚀 Deployment

### 1. Deploy Backend Changes
```bash
cd backend
# Commit your changes
git add .
git commit -m "Add chart support"
git push

# If using Vercel:
vercel --prod
```

### 2. Test Backend
```bash
curl -X POST https://your-backend.vercel.app/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Compare top lending protocols", "stream": true}'
```

### 3. Update Frontend Environment
```bash
# .env.local
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend.vercel.app
```

### 4. Deploy Frontend
```bash
npm run build
# Deploy to your hosting (Vercel, etc.)
```

---

## 📈 Performance Notes

- **Charts are cached** in message history
- **Data limited** to reasonable sizes (15 bars, 8 pie slices)
- **Streaming** ensures fast initial response
- **Lazy rendering** - charts only render when visible

---

## 🎉 You're All Set!

Your chart system is now fully integrated! Try asking:

> **"Compare the top 10 lending protocols by APY"**

You should see:
1. ⚡ Fast SQL execution
2. 📊 Beautiful bar chart
3. 💬 AI explanation of the data

---

## 🔗 Key Files

- `/src/components/ChartRenderer.tsx` - Chart display component
- `/backend/lib/chart-generator.js` - Chart detection logic
- `/backend/api/query.js` - Streaming integration (line 258)
- `/src/app/chat/page.tsx` - Chart handling (line 378)
- `/src/lib/api.ts` - Type definitions

---

## 💡 Pro Tips

1. **Use specific questions** for better charts ("Compare X" vs "Tell me about X")
2. **Combine with debug info** to see raw data
3. **Test with different data sizes** to see auto-formatting
4. **Charts work offline** - they're pure React components

Happy charting! 📊✨

