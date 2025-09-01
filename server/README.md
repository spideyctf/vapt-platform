# VAPT Platform Backend Server

A Node.js and Express backend server that integrates with OWASP ZAP for web application vulnerability scanning.

## Features

- **ZAP Integration**: Connects to OWASP ZAP API for automated security scanning
- **Real-time Scanning**: Initiates spider and active scans on target URLs
- **Progress Monitoring**: Polls scan status and retrieves results
- **Comprehensive Reporting**: Returns detailed vulnerability reports with risk levels
- **Error Handling**: Robust error handling with detailed logging

## API Endpoints

### 1. `POST /api/start-scan`

Initiates a new ZAP scan on the specified target URL.

**Request Body:**
```json
{
  "targetUrl": "https://example.com"
}
```

**Response:**
```json
{
  "scanId": "12345",
  "message": "ZAP scan started successfully",
  "spiderScanId": "12345",
  "activeScanId": "67890"
}
```

### 2. `GET /api/scan-status/:scanId`

Checks the status of an ongoing scan and returns results when complete.

**Response (in progress):**
```json
{
  "status": "in-progress",
  "spiderProgress": "75",
  "activeScanProgress": "50",
  "message": "ZAP scan in progress"
}
```

**Response (completed):**
```json
{
  "status": "succeeded",
  "report": {
    "site": [{
      "alerts": [
        {
          "alert": "Cross-site Scripting (Reflected)",
          "url": "https://example.com/search",
          "riskdesc": "High",
          "riskcode": "3",
          "description": "Cross-site scripting vulnerability found",
          "solution": "Sanitize user input"
        }
      ]
    }]
  },
  "message": "ZAP scan completed successfully"
}
```

### 3. `GET /api/test-zap-connection`

Tests the connection to the ZAP API and tries different authentication methods.

**Response:**
```json
{
  "status": "success",
  "message": "ZAP API connection successful",
  "data": {
    "version": "2.14.0"
  }
}
```

### 4. `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "VAPT Platform Backend Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

The server uses the following configuration:

- **Port**: 3001 (default, can be set via PORT environment variable)
- **ZAP API Key**: `q1uvd9crju662p4ere2l91cs44` (default, can be set via ZAP_API_KEY environment variable)
- **ZAP API Base URL**: `http://localhost:8080/JSON` (default, can be set via ZAP_API_BASE_URL environment variable)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For development with auto-restart:
   ```bash
   npm run dev
   ```

## ZAP Integration Details

The backend integrates with OWASP ZAP through the following workflow:

1. **URL Access**: Adds the target URL to ZAP's site tree
2. **Spider Scan**: Crawls the website to discover pages and endpoints
3. **Active Scan**: Performs active vulnerability testing on discovered resources
4. **Alert Retrieval**: Fetches and formats vulnerability alerts when scans complete

The API key is passed as a query parameter (`apikey`) to all ZAP API requests.

## Error Handling

The server includes comprehensive error handling:

- **Connection Errors**: Detailed logging of ZAP API connection issues
- **Authentication Errors**: Multiple authentication method testing
- **Scan Errors**: Graceful handling of scan failures
- **Timeout Handling**: Proper cleanup of polling intervals

## Logging

The server provides detailed console logging for:

- ZAP API connection attempts
- Scan initiation and progress
- Error details and debugging information
- Authentication method testing results
