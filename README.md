# Monisick - Cloud Computing

## Base URL

```
https://monisick-backend-1035188713587.asia-southeast2.run.app
```
- [Backend API Documentation](https://drive.google.com/file/d/1rmNhB2Bpp4DyzQ0ZASfSwSfDqSuC3_Rq/view?usp=sharing)

## Cloud Technology Overview
Monisick leverages cutting-edge cloud technology provided by Google Cloud Platform (GCP). GCP provides a wide range of tools and infrastructure for building, deploying, and managing applications and services on the cloud. 

<img src="https://github.com/user-attachments/assets/34a53d61-5daf-4ba2-9697-16ff128b5801" alt="Google Cloud"/>

### **Cloud Run**
Cloud Run enables the deployment of highly scalable containerized applications in a fully managed serverless environment.

<img src="https://github.com/user-attachments/assets/36960dad-4022-455e-ade6-26a87c251df6" alt="Cloud Run" width="100"/>

```
Location : asia-southeast2 (Jakarta)  
Memory   : 512MiB  
vCPUs    : 1  
```

### **Cloud SQL**
Cloud SQL provides a fully-managed relational database service, ensuring reliability and scalability for application data.

<img src="https://github.com/user-attachments/assets/e5e1dee8-a6b5-4ba8-84c9-f3f5f79015fe" alt="Cloud SQL" width="100"/>

```
Database Type : mysql  
Version       : 8.0  
Memory        : 614.4 MB  
Storage       : 10 GB  
vCPUs         : 1  
```

### **Cloud Storage**
Cloud Storage is utilized for secure and reliable object storage with high availability and performance.

<img src="https://github.com/user-attachments/assets/8ab5fb4d-6350-4223-a2ea-95e5873a682d" alt="Cloud Storage" width="100"/>

```
Location Type : Region  
Location      : asia-southeast2 (Jakarta)  
Storage Class : Standard  
```

## Deployment Process

### Continuous Deployment from GitHub
Monisick utilizes Continuous Deployment to automatically build and deploy updates to Cloud Run whenever changes are pushed to the main branch.

#### Steps to Configure
1. **Connect Repository**:  
   Link your GitHub repository to Google Cloud Platform via the Cloud Build service.
   - Navigate to **Cloud Build** in the GCP Console.
   - Create a new trigger and select the repository to monitor.

2. **Build Configuration**:  
   Ensure a `cloudbuild.yaml` file exists in the root directory of your repository. Example configuration:
   ```yaml
   steps:
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/monisick-backend', '.']
   - name: 'gcr.io/cloud-builders/gcloud'
     args: ['run', 'deploy', 'monisick-backend', '--image', 'gcr.io/$PROJECT_ID/monisick-backend', '--region', 'asia-southeast2']

   images:
   - 'gcr.io/$PROJECT_ID/monisick-backend'
   ```

3. **Deploy to Cloud Run**:  
   Once configured, every push to the monitored branch will:
   - Build the container image.
   - Deploy the updated container to Cloud Run.
