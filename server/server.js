import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { nanoid } from 'nanoid';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------------------
// Helper: Use standard ZAP API with progress tracking and comprehensive alert collection
// ----------------------------------------------------------------------------------
const ZAP_URL   = 'http://localhost:8080';
const ZAP_KEY   = 'q1uvd9crju662p4ere2l91cs44';

// In-memory storage for scan progress and results
const scanResults = new Map();

async function runZapScan(target, scanId) {
  try {
    console.log('Starting ZAP scan for:', target, 'with ID:', scanId);
    
    // Update status to starting
    scanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Starting ZAP scan...',
      spiderProgress: 0,
      activeScanProgress: 0
    });
    
    // Step 1: Access the target URL to add it to ZAP's site tree
    console.log('Step 1: Accessing target URL...');
    const accessResponse = await fetch(`${ZAP_URL}/JSON/core/action/accessUrl/?apikey=${ZAP_KEY}&url=${encodeURIComponent(target)}`);
    if (!accessResponse.ok) throw new Error('Failed to access target URL');
    console.log('Access URL response:', await accessResponse.json());

    // Update status
    scanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Target URL accessed, starting spider scan...',
      spiderProgress: 0,
      activeScanProgress: 0
    });

    // Step 2: Start the spider scan
    console.log('Step 2: Starting spider scan...');
    const spiderResponse = await fetch(`${ZAP_URL}/JSON/spider/action/scan/?apikey=${ZAP_KEY}&url=${encodeURIComponent(target)}`);
    if (!spiderResponse.ok) throw new Error('Failed to start spider scan');
    const spiderData = await spiderResponse.json();
    console.log('Spider scan response:', spiderData);
    
    const spiderScanId = spiderData.scan;

    // Step 3: Start the active scan
    console.log('Step 3: Starting active scan...');
    const activeScanResponse = await fetch(`${ZAP_URL}/JSON/ascan/action/scan/?apikey=${ZAP_KEY}&url=${encodeURIComponent(target)}`);
    if (!activeScanResponse.ok) throw new Error('Failed to start active scan');
    const activeScanData = await activeScanResponse.json();
    console.log('Active scan response:', activeScanData);

    const activeScanId = activeScanData.scan;

    // Update status
    scanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Both scans started, monitoring progress...',
      spiderProgress: 0,
      activeScanProgress: 0
    });

    // Monitor spider scan progress
    while (true) {
      const spiderStatus = await fetch(`${ZAP_URL}/JSON/spider/view/status/?apikey=${ZAP_KEY}&scanId=${spiderScanId}`);
      const spiderStatusData = await spiderStatus.json();
      console.log('Spider status:', spiderStatusData);
      
      const spiderProgress = parseInt(spiderStatusData.status) || 0;
      
      // Update progress
      const currentStatus = scanResults.get(scanId);
      scanResults.set(scanId, { 
        ...currentStatus,
        spiderProgress: spiderProgress,
        message: `Spider scan: ${spiderProgress}%, Active scan: ${currentStatus.activeScanProgress}%`
      });
      
      if (spiderProgress === 100) break;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Check every 2 seconds
    }

    // Monitor active scan progress
    while (true) {
      const activeStatus = await fetch(`${ZAP_URL}/JSON/ascan/view/status/?apikey=${ZAP_KEY}&scanId=${activeScanId}`);
      const activeStatusData = await activeStatus.json();
      console.log('Active scan status:', activeStatusData);
      
      const activeProgress = parseInt(activeStatusData.status) || 0;
      
      // Update progress
      const currentStatus = scanResults.get(scanId);
      scanResults.set(scanId, { 
        ...currentStatus,
        activeScanProgress: activeProgress,
        message: `Spider scan: 100%, Active scan: ${activeProgress}%`
      });
      
      if (activeProgress === 100) break;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Check every 2 seconds
    }

    // Get alerts from ZAP - collect ALL alerts more comprehensively
    console.log('Getting alerts...');
    
    // Method 1: Get alerts without baseurl filter (all alerts)
    let alertsResponse = await fetch(`${ZAP_URL}/JSON/core/view/alerts/?apikey=${ZAP_KEY}`);
    if (!alertsResponse.ok) {
      console.log('Method 1 failed, trying alternative...');
      // Method 2: Try with empty baseurl
      alertsResponse = await fetch(`${ZAP_URL}/JSON/core/view/alerts/?apikey=${ZAP_KEY}&baseurl=`);
    }
    
    if (!alertsResponse.ok) {
      console.log('Method 2 failed, trying with target URL...');
      // Method 3: Try with the specific target URL
      alertsResponse = await fetch(`${ZAP_URL}/JSON/core/view/alerts/?apikey=${ZAP_KEY}&baseurl=${encodeURIComponent(target)}`);
    }
    
    if (!alertsResponse.ok) {
      throw new Error(`Failed to get alerts: ${alertsResponse.status} ${alertsResponse.statusText}`);
    }
    
    const alertsData = await alertsResponse.json();
    console.log('Alerts response:', alertsData);
    console.log('Total alerts found:', alertsData.alerts ? alertsData.alerts.length : 0);
    
    // Log some sample alerts for debugging
    if (alertsData.alerts && alertsData.alerts.length > 0) {
      console.log('Sample alerts:');
      alertsData.alerts.slice(0, 3).forEach((alert, index) => {
        console.log(`Alert ${index + 1}:`, {
          name: alert.alert,
          risk: alert.riskdesc,
          url: alert.url
        });
      });
    } else {
      console.log('No alerts found - this might indicate an issue');
    }

    // Format the response to match the expected structure
    const formattedReport = {
      site: [{
        alerts: alertsData.alerts || []
      }]
    };

    // Update with final results
    scanResults.set(scanId, { 
      status: 'succeeded', 
      message: 'ZAP scan completed successfully!',
      spiderProgress: 100,
      activeScanProgress: 100,
      report: formattedReport
    });

    console.log('ZAP scan completed for:', target);
    
  } catch (error) {
    console.error('Error in ZAP scan:', error);
    scanResults.set(scanId, { 
      status: 'failed', 
      message: error.message || 'ZAP scan failed',
      spiderProgress: 0,
      activeScanProgress: 0
    });
  }
}

// ----------------------------------------------------------------------------------
// REST endpoints
// ----------------------------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VAPT Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start ZAP scan - returns scanId immediately for frontend polling
app.post('/api/start-scan', async (req, res) => {
  const { targetUrl } = req.body;
  if (!targetUrl) return res.status(400).json({ message: 'targetUrl required' });

  try {
    // Generate a unique scan ID
    const scanId = nanoid(8);
    
    // Initialize scan status
    scanResults.set(scanId, { 
      status: 'starting', 
      message: 'Initializing ZAP scan...',
      spiderProgress: 0,
      activeScanProgress: 0
    });
    
    // Start the ZAP scan in the background
    runZapScan(targetUrl, scanId);
    
    // Return the scan ID immediately
    res.json({ 
      scanId: scanId,
      message: 'ZAP scan started successfully'
    });
    
  } catch (error) {
    console.error('Error starting ZAP scan:', error);
    res.status(500).json({ 
      status: 'failed', 
      message: error.message || 'Failed to start ZAP scan'
    });
  }
});

// Check scan status and progress - frontend polls this endpoint
app.get('/api/scan-status/:scanId', async (req, res) => {
  const { scanId } = req.params;
  
  const result = scanResults.get(scanId);
  if (!result) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  res.json(result);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`VAPT Backend Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
