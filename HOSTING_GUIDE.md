# Hosting Guide for Sekure Admin Dashboard

This guide provides step-by-step instructions to host the Sekure Admin Dashboard (Next.js application) on a server using Nginx as a reverse proxy, PM2 for process management, and SSL certification.

## Prerequisites

-   Ubuntu/Debian server with sudo access
-   Node.js 20+ installed
-   Git installed
-   Domain name pointing to your server IP

## Step 1: Server Preparation

### Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 Globally

```bash
sudo npm install -g pm2
```

### Install Nginx

```bash
sudo apt install nginx -y
```

### Install Certbot for SSL

```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## Step 2: Deploy Application

### Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/Sekuretechnologies/adminskr.git
cd adminskr
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env` file with production values:

```bash
cp .env.example .env  # If you have an example file
# Or create manually:
nano .env
```

Add your production environment variables:

```
NEXT_PUBLIC_API_URI=https://your-api-domain.com
# Add other required environment variables
```

### Build Application

```bash
npm run build
```

### Start with PM2

```bash
PORT=3007 pm2 start npm --name "sekure-admin" -- start
pm2 save
pm2 startup
```

Verify PM2 status:

```bash
pm2 status
pm2 logs sekure-admin
```

## Step 3: Configure Nginx

### Modify Default Nginx Configuration

Since `console.getsekure.com` is already configured in the default site, modify it directly:

```bash
sudo nano /etc/nginx/sites-available/default
```

Find the server block for `console.getsekure.com` and replace it with:

```nginx
server {
    listen 80;
    server_name console.getsekure.com;

    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: SSL Certification

### Obtain SSL Certificate

```bash
sudo certbot --nginx -d console.getsekure.com
```

### Verify SSL

```bash
sudo certbot certificates
```

### Auto-renewal Setup

Certbot sets up automatic renewal by default. Test it:

```bash
sudo certbot renew --dry-run
```

## Step 5: Firewall Configuration

### Configure UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

## Step 6: Monitoring and Maintenance

### PM2 Monitoring

```bash
pm2 monit
```

### View Logs

```bash
pm2 logs sekure-admin
```

### Restart Application

```bash
pm2 restart sekure-admin
```

### Update Application

```bash
cd /home/ubuntu/adminskr
git pull origin main
npm install
npm run build
pm2 restart sekure-admin
```

## Troubleshooting

### Common Issues

1. **Port 80/443 already in use**

    ```bash
    sudo netstat -tulpn | grep :80
    sudo netstat -tulpn | grep :443
    ```

2. **Conflicting server name warning**

    If you see a warning like "conflicting server name 'console.getsekure.com' on 0.0.0.0:80, ignored", it means there's an existing Nginx configuration for the same domain (likely in the default site).

    **Check existing configurations:**

    ```bash
    sudo ls -la /etc/nginx/sites-enabled/
    sudo grep -r "console.getsekure.com" /etc/nginx/sites-available/
    ```

    **For console.getsekure.com specifically:**

    Since `console.getsekure.com` is already configured in the default site, you have two options:

    **Option A: Modify the existing default configuration**

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Replace the existing server block for `console.getsekure.com` with:

    ```nginx
    server {
        listen 80;
        server_name console.getsekure.com;

        location / {
            proxy_pass http://localhost:3007;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    Then remove the duplicate sekure-admin configuration:

    ```bash
    sudo rm /etc/nginx/sites-enabled/sekure-admin
    sudo systemctl reload nginx
    ```

    **Option B: Remove the domain from default and use the new configuration**

    ```bash
    sudo nano /etc/nginx/sites-available/default
    # Remove or comment out the console.getsekure.com server block
    sudo nginx -t
    sudo systemctl reload nginx
    ```

3. **Nginx fails to start**

    ```bash
    sudo nginx -t
    sudo systemctl status nginx
    ```

4. **Application not accessible**

    - Check PM2 status: `pm2 status`
    - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
    - Check application logs: `pm2 logs sekure-admin`
    - **If getting Apache default page**: Apache might be running instead of Nginx

        ```bash
        # Check if Apache is running
        sudo systemctl status apache2

        # Stop Apache if it's running
        sudo systemctl stop apache2
        sudo systemctl disable apache2

        # Ensure Nginx is running
        sudo systemctl start nginx
        sudo systemctl enable nginx
        sudo systemctl status nginx

        # Check what services are listening on ports 80/443
        sudo netstat -tulpn | grep -E ':80|:443'
        ```

5. **SSL certificate issues**
    ```bash
    sudo certbot certificates
    sudo certbot renew
    ```

## Security Considerations

1. **Keep system updated**: Regular `sudo apt update && sudo apt upgrade`
2. **Use strong passwords**: For server access and database
3. **Configure fail2ban**: To prevent brute force attacks
4. **Regular backups**: Backup application and database
5. **Monitor logs**: Regularly check system and application logs

## Performance Optimization

1. **Enable gzip compression** in Nginx:

    ```nginx
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    ```

2. **Set up caching** for static assets

3. **Configure PM2 cluster mode** for better performance:
    ```bash
    PORT=3007 pm2 start npm --name "sekure-admin" -i max -- start
    ```

## Backup Strategy

### Application Backup

```bash
tar -czf sekure-admin-backup-$(date +%Y%m%d).tar.gz /home/ubuntu/adminskr
```

### Database Backup (if applicable)

Configure automated database backups based on your database type.

---

**Note**: Replace `your-domain.com` with your actual domain name throughout this guide.
