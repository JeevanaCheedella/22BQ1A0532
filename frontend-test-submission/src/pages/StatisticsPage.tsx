import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Collapse,
  IconButton,
  Alert
} from '@mui/material';
import { 
  BarChart, 
  ExpandMore, 
  ExpandLess, 
  Schedule,
  Mouse,
  LocationOn,
  Language
} from '@mui/icons-material';
import { useURLShortener } from '../context/URLShortenerContext';
import { logger } from '../../../logging-middleware';
import { ClickDetail, ShortenedURL } from '../types';

const StatisticsPage: React.FC = () => {
  const { shortenedUrls, addClick } = useURLShortener();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const simulateClick = (shortcode: string) => {
    try {
      const mockClick: ClickDetail = {
        id: Date.now().toString(),
        timestamp: new Date(),
        referrer: window.location.origin,
        location: 'New York, US',
        userAgent: navigator.userAgent
      };
      addClick(shortcode, mockClick);
      logger.info('Simulated click added', { shortcode, clickId: mockClick.id });
    } catch (error) {
      logger.error('Failed to simulate click', { shortcode, error });
    }
  };

  const totalClicks = shortenedUrls.reduce((sum: number, url: ShortenedURL) => sum + url.clickCount, 0);
  const activeUrls = shortenedUrls.filter(url => new Date() <= (url.expiryAt instanceof Date ? url.expiryAt : new Date(url.expiryAt))).length;
  const expiredUrls = shortenedUrls.length - activeUrls;

  if (shortenedUrls.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart />
          Statistics
        </Typography>
        <Alert severity="info">
          No shortened URLs found. Create some URLs first to see statistics here.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChart />
        Statistics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analytics and click tracking for all your shortened URLs.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total URLs
              </Typography>
              <Typography variant="h4">
                {shortenedUrls.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Clicks
              </Typography>
              <Typography variant="h4" color="primary">
                {totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active URLs
              </Typography>
              <Typography variant="h4" color="success.main">
                {activeUrls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Expired URLs
              </Typography>
              <Typography variant="h4" color="error.main">
                {expiredUrls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Statistics Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shortened URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Expires</TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shortenedUrls.map((url: ShortenedURL) => {
                const createdAt = url.createdAt instanceof Date ? url.createdAt : new Date(url.createdAt);
                const expiryAt = url.expiryAt instanceof Date ? url.expiryAt : new Date(url.expiryAt);
                const isExpired = new Date() > expiryAt;
                const isExpanded = expandedRows.has(url.id || url.shortcode);

                return (
                  <React.Fragment key={url.id || url.shortcode}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2" color="primary">
                          {url.shortenedUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isExpired ? 'Expired' : 'Active'}
                          color={isExpired ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Mouse fontSize="small" />
                          <Typography variant="h6">{url.clickCount}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {createdAt.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {createdAt.toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {expiryAt.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {expiryAt.toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => simulateClick(url.shortcode)}
                          disabled={isExpired}
                          aria-label={`Simulate click for ${url.shortenedUrl}`}
                        >
                          Simulate Click
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => toggleRowExpansion(url.id || url.shortcode)}
                          size="small"
                          aria-label={isExpanded ? 'Hide details' : 'Show details'}
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Click Details
                            </Typography>
                            {url.clicks.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Referrer</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>User Agent</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {url.clicks.map((click: ClickDetail) => (
                                    <TableRow key={click.id}>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Schedule fontSize="small" />
                                          {(click.timestamp instanceof Date ? click.timestamp : new Date(click.timestamp)).toLocaleString()}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Language fontSize="small" />
                                          {click.referrer}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <LocationOn fontSize="small" />
                                          {click.location}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="caption">
                                          {click.userAgent}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Alert severity="info">
                                No clicks recorded yet. Use the "Simulate Click" button to test the tracking.
                              </Alert>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StatisticsPage;