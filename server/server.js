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
        // MobSF uses X-Mobsf-Api-Key; Authorization is not required
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
    
    // Step 2: Start static analysis (synchronous, form-encoded hash)
    console.log('Step 2: Starting static analysis...');
    const params = new URLSearchParams();
    params.append('hash', hash);
    const staticResponse = await fetch(`${MOBSF_URL}/api/v1/scan`, {
      method: 'POST',
      headers: {
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!staticResponse.ok) {
      throw new Error(`Failed to start static analysis: ${staticResponse.status} ${staticResponse.statusText}`);
    }
    
    const staticData = await staticResponse.json();
    console.log('Static analysis response:', staticData);
    
    // Update status to near-complete since scan is synchronous
    mobsfScanResults.set(scanId, { 
      status: 'in-progress', 
      message: 'Static analysis complete. Fetching report...',
      progress: 90,
      hash: hash
    });
    
    // Step 3: Get scan results
    console.log('Step 3: Getting scan results...');
    const reportParams = new URLSearchParams();
    reportParams.append('hash', hash);
    
    const reportResponse = await fetch(`${MOBSF_URL}/api/v1/report_json`, {
      method: 'POST',
      headers: {
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: reportParams.toString()
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

// Download MobSF PDF report
app.get('/api/mobsf-download-pdf/:scanId', async (req, res) => {
  try {
    const { scanId } = req.params;
    const scanResult = mobsfScanResults.get(scanId);
    
    if (!scanResult) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    if (scanResult.status !== 'succeeded' || !scanResult.hash) {
      return res.status(400).json({ error: 'Scan not completed or no hash available' });
    }
    
    console.log('Downloading PDF report for hash:', scanResult.hash);
    
    // Request PDF from MobSF - try different approaches
    let pdfResponse;
    
    // Method 1: Try with form data
    const pdfParams = new URLSearchParams();
    pdfParams.append('hash', scanResult.hash);
    
    pdfResponse = await fetch(`${MOBSF_URL}/api/v1/download_pdf`, {
      method: 'POST',
      headers: {
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: pdfParams.toString()
    });
    
    // If that fails, try Method 2: JSON format
    if (!pdfResponse.ok) {
      console.log('Form data failed, trying JSON format...');
      pdfResponse = await fetch(`${MOBSF_URL}/api/v1/download_pdf`, {
        method: 'POST',
        headers: {
          'X-Mobsf-Api-Key': MOBSF_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hash: scanResult.hash })
      });
    }
    
    // If that fails, try Method 3: GET with query params
    if (!pdfResponse.ok) {
      console.log('JSON format failed, trying GET with query params...');
      pdfResponse = await fetch(`${MOBSF_URL}/api/v1/download_pdf?hash=${scanResult.hash}`, {
        method: 'GET',
        headers: {
          'X-Mobsf-Api-Key': MOBSF_API_KEY
        }
      });
    }
    
    // If that fails, try Method 4: Try different endpoint format
    if (!pdfResponse.ok) {
      console.log('Standard API failed, trying alternative endpoint...');
      pdfResponse = await fetch(`${MOBSF_URL}/api/v1/report_pdf`, {
        method: 'POST',
        headers: {
          'X-Mobsf-Api-Key': MOBSF_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: pdfParams.toString()
      });
    }
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error('MobSF PDF download error:', {
        status: pdfResponse.status,
        statusText: pdfResponse.statusText,
        response: errorText
      });
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText} - ${errorText}`);
    }
    
    // Get the PDF buffer
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    // Set appropriate headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="mobsf-report-${scanId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    // Send the PDF
    res.send(Buffer.from(pdfBuffer));
    
    console.log('PDF report downloaded successfully for scan:', scanId);
    
  } catch (error) {
    console.error('Error downloading PDF report:', error);
    res.status(500).json({ 
      error: 'Failed to download PDF report',
      message: error.message 
    });
  }
});

// Test MobSF PDF download with a specific hash
app.get('/api/test-mobsf-pdf/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    console.log('Testing MobSF PDF download with hash:', hash);
    
    // Try the same methods as the download endpoint
    const pdfParams = new URLSearchParams();
    pdfParams.append('hash', hash);
    
    let pdfResponse = await fetch(`${MOBSF_URL}/api/v1/download_pdf`, {
      method: 'POST',
      headers: {
        'X-Mobsf-Api-Key': MOBSF_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: pdfParams.toString()
    });
    
    console.log('PDF response status:', pdfResponse.status);
    console.log('PDF response headers:', Object.fromEntries(pdfResponse.headers.entries()));
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.log('Error response:', errorText);
      return res.json({
        success: false,
        status: pdfResponse.status,
        error: errorText,
        method: 'form-data'
      });
    }
    
    res.json({
      success: true,
      status: pdfResponse.status,
      contentType: pdfResponse.headers.get('content-type'),
      method: 'form-data'
    });
    
  } catch (error) {
    console.error('Test PDF download error:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
