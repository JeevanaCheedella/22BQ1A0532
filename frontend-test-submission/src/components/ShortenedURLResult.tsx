import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Tooltip
} from '@mui/material';
import { ContentCopy, OpenInNew, Schedule } from '@mui/icons-material';
import { ShortenedURL } from '../types';
import { logger } from '../../../logging-middleware';

interface ShortenedURLResultProps {
  shortenedUrl: ShortenedURL;
}

const ShortenedURLResult: React.FC<ShortenedURLResultProps> = ({ shortenedUrl }) => {
  // Ensure dates are Date objects
  const createdAt = shortenedUrl.createdAt instanceof Date
    ? shortenedUrl.createdAt
    : new Date(shortenedUrl.createdAt);
  const expiryAt = shortenedUrl.expiryAt instanceof Date
    ? shortenedUrl.expiryAt
    : new Date(shortenedUrl.expiryAt);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl.shortenedUrl);
      logger.info('URL copied to clipboard', { shortcode: shortenedUrl.shortcode });
    } catch (error) {
      logger.error('Failed to copy URL to clipboard', { error, shortcode: shortenedUrl.shortcode });
    }
  };

  const handleOpenOriginal = () => {
    try {
      window.open(shortenedUrl.originalUrl, '_blank', 'noopener,noreferrer');
      logger.info('Original URL opened', { shortcode: shortenedUrl.shortcode });
    } catch (error) {
      logger.error('Failed to open original URL', { error, shortcode: shortenedUrl.shortcode });
    }
  };

  const isExpired = new Date() > expiryAt;
  const timeUntilExpiry = expiryAt.getTime() - new Date().getTime();
  const minutesUntilExpiry = Math.max(0, Math.floor(timeUntilExpiry / (1000 * 60)));

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="primary" gutterBottom>
              {shortenedUrl.shortenedUrl}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Original: {shortenedUrl.originalUrl}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Schedule />}
                label={
                  isExpired 
                    ? 'Expired' 
                    : `Expires in ${minutesUntilExpiry} minutes`
                }
                color={isExpired ? 'error' : 'success'}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                Created: {createdAt.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Tooltip title="Copy short URL">
                <Button
                  startIcon={<ContentCopy />}
                  variant="outlined"
                  size="small"
                  onClick={handleCopyToClipboard}
                >
                  Copy
                </Button>
              </Tooltip>
              <Tooltip title="Open original URL">
                <Button
                  startIcon={<OpenInNew />}
                  variant="outlined"
                  size="small"
                  onClick={handleOpenOriginal}
                  disabled={isExpired}
                >
                  Open
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ShortenedURLResult;