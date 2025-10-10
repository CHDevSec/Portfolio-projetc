# Enterprise Endpoint and Network Detection Program

## Technical Documentation

[![MITRE ATT&CK](https://img.shields.io/badge/MITRE-ATT%26CK%20v13-red.svg)](https://attack.mitre.org/)
[![NIST](https://img.shields.io/badge/NIST-800--61r2-blue.svg)](https://www.nist.gov/)
[![ISO](https://img.shields.io/badge/ISO-27035-green.svg)](https://www.iso.org/)
[![Status](https://img.shields.io/badge/Status-Production-success.svg)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture-overview)
- [Core Components](#-core-components)
- [SentinelOne EDR/XDR](#️-sentinelone--endpoint-detection-and-response)
- [Threat Hunting Operations](#️-threat-hunting-operations--apura-intelligence)
- [Netskope DLP](#-netskope--network--dlp-layer)
- [SIEM Integration](#-siem-integration--wazuh--elk-stack)
- [SOAR & Automation](#-soar--automation)
- [Security Framework](#-security-framework-alignment)
- [KPIs & Reporting](#-kpis--reporting)
- [Operational Routine](#-operational-routine)
- [Benefits](#-benefits)

---

## 📘 Overview

The **Enterprise Endpoint and Network Detection Program** is a unified **EDR, XDR, and DLP ecosystem** designed to enhance visibility, containment, and threat response across all corporate assets.

This program integrates **SentinelOne**, **Netskope**, **Apura Threat Intelligence**, and **Wazuh/ELK** under a single operational framework, enabling:

- 🎯 Real-time detection and response
- 🔍 Proactive threat hunting
- 🛡️ Data loss prevention
- 📊 Centralized security operations
- 🤖 Automated incident response

The architecture centralizes endpoint telemetry, network data, and threat intelligence to provide **360° situational awareness**, automated response, and continuous behavioral analysis aligned with the **MITRE ATT&CK framework**.

---

## 🧠 Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    SECURITY ECOSYSTEM                    │
└─────────────────────────────────────────────────────────┘

[ENDPOINTS]
    ↓
[SentinelOne EDR/XDR]
    │
    ├─→ Behavioral Detection
    ├─→ Autonomous Response
    └─→ Root Cause Analysis

[NETWORK TRAFFIC]
    ↓
[Netskope (DLP + Tunnel Proxy)]
    │
    ├─→ Traffic Inspection
    ├─→ DLP Enforcement
    └─→ CASB Controls

[THREAT FEEDS]
    ↓
[Apura Threat Intelligence]
    │
    ├─→ IOC Ingestion
    ├─→ MITRE Mapping
    └─→ Campaign Tracking

[CENTRALIZATION]
    ↓
[Wazuh + ELK Stack]
    │
    ├─→ Log Correlation
    ├─→ SIEM Dashboards
    └─→ Alerting Engine

[RESPONSE]
    ↓
[ANALYSTS / SOAR PLAYBOOKS]
    │
    ├─→ Automated Containment
    ├─→ Incident Response
    └─→ Threat Hunting
```

---

## 🔧 Core Components

| Component | Role | Description |
|-----------|------|-------------|
| **SentinelOne EDR/XDR** | Endpoint Detection & Response | Behavioral detection, exploit mitigation, automated containment, and root cause analysis |
| **Netskope (DLP & Tunnel)** | Network & Data Protection | Inspects cloud and network traffic, enforces DLP policies, and tunnels all HTTP/HTTPS data securely through corporate proxy |
| **Apura Threat Intelligence** | Threat Hunting & Correlation | Ingests threat intelligence feeds (IOC, malware indicators, campaigns like BBTok), mapped to ATT&CK TTPs for proactive hunting |
| **Wazuh + ELK Stack** | SIEM Centralization | Central repository for endpoint, network, and threat logs; correlation, dashboards, and alerting for SOC operations |

---

## ⚙️ SentinelOne – Endpoint Detection and Response

### 🎯 Capabilities

- **Behavioral AI-based Detection**: Identifies malicious execution chains, privilege escalation, and lateral movement
- **Autonomous Response**: Real-time containment, rollback, and remediation at endpoint level
- **Threat Visibility**: Root cause visualization through storyline mapping
- **Kernel-level Protection**: Detects exploits and memory injections
- **EDR Telemetry Export**: Continuous event streaming to SIEM and Wazuh
- **Vulnerability Intelligence**: Integration with internal vulnerability management pipelines

### 🔐 Policies & Control

Endpoint policies segmented by **Operating System** (Windows, macOS, Linux):

**Configuration includes:**
- ✅ Real-time behavioral AI protection
- ✅ USB device control and script execution restrictions
- ✅ Autonomous response level 3 (containment + remediation)
- ✅ Dynamic exclusion lists managed via API and Node-RED automation

### 🌐 XDR Extension

**Collects and correlates telemetry from:**
- Windows Event Logs
- Sysmon (Linux/macOS)
- Cloud workloads (AWS / GCP)

**Capabilities:**
- Enrichment with threat intelligence indicators from Apura and Netskope events
- Real-time forwarding to Wazuh/ELK for centralized analysis
- Cross-platform detection correlation

---

## 🕵️ Threat Hunting Operations – Apura Intelligence

### 📡 Threat Intelligence Integration

- **Continuous ingestion** of IOCs (IP, SHA256, domain) from Apura Threat Feeds
- IOCs automatically **normalized and mapped** to MITRE ATT&CK TTPs
- Integrated with SentinelOne via custom playbooks to enrich detections with threat context

**Supports:**
- BBTok, Grandoreiro, FakeUpdates, RAT campaigns
- Brazilian threat landscape correlation (banking trojans, stealer families)
- Advanced persistent threats (APTs)
- Zero-day exploit tracking

### 🔍 Threat Hunting Procedures

**Weekly manual and automated hunts in SentinelOne:**

```
✓ Query for suspicious PowerShell and LOLBins usage
✓ Search for abnormal process ancestry patterns
✓ Correlate network anomalies from Netskope tunnels
✓ Validate findings with Apura threat context
```

All findings enriched in **Wazuh/ELK dashboards** under "Threat Hunting - IOC Mapping"

### 🤖 Automation

- **Node-RED** orchestrates periodic ingestion of threat indicators
- Indicators are pushed into Wazuh via REST API for correlation
- Historical campaigns maintained in an internal IOC repository with timestamps and severity
- Automated enrichment of detections with threat intelligence context

---

## 🌐 Netskope – Network & DLP Layer

### 🛡️ Data Protection & Network Control

All user traffic (HTTP/HTTPS) is routed through **Netskope Tunnel** (GRE/IPSec):

**Enforces Data Loss Prevention (DLP) policies and CASB controls for:**
- 🚫 Sensitive data exfiltration prevention
- 🚫 Unapproved app usage detection
- 🚫 Real-time file inspection and blocking
- ✅ Integrated with corporate identity provider (Google Workspace) for user-based attribution

### ⚠️ Threat Prevention

**Inspects downloads and file uploads in real time** using Netskope's advanced heuristics.

**Detects anomalies such as:**
- Suspicious IP tunneling
- Cloud app data exfiltration attempts
- Lateral data transfer between sanctioned and unsanctioned SaaS
- Blocks based on policy risk score thresholds

### 🔗 Integration

**Netskope alerts are exported to Wazuh/ELK via Syslog or API**

**Alerts tagged with:**
- 👤 User Identity
- 📱 App Name
- 🔖 Policy ID
- ⚠️ Risk Category

---

## 📊 SIEM Integration – Wazuh + ELK Stack

### 🏗️ Architecture

| Component | Function |
|-----------|----------|
| **Wazuh Manager** | Receives and correlates endpoint and network logs |
| **Filebeat & Logstash** | Collect and normalize logs from SentinelOne, Netskope, and Apura |
| **Elasticsearch** | Central data repository for analysis, dashboards, and hunting queries |
| **Kibana** | Visualization and alerting interface |

### 🔄 Data Flow

```text
[SentinelOne → Wazuh Agent] 
         ↓
[Netskope → Syslog Collector]
         ↓
[Apura → IOC API Feed]
         ↓
[Logstash → Elasticsearch]
         ↓
[Kibana Dashboards & Alerts]
```

### ⚡ Correlation Rules

**MITRE ATT&CK mapping for:**
- `T1059` - Command and Scripting Interpreter
- `T1047` - Windows Management Instrumentation
- `T1218` - System Binary Proxy Execution
- Multi-vector detections (EDR + Network + Threat Intel)

**Features:**
- Automated alert generation for complex attack chains
- Alert triage playbooks triggered in SOAR for incident response
- Contextual enrichment with threat intelligence

### 📈 Dashboards

| Dashboard | Purpose |
|-----------|---------|
| **EDR/XDR Overview** | Endpoint status, policy compliance, detection trends |
| **Network DLP Overview** | Tunnel performance, blocked exfiltration attempts |
| **Threat Hunting** | IOC correlation (SentinelOne + Apura) |
| **SIEM Health** | Log ingestion rate, backlog, and event anomalies |

---

## 🤖 SOAR & Automation

The platform integrates with **Node-RED** and custom SOAR workflows to automate:

### 🔄 Automated Response Workflows

```
✓ Isolation of infected endpoints upon SentinelOne alert
✓ Slack notification to #infrasec with contextual IOC information
✓ Automated IOC enrichment using Apura and internal hash database
✓ Ticket creation in Jira for confirmed incidents
✓ Automated evidence collection and forensic artifact preservation
```

**Trigger Mechanisms:**
- Webhooks from SentinelOne detection engine
- Wazuh event listeners with custom rule thresholds
- Manual analyst-initiated playbooks via API

**Benefits:**
- Reduces manual analyst workload by ~45%
- Ensures consistent response procedures
- Accelerates time-to-containment

---

## 🔐 Security Framework Alignment

All detection, response, and hunting processes are aligned with industry standards:

| Framework | Version | Application |
|-----------|---------|-------------|
| **MITRE ATT&CK** | v13 | Threat detection mapping and hunting procedures |
| **NIST 800-61r2** | Revision 2 | Incident handling lifecycle |
| **ISO 27035** | 2016 | Incident management processes |
| **NIST CSF** | v1.1 | Detect & Respond Functions |

### 🎯 Coverage Highlights

- **Detection Coverage**: 85%+ of ATT&CK techniques mapped
- **Response Maturity**: Level 4 (Managed and Measurable)
- **Compliance**: SOC 2 Type II, PCI-DSS controls

---

## 📈 KPIs & Reporting

| Metric | Description | Target |
|--------|-------------|--------|
| **Mean Time to Detect (MTTD)** | Average time between event occurrence and detection | < 5 minutes |
| **Mean Time to Respond (MTTR)** | Average time to contain and remediate threats | < 15 minutes |
| **EDR Coverage Rate** | Percentage of protected endpoints | > 99% |
| **Tunnel Uptime** | Availability of Netskope secure tunnel | 99.9% |
| **DLP Incidents Prevented** | Blocked data exfiltration attempts | Tracked weekly |
| **IOC Match Rate** | Number of correlated IOC detections (Apura vs EDR/SIEM) | Monitored daily |

---

## 📅 Operational Routine

| Task | Frequency | Owner |
|------|-----------|-------|
| **Threat Intelligence Feed Update** | Daily | Apura → Wazuh |
| **SentinelOne EDR Data Sync** | Continuous | Agent/Cloud |
| **Node-RED Automation** | Weekly | Infrastructure Automation |
| **Netskope Policy Audit** | Monthly | Security Engineering |
| **Wazuh SIEM Report Generation** | Weekly | SOC Team |
| **Threat Hunting Campaigns** | Bi-weekly | Threat Intel Team |
| **Vulnerability Assessment Review** | Monthly | Security Engineering |
| **Incident Response Drills** | Quarterly | SOC + IR Team |

---

## 🚀 Benefits

### 🎯 Strategic Advantages

- ✅ **Unified visibility** across endpoint and network layers
- ✅ **Rapid detection-to-response** workflow with automated containment
- ✅ **Continuous intelligence enrichment** through Apura threat feeds
- ✅ **Centralized observability** via Wazuh + ELK Stack
- ✅ **Proactive threat hunting** aligned with MITRE ATT&CK
- ✅ **Data loss prevention** with real-time DLP enforcement

### 📊 Operational Impact

- 🔹 **45% reduction** in manual analyst workload through automation
- 🔹 **99%+ endpoint coverage** with autonomous response capabilities
- 🔹 **Sub-5-minute MTTD** for critical threats
- 🔹 **360° security posture** visibility in real-time dashboards
- 🔹 **Zero data loss incidents** since Netskope DLP implementation

---

<div align="center">

**🛡️ Built for Enterprise Security Excellence**

*Protecting Corporate Assets Through Integrated Detection and Response*

</div>