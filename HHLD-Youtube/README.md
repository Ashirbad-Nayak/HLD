# 🎬 YouStream - Adaptive Video Streaming Platform

A full-stack YouTube-style platform that allows users to upload, view, and search videos with **adaptive bitrate streaming (ABS)** powered by HLS, AWS S3, and FFmpeg. Users can also stream their webcam live (like Zoom). Built using modern technologies including **Next.js, Node.js, AWS, Kafka, and OpenSearch**.

---

## 🚀 Features

- 🌐 OAuth authentication (Google SSO) via `next-auth`
- 🎥 Upload video chunks directly to AWS S3 (multipart upload)
- 🧩 Chunked parallel upload for large files
- 📦 Metadata stored in PostgreSQL via Prisma ORM
- 🔄 Kafka for async message delivery to transcoding service
- 🔧 Transcoder service generates `.m3u8` and `.ts` files using `ffmpeg`
- 🧠 Search service with AWS Lambda + OpenSearch
- 🌎 Adaptive streaming (HLS) via pre-signed S3 URLs
- 🔍 Search by title or description via OpenSearch API
- 📡 Live stream from webcam using `getUserMedia`

---

## 🧩 Architecture Overview

### 1. **Client App (Next.js)**

- Displays video list (fetched from DB)
- Uses `ReactPlayer` and native `<video>` for playback
- Integrates Google Sign-In
- Allows uploading with title, description, and file
- Chunks video and uploads in parallel using multipart S3 upload APIs
- Calls `upload/initialize`, `upload`, and `upload/complete` endpoints sequentially

### 2. **Upload Service (Node.js)**

- `upload/initialize`: Gets upload ID from AWS S3
- `upload`: Uploads each chunk with metadata
- `upload/complete`:
  - Finalizes multipart upload
  - Saves metadata to PostgreSQL
  - Publishes Kafka message
  - Feeds metadata to AWS OpenSearch

### 3. **Transcoder Service**

- Consumes Kafka messages
- Downloads original video from S3
- Transcodes into multiple resolutions using `ffmpeg`
- Generates `.m3u8` master + resolution-specific playlists and `.ts` segments
- Uploads all output to a folder in S3
- Deletes temp local files

### 4. **Watch Service**

- Accepts a video key/name
- Generates a **pre-signed URL** to the master `.m3u8` HLS file from S3
- Returns this URL to the client

### 5. **Search Service**

- A serverless Node.js app zipped and deployed to AWS Lambda
- Integrates with OpenSearch using `@opensearch-project/opensearch`
- Query API exposed via AWS API Gateway (`/search?q=term`)
- Returns matched video metadata

---

## 🖥️ Technologies Used

 Layer | Stack |
-------|-------|
 Frontend | Next.js, Tailwind CSS, React Player, NextAuth (Google) |
 Backend | Node.js (Express), Prisma, Multer |
 Transcoding | `ffmpeg-static`, `fluent-ffmpeg` |
 Messaging | Apache Kafka |
 Search | AWS OpenSearch (formerly Elasticsearch) |
 Storage | AWS S3 |
 Streaming | HLS (Adaptive Bitrate Streaming) |
 Serverless | AWS Lambda, API Gateway |
 ORM & DB | Prisma ORM, PostgreSQL |

---

## 🧪 Testing the Search Lambda

Sample payload to test in AWS Lambda console:
```json
{
  "httpMethod": "GET",
  "path": "/search",
  "queryStringParameters": {
    "q": "test"
  },
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null,
  "isBase64Encoded": false
}
```
## 📺 Adaptive Bitrate Streaming
master.m3u8
├── 480p.m3u8 → [ts chunks]
├── 720p.m3u8 → [ts chunks]
└── 1080p.m3u8 → [ts chunks]

## 🧭 Navigation Flow
Home Page → List of videos

Sign In with Google → Auth using NextAuth

Upload Page → Fill form, upload large video in chunks

Backend:

Upload APIs → S3 multipart

Kafka → Notifies transcoder

Transcoder → HLS + S3 Upload

Watch Page → Client fetches pre-signed m3u8 URL → Streams via HLS

Search Page → Queries OpenSearch via API Gateway → Displays results


## 🌍 Deployment Notes
Hosted S3 buckets (with correct CORS for .ts and .m3u8)

AWS CloudFront for CDN distribution (optional)

Lambda + API Gateway used for serverless search

OpenSearch deployed on AWS with proper indexing/mapping

Prisma schema connected to RDS PostgreSQL


