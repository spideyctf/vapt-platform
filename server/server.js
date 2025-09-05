import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { nanoid } from 'nanoid';
import multer from 'multer';
import { PORT, ZAP_URL, ZAP_KEY, MOBSF_URL, MOBSF_API_KEY } from './config.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept APK, IPA, and ZIP files
    const allowedTypes = ['.apk', '.ipa', '.zip'];
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only APK, IPA, and ZIP files are allowed'), false);
    }
  }
});

// ----------------------------------------------------------------------------------
// Helper: Use standard ZAP API with progress tracking and comprehensive alert collection
// ----------------------------------------------------------------------------------

// In-memory storage for scan progress and results
const scanResults = new Map();
const mobsfScanResults = new Map();

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
// Helper: MobSF API integration for mobile app scanning
// ----------------------------------------------------------------------------------
async function runMobsfScan(fileBuffer, fileName, scanId) {
  try {
    console.log('Starting MobSF scan for:', fileName, 'with ID:', scanId);
    
    // Update status to starting
    mobsfScanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Uploading file to MobSF...',
      progress: 0
    });
    
    // Step 1: Upload file to MobSF
    console.log('Step 1: Uploading file to MobSF...');
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), fileName);
    
    const uploadResponse = await fetch(`${MOBSF_URL}/api/v1/upload`, {
      method: 'POST',
      headers: {
        'Authorization': MOBSF_API_KEY,
        'X-Mobsf-Api-Key': MOBSF_API_KEY
      },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('Upload response:', uploadData);
    
    const hash = uploadData.hash;
    
    // Update status
    mobsfScanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'File uploaded, starting static analysis...',
      progress: 20,
      hash: hash
    });
    
    // Step 2: Start static analysis
    console.log('Step 2: Starting static analysis...');
    const staticResponse = await fetch(`${MOBSF_URL}/api/v1/scan`, {
      method: 'POST',
      headers: {
        'Authorization': MOBSF_API_KEY,
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hash: hash })
    });
    
    if (!staticResponse.ok) {
      throw new Error(`Failed to start static analysis: ${staticResponse.status} ${staticResponse.statusText}`);
    }
    
    const staticData = await staticResponse.json();
    console.log('Static analysis response:', staticData);
    
    // Update status
    mobsfScanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Static analysis in progress...',
      progress: 40,
      hash: hash
    });
    
    // Step 3: Monitor static analysis progress
    while (true) {
      const statusResponse = await fetch(`${MOBSF_URL}/api/v1/scan_status`, {
        method: 'POST',
        headers: {
          'Authorization': MOBSF_API_KEY,
          'X-Mobsf-Api-Key': MOBSF_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hash: hash })
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check scan status: ${statusResponse.status} ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      console.log('Scan status:', statusData);
      
      if (statusData.status === 'completed') {
        break;
      } else if (statusData.status === 'failed') {
        throw new Error('Static analysis failed');
      }
      
      // Update progress (static analysis typically takes 60% of total time)
      const currentProgress = 40 + (statusData.progress || 0) * 0.6;
      mobsfScanResults.set(scanId, { 
        status: 'in-progress', 
        message: `Static analysis: ${Math.round(currentProgress)}%`,
        progress: Math.round(currentProgress),
        hash: hash
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Check every 3 seconds
    }
    
    // Step 4: Start dynamic analysis (if supported)
    console.log('Step 4: Starting dynamic analysis...');
    const dynamicResponse = await fetch(`${MOBSF_URL}/api/v1/dynamic_scan_start`, {
      method: 'POST',
      headers: {
        'Authorization': MOBSF_API_KEY,
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hash: hash })
    });
    
    if (dynamicResponse.ok) {
      const dynamicData = await dynamicResponse.json();
      console.log('Dynamic analysis response:', dynamicData);
      
      // Update status
      mobsfScanResults.set(scanId, { 
        status: 'in-progress', 
        message: 'Dynamic analysis in progress...',
        progress: 70,
        hash: hash
      });
      
      // Monitor dynamic analysis
      while (true) {
        const dynamicStatusResponse = await fetch(`${MOBSF_URL}/api/v1/dynamic_scan_status`, {
          method: 'POST',
          headers: {
            'Authorization': MOBSF_API_KEY,
            'X-Mobsf-Api-Key': MOBSF_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ hash: hash })
        });
        
        if (!dynamicStatusResponse.ok) break;
        
        const dynamicStatusData = await dynamicStatusResponse.json();
        console.log('Dynamic scan status:', dynamicStatusData);
        
        if (dynamicStatusData.status === 'completed') {
          break;
        }
        
        // Update progress (dynamic analysis takes remaining 30%)
        const currentProgress = 70 + (dynamicStatusData.progress || 0) * 0.3;
        mobsfScanResults.set(scanId, { 
          status: 'in-progress', 
          message: `Dynamic analysis: ${Math.round(currentProgress)}%`,
          progress: Math.round(currentProgress),
          hash: hash
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Step 5: Get scan results
    console.log('Step 5: Getting scan results...');
    const reportResponse = await fetch(`${MOBSF_URL}/api/v1/report_json`, {
      method: 'POST',
      headers: {
        'Authorization': MOBSF_API_KEY,
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hash: hash })
    });
    
    if (!reportResponse.ok) {
      throw new Error(`Failed to get scan report: ${reportResponse.status} ${reportResponse.statusText}`);
    }
    
    const reportData = await reportResponse.json();
    console.log('Report data received, total findings:', reportData.findings ? Object.keys(reportData.findings).length : 0);
    
    // Update with final results
    mobsfScanResults.set(scanId, { 
      status: 'succeeded', 
      message: 'MobSF scan completed successfully!',
      progress: 100,
      hash: hash,
      report: reportData
    });
    
    console.log('MobSF scan completed for:', fileName);
    
  } catch (error) {
    console.error('Error in MobSF scan:', error);
    mobsfScanResults.set(scanId, { 
      status: 'failed', 
      message: error.message || 'MobSF scan failed',
      progress: 0
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
    timestamp: new Date().toISOString(),
    services: {
      zap: ZAP_URL,
      mobsf: MOBSF_URL
    }
  });
});

// Test MobSF connectivity
app.get('/api/test-mobsf', async (req, res) => {
  try {
    // Try to access the MobSF web interface to test basic connectivity
    const response = await fetch(`${MOBSF_URL}/`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok || response.status === 200) {
      res.json({ 
        status: 'OK', 
        message: 'MobSF server is reachable',
        url: MOBSF_URL,
        note: 'API endpoints will be tested when a scan is initiated'
      });
    } else {
      res.status(500).json({ 
        status: 'ERROR', 
        message: `MobSF server not reachable: ${response.status} ${response.statusText}`,
        url: MOBSF_URL
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: `MobSF connection error: ${error.message}`,
      url: MOBSF_URL,
      note: 'Make sure MobSF is running on the specified URL'
    });
  }
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

// Start MobSF scan - for mobile app analysis
app.post('/api/start-mobsf-scan', upload.single('app'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Mobile app file required' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileBuffer = file.buffer;

    // Generate a unique scan ID
    const scanId = nanoid(8);
    
    // Initialize scan status
    mobsfScanResults.set(scanId, { 
      status: 'starting', 
      message: 'Initializing MobSF scan...',
      progress: 0
    });
    
    // Start the MobSF scan in the background
    runMobsfScan(fileBuffer, fileName, scanId);
    
    // Return the scan ID immediately
    res.json({ 
      scanId: scanId,
      message: 'MobSF scan started successfully'
    });
    
  } catch (error) {
    console.error('Error starting MobSF scan:', error);
    res.status(500).json({ 
      status: 'failed', 
      message: error.message || 'Failed to start MobSF scan'
    });
  }
});

// Check MobSF scan status and progress
app.get('/api/mobsf-scan-status/:scanId', async (req, res) => {
  const { scanId } = req.params;
  
  const result = mobsfScanResults.get(scanId);
  if (!result) {
    return res.status(404).json({ error: 'MobSF scan not found' });
  }

  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`VAPT Backend Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`ZAP API: ${ZAP_URL}`);
  console.log(`MobSF API: ${MOBSF_URL}`);
});
