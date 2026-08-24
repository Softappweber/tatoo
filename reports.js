constructor() {
        this.reports = [];
        this.initialize();
    }

    async initialize() {
        await this.loadReports();
        this.setupEventListeners();
    }

    async loadReports() {
        try {
            const response = await fetch('/api/analytics/reports', {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load reports');
            }

            this.reports = await response.json();
            this.renderReports();
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    }

    async generateReport(type) {
        try {
            const response = await fetch('/api/analytics/reports/generate', {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ type })
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const report = await response.json();
            await this.loadReports();
            this.downloadReport(report);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    }

    renderReports() {
        const container = document.getElementById('reportsList');
        container.innerHTML = this.reports.map(report => `
            <div class="report-item">
                <div class="report-icon">📊</div>
                <div class="report-info">
                    <h4>${report.title}</h4>
                    <span>Generated: ${new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div class="report-actions">
                    <button onclick="reportGenerator.downloadReport(${report.id})">Download</button>
                    <button onclick="reportGenerator.deleteReport(${report.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async downloadReport(reportId) {
        try {
            const response = await fetch(`/api/analytics/reports/${reportId}/download`, {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${reportId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    }

    async deleteReport(reportId) {
        try {
            const response = await fetch(`/api/analytics/reports/${reportId}`, {
                method: 'DELETE',
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete report');
            }

            await this.loadReports();
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('generateReport').addEventListener('click', () => {
            const type = document.getElementById('reportType').value;
            this.generateReport(type);
        });
    }
}

const reportGenerator = new ReportGenerator();

html

<!-- File 18: login.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Instagram CRM</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #405DE6 0%, #5851DB 25%, #833AB4 50%, #C13584 75%, #E1306C 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .login-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .login-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #262626;
            margin-bottom: 0.5rem;
        }

        .login-subtitle {
            color: #8e8e8e;
            font-size: 0.875rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #262626;
        }

        .form-group input {
            width: 100%;
            padding: 0.875rem;
            border: 1px solid #dbdbdb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #405DE6;
        }

        .login-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(45deg, #405DE6, #5851DB);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.3s;
        }

        .login-btn:hover {
            opacity: 0.9;
        }

        .login-footer {
            text-align: center;
            margin-top: 1.5rem;
            color: #8e8e8e;
        }

        .login-footer a {
            color: #405DE6;
            text-decoration: none;
            font-weight: 500;
        }

        .error-message {
            background: #fde8e8;
            color: #c81e1e;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">📸</div>
            <h1 class="login-title">Instagram CRM</h1>
            <p class="login-subtitle">Manage your Instagram presence efficiently</p>
        </div>

        <div class="error-message" id="errorMessage"></div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="login-btn">Sign In</button>
        </form>

        <div class="login-footer">
            <p>Don't have an account? <a href="#" id="showRegister">Register here</a></p>
        </div>
    </div>

    <script src="login.js"></script>
</body>
</html>

javascript